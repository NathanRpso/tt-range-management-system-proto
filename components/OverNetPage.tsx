'use client';

import React, { useState, useRef, useEffect } from 'react';
import { mockOverNetShots } from '@/data/mockData';

type SortKey = 'bay' | 'time' | 'height';
type SortDir = 'asc' | 'desc';
type ViewMode = 'heatmap' | 'single';

// Boundary path: curved vertical line on right side of range (top-down bird's-eye view)
const BOUNDARY_PATH = 'M 348 68 C 342 115 332 170 328 230 C 325 285 329 340 334 395 C 337 435 342 482 347 528';

// Map bay number (1-9) to approximate (x, y) position along the boundary
const BAY_BOUNDARY: Record<number, { x: number; y: number }> = {
  1: { x: 345, y: 90  },
  2: { x: 340, y: 135 },
  3: { x: 334, y: 180 },
  4: { x: 329, y: 225 },
  5: { x: 327, y: 272 },
  6: { x: 329, y: 318 },
  7: { x: 332, y: 360 },
  8: { x: 336, y: 402 },
  9: { x: 341, y: 450 },
};

// Flag / target markers scattered in the range field
const flagMarkers = [
  { x: 252, y: 302, type: 'red'    as const },
  { x: 280, y: 348, type: 'hollow' as const },
  { x: 258, y: 390, type: 'yellow' as const },
  { x: 272, y: 428, type: 'blue'   as const },
  { x: 252, y: 468, type: 'black'  as const },
  { x: 235, y: 503, type: 'hollow' as const },
  { x: 268, y: 505, type: 'hollow' as const },
];

// Tee bay dots at bottom (9 bays)
const bayDots = Array.from({ length: 9 }, (_, i) => ({ x: 104 + i * 32, y: 568, bay: i + 1 }));

// Dotted reference line below bays
const refDots = Array.from({ length: 20 }, (_, i) => ({ x: 70 + i * 15, y: 594 }));

// Seeded jitter so single-shot dots don't jump on re-render
function jitter(seed: number, range: number) {
  return ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1) * range - range / 2;
}

const HEIGHT_OPTIONS = [
  { label: 'All over net heights', min: 0 },
  { label: '> 5 yards',            min: 5 },
  { label: '> 10 yards',           min: 10 },
  { label: '> 20 yards',           min: 20 },
];

function getPeriodRange(p: string, today: string): [string, string] {
  const d = new Date(today);
  const fmt = (dt: Date) => dt.toISOString().split('T')[0];
  if (p === 'This month') {
    return [fmt(new Date(d.getFullYear(), d.getMonth(), 1)), today];
  }
  if (p === 'Last 7 days') {
    const s = new Date(d); s.setDate(s.getDate() - 6); return [fmt(s), today];
  }
  if (p === 'Last 30 days') {
    const s = new Date(d); s.setDate(s.getDate() - 29); return [fmt(s), today];
  }
  return [today, today];
}

export default function OverNetPage() {
  const today = new Date().toISOString().split('T')[0];
  const [period, setPeriod]         = useState('This month');
  const [startDate, setStartDate]   = useState(() => getPeriodRange('This month', new Date().toISOString().split('T')[0])[0]);
  const [endDate, setEndDate]       = useState(() => getPeriodRange('This month', new Date().toISOString().split('T')[0])[1]);
  const [selectedBays, setSelectedBays] = useState<number[]>([1,2,3,4,5,6,7,8,9]);
  const [bayDropOpen, setBayDropOpen]   = useState(false);
  const [minHeight, setMinHeight]   = useState(0);
  const [sortKey, setSortKey]       = useState<SortKey>('time');
  const [sortDir, setSortDir]       = useState<SortDir>('desc');
  const [viewMode, setViewMode]     = useState<ViewMode>('heatmap');
  const [zoom, setZoom]             = useState(1);
  const vizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = vizRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom(z => Math.min(2.5, Math.max(0.4, z - e.deltaY * 0.001)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filtered = mockOverNetShots.filter(s => {
    const dateStr = s.time.slice(0, 10);
    return dateStr >= startDate && dateStr <= endDate
      && selectedBays.includes(s.bay)
      && s.height > minHeight;
  });

  const handlePeriodChange = (p: string) => {
    setPeriod(p);
    const [s, e] = getPeriodRange(p, today);
    if (p !== 'custom') { setStartDate(s); setEndDate(e); }
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start); setEndDate(end); setPeriod('custom');
  };

  const toggleBay = (bay: number) =>
    setSelectedBays(prev => prev.includes(bay) ? prev.filter(b => b !== bay) : [...prev, bay].sort((a,b)=>a-b));

  // ── Sorting ──────────────────────────────────────────────────────────────────
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const sorted = [...filtered].sort((a, b) => {
    const cmp = sortKey === 'bay' ? a.bay - b.bay
      : sortKey === 'time' ? a.time.localeCompare(b.time)
      : a.height - b.height;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  // ── Diagram data derived from filtered shots ──────────────────────────────────
  // Heatmap: group by bay, cluster at bay's boundary position, radius scales with count
  const clustersByBay: Record<number, { x: number; y: number; count: number; r: number }> = {};
  filtered.forEach(s => {
    if (!clustersByBay[s.bay]) {
      const pos = BAY_BOUNDARY[s.bay] ?? { x: 335, y: 300 };
      clustersByBay[s.bay] = { ...pos, count: 0, r: 0 };
    }
    clustersByBay[s.bay].count++;
  });
  const heatmapClusters = Object.values(clustersByBay).map(c => ({
    ...c, r: Math.max(7, Math.min(20, 6 + Math.sqrt(c.count) * 3)),
  }));

  // Single shots: one dot per shot, jittered around bay boundary position
  const singleShots = filtered.map((s, i) => {
    const pos = BAY_BOUNDARY[s.bay] ?? { x: 335, y: 300 };
    return { x: pos.x + jitter(i * 3 + s.bay, 10), y: pos.y + jitter(i * 3 + s.bay + 1, 14) };
  });

  const SortArrows = ({ col }: { col: SortKey }) => (
    <span style={{ marginLeft: 3, fontSize: 10, color: sortKey === col ? '#334155' : '#94a3b8' }}>
      {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↑↓'}
    </span>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header row */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold" style={{ color: '#1e293b' }}>Over net</h1>
          <div
            className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold cursor-pointer border"
            style={{ borderColor: '#cbd5e1', color: '#64748b', fontSize: 11 }}
          >i</div>
          <span className="text-sm font-medium" style={{ color: '#64748b' }}>{filtered.length} shots</span>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border"
          style={{ borderColor: '#e2e8f0', backgroundColor: '#fff', color: '#1e293b' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1.5 9.5L6.5 12L11.5 9.5V1H1.5V9.5Z" stroke="#64748b" strokeWidth="1.2" fill="none"/>
            <path d="M4.5 5.5L6.5 7.5L8.5 5.5M6.5 7.5V2.5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-end gap-3 px-6 pb-4 flex-wrap">
        {/* Period preset */}
        <div>
          <select
            value={period}
            onChange={e => handlePeriodChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border"
            style={{ borderColor: '#e2e8f0', backgroundColor: '#fff', color: '#1e293b' }}
          >
            <option>This month</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            {period === 'custom' && <option value="custom">Custom range</option>}
          </select>
        </div>

        {/* Start date */}
        <div>
          <div className="text-xs mb-1" style={{ color: '#64748b' }}>Start date</div>
          <input
            type="date"
            value={startDate}
            max={today}
            onChange={e => handleDateChange(e.target.value, endDate)}
            className="px-3 py-1.5 rounded-lg border text-sm"
            style={{ borderColor: '#e2e8f0', backgroundColor: '#fff', color: '#1e293b' }}
          />
        </div>

        {/* End date */}
        <div>
          <div className="text-xs mb-1" style={{ color: '#64748b' }}>End date</div>
          <input
            type="date"
            value={endDate}
            max={today}
            onChange={e => handleDateChange(startDate, e.target.value)}
            className="px-3 py-1.5 rounded-lg border text-sm"
            style={{ borderColor: '#e2e8f0', backgroundColor: '#fff', color: '#1e293b' }}
          />
        </div>

        {/* Bays multi-select */}
        <div className="relative">
          <div className="text-xs mb-1" style={{ color: '#64748b' }}>Bays</div>
          <button
            onClick={() => setBayDropOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white text-sm"
            style={{ borderColor: bayDropOpen ? '#3b82f6' : '#e2e8f0', color: '#1e293b' }}
          >
            <span>{selectedBays.length === 9 ? 'All bays' : `${selectedBays.length} bay${selectedBays.length !== 1 ? 's' : ''} selected`}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {bayDropOpen && (
            <div
              className="absolute top-full left-0 mt-1 rounded-lg border bg-white shadow-lg z-30 p-2"
              style={{ borderColor: '#e2e8f0', minWidth: 140 }}
            >
              <button
                onClick={() => setSelectedBays(selectedBays.length === 9 ? [] : [1,2,3,4,5,6,7,8,9])}
                className="w-full text-left text-xs px-2 py-1 rounded hover:bg-slate-50 font-medium mb-1"
                style={{ color: '#475569' }}
              >
                {selectedBays.length === 9 ? 'Deselect all' : 'Select all'}
              </button>
              {[1,2,3,4,5,6,7,8,9].map(b => (
                <label key={b} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-sm">
                  <input type="checkbox" checked={selectedBays.includes(b)} onChange={() => toggleBay(b)} className="accent-blue-500"/>
                  <span style={{ color: '#1e293b' }}>Bay {b}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Height filter */}
        <div>
          <select
            value={minHeight}
            onChange={e => setMinHeight(+e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border"
            style={{ borderColor: '#e2e8f0', backgroundColor: '#fff', color: '#1e293b', marginTop: 18 }}
          >
            {HEIGHT_OPTIONS.map(o => <option key={o.min} value={o.min}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-0 px-6 pb-6" style={{ height: 560 }}>
        {/* Left: Table */}
        <div
          className="flex flex-col rounded-l-xl border-l border-t border-b bg-white overflow-hidden"
          style={{ borderColor: '#e2e8f0', width: 500, flexShrink: 0 }}
        >
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm border-collapse">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="text-left px-4 py-3 font-semibold cursor-pointer select-none" style={{ color: '#475569', fontSize: 13 }} onClick={() => handleSort('bay')}>
                    Bay ID<SortArrows col="bay" />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold cursor-pointer select-none" style={{ color: '#475569', fontSize: 13 }} onClick={() => handleSort('time')}>
                    Time<SortArrows col="time" />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold cursor-pointer select-none" style={{ color: '#475569', fontSize: 13 }} onClick={() => handleSort('height')}>
                    Over net height [yard]<SortArrows col="height" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-sm" style={{ color: '#94a3b8' }}>No shots match current filters</td></tr>
                ) : sorted.map((shot, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5" style={{ color: '#0077cc', fontWeight: 500 }}>{shot.bay}</td>
                    <td className="px-4 py-2.5" style={{ color: shot.highlight ? '#0077cc' : '#475569' }}>{shot.time}</td>
                    <td className="px-4 py-2.5" style={{ color: shot.highlight ? '#0077cc' : '#1e293b' }}>{shot.height.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center py-2 border-t" style={{ borderColor: '#f1f5f9' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 5.5L7 8.5L10 5.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, backgroundColor: '#e2e8f0', flexShrink: 0 }} />

        {/* Right: Visualization */}
        <div
          className="flex-1 rounded-r-xl border-r border-t border-b bg-white flex flex-col overflow-hidden"
          style={{ borderColor: '#e2e8f0' }}
        >
          {/* Viz controls header */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-0">
              {(['heatmap','single'] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className="px-4 py-1.5 text-sm font-medium border-b-2 transition-colors"
                  style={{ borderBottomColor: viewMode === m ? '#1e293b' : 'transparent', color: viewMode === m ? '#1e293b' : '#94a3b8', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                >
                  {m === 'heatmap' ? 'Heat map' : 'Single shots'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.min(2.5, z + 0.3))} className="w-8 h-8 flex items-center justify-center rounded border" style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }} title="Zoom in">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#64748b" strokeWidth="1.4"/><path d="M10.5 10.5L14 14" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/><path d="M7 4.5V9.5M4.5 7H9.5" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.3))} className="w-8 h-8 flex items-center justify-center rounded border" style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }} title="Zoom out">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#64748b" strokeWidth="1.4"/><path d="M10.5 10.5L14 14" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/><path d="M4.5 7H9.5" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
              <button onClick={() => setZoom(1)} className="w-8 h-8 flex items-center justify-center rounded border" style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }} title="Reset zoom">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2V7M7 7H12M7 7L2 7M7 7V12" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: '#f1f5f9' }} />

          {/* SVG canvas */}
          <div ref={vizRef} className="flex-1 overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
            <svg width="100%" height="100%" viewBox="0 0 430 620"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
            >
              <defs>
                <radialGradient id="fieldGrad" cx="40%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </radialGradient>
              </defs>

              {/* Range field background */}
              <rect width="430" height="620" fill="url(#fieldGrad)" />

              {/* Boundary / net line */}
              <path d={BOUNDARY_PATH} stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Reference markers along boundary */}
              {[68,110,155,200,245,290,335,378,420,462,505,528].map(approxY => {
                const t = (approxY - 68) / (528 - 68);
                const approxX = 348 - t * 12 + Math.sin(t * Math.PI) * (-8);
                return <circle key={approxY} cx={approxX} cy={approxY} r="2.5" fill="#9ca3af" />;
              })}

              {/* Flag / target markers */}
              {flagMarkers.map((m, i) => {
                const r = 5.5;
                if (m.type === 'hollow') return <circle key={i} cx={m.x} cy={m.y} r={r} fill="none" stroke="#9ca3af" strokeWidth="1.5" />;
                const colors: Record<string, string> = { red: '#ef4444', yellow: '#eab308', blue: '#3b82f6', black: '#1e293b' };
                return <circle key={i} cx={m.x} cy={m.y} r={r} fill={colors[m.type]} />;
              })}

              {/* Bay tee dots */}
              {bayDots.map(b => (
                <g key={b.bay}>
                  <circle
                    cx={b.x} cy={b.y} r="5"
                    fill={selectedBays.includes(b.bay) ? '#cbd5e1' : '#f1f5f9'}
                    stroke={selectedBays.includes(b.bay) ? '#94a3b8' : '#e2e8f0'}
                    strokeWidth="1"
                  />
                  <text x={b.x} y={b.y + 14} textAnchor="middle" fontSize="8" fill="#94a3b8">{b.bay}</text>
                </g>
              ))}

              {/* Dotted reference line */}
              {refDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="1.5" fill="#cbd5e1" />)}

              {/* Over-net shots */}
              {viewMode === 'heatmap' ? (
                heatmapClusters.map((c, i) => (
                  <g key={i}>
                    <circle cx={c.x} cy={c.y} r={c.r} fill="#ef4444" />
                    <text x={c.x} y={c.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={c.r > 12 ? 11 : 9} fontWeight="700" fill="#fff">
                      {c.count}
                    </text>
                  </g>
                ))
              ) : (
                singleShots.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r="4" fill="#ef4444" />
                ))
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <text x="215" y="310" textAnchor="middle" fontSize="13" fill="#94a3b8">No shots match current filters</text>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Close bay dropdown on outside click */}
      {bayDropOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setBayDropOpen(false)} />
      )}
    </div>
  );
}
