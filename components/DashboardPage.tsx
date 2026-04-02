'use client';

import React, { useState } from 'react';

// ── Mock data ────────────────────────────────────────────────────────────────

const DAYS = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'];
const HOURS = ['00:00\n01:00','01:00\n02:00','02:00\n03:00','03:00\n04:00','04:00\n05:00','05:00\n06:00','06:00\n07:00','07:00\n08:00','08:00\n09:00','09:00\n10:00','10:00\n11:00','11:00\n12:00','12:00\n13:00','13:00\n14:00','14:00\n15:00','15:00\n16:00','16:00\n17:00','17:00\n18:00','18:00\n19:00','19:00\n20:00','20:00\n21:00','21:00\n22:00','22:00\n23:00','23:00\n24:00'];

// 7 rows × 24 cols — simulated peak activity
const peakData: number[][] = DAYS.map((_, di) =>
  HOURS.map((_, hi) => {
    const base =
      hi < 7 ? 0
      : hi < 9 ? 30 + di * 10
      : hi < 12 ? 120 + di * 20 + hi * 15
      : hi < 14 ? 200 + di * 25
      : hi < 18 ? 300 + di * 30 + hi * 10
      : hi < 21 ? 250 + di * 20
      : 80 + di * 5;
    return Math.min(517, Math.max(0, base + Math.floor(Math.random() * 40)));
  })
);

const gameModes = [
  { label: 'Warm up',      shots: 19192, sessions: 420, pace: 46 },
  { label: 'Range Mode',   shots: 8400,  sessions: 310, pace: 27 },
  { label: 'Closest Pin',  shots: 4900,  sessions: 180, pace: 27 },
  { label: 'TopDrive',     shots: 3200,  sessions: 120, pace: 27 },
  { label: 'Around World', shots: 2100,  sessions: 90,  pace: 22 },
  { label: 'Bullseye',     shots: 1800,  sessions: 70,  pace: 18 },
  { label: 'Skills',       shots: 1500,  sessions: 60,  pace: 15 },
  { label: 'TopChip',      shots: 1100,  sessions: 45,  pace: 14 },
  { label: 'Par3',         shots: 900,   sessions: 38,  pace: 12 },
  { label: 'Approach',     shots: 700,   sessions: 30,  pace: 11 },
  { label: 'Course',       shots: 500,   sessions: 20,  pace: 9  },
  { label: 'Other',        shots: 300,   sessions: 15,  pace: 8  },
];

// Period-keyed KPI data
const periodKPIs: Record<string, { shots: string; sessions: string; avgLen: string; usage: string; shotsDelta: string; sessionsDelta: string; lenDelta: string; usageDelta: string; compareLabel: string }> = {
  'Last 7 days':    { shots: '19,240', sessions: '118', avgLen: '55 min', usage: '36.2%', shotsDelta: '+12.3%', sessionsDelta: '+8.1%', lenDelta: '+3.2 min', usageDelta: '+1.4%', compareLabel: 'Mar 13, 2026 – Mar 19, 2026' },
  'Last 30 days':   { shots: '84,786', sessions: '514', avgLen: '60 min', usage: '40.6%', shotsDelta: '+45.1%', sessionsDelta: '+34.6%', lenDelta: '+5.1 min', usageDelta: '+3.1%', compareLabel: 'Jan 14, 2026 – Feb 12, 2026' },
  'Last 90 days':   { shots: '231,400', sessions: '1,482', avgLen: '57 min', usage: '38.9%', shotsDelta: '+22.7%', sessionsDelta: '+18.4%', lenDelta: '+2.8 min', usageDelta: '+2.2%', compareLabel: 'Oct 19, 2025 – Jan 17, 2026' },
  'Last 12 months': { shots: '894,120', sessions: '5,910', avgLen: '54 min', usage: '35.8%', shotsDelta: '+9.3%', sessionsDelta: '+6.2%', lenDelta: '+1.1 min', usageDelta: '+0.9%', compareLabel: 'Mar 1, 2025 – Mar 27, 2025' },
};

// Period-keyed detailed view chart data — shotRate is shots/hour
type ChartDataset = { dates: string[]; shots: number[]; sessions: number[]; shotRate: number[]; players: number[]; length: number[]; usage: number[] };
const periodChartData: Record<string, ChartDataset> = {
  'Last 7 days': {
    dates:    ['Mar 21','Mar 22','Mar 23','Mar 24','Mar 25','Mar 26','Mar 27'],
    shots:    [2400,3100,2800,3600,4200,2100,1040],
    sessions: [34,44,40,51,59,31,15],
    shotRate: [49,53,50,55,57,47,42],
    players:  [1.9,2.1,2.0,2.2,2.3,1.8,1.7],
    length:   [49,52,51,55,57,48,44],
    usage:    [33,36,35,38,41,30,27],
  },
  'Last 30 days': {
    dates:    ['Feb 12','Feb 14','Feb 16','Feb 18','Feb 20','Feb 22','Feb 24','Feb 26','Feb 28','Mar 02','Mar 04','Mar 06','Mar 08','Mar 10','Mar 12','Mar 14','Mar 16','Mar 18'],
    shots:    [3400,3200,2800,3100,3200,4300,2900,3000,2200,1900,3100,3200,3400,3300,3500,3700,2100,1200],
    sessions: [48,45,40,47,46,60,44,43,34,30,46,48,50,49,52,55,33,20],
    shotRate: [53,51,48,52,52,56,50,51,47,45,52,52,53,53,54,55,48,43],
    players:  [2.0,1.9,1.8,2.0,2.0,2.2,1.9,1.9,1.7,1.7,2.0,2.0,2.1,2.1,2.1,2.2,1.8,1.6],
    length:   [50,48,46,49,49,55,48,49,44,43,48,49,51,50,52,53,47,42],
    usage:    [36,34,30,35,34,42,33,35,27,25,35,36,38,37,39,40,30,22],
  },
  'Last 90 days': {
    dates:    ['Jan 01','Jan 08','Jan 15','Jan 22','Jan 29','Feb 05','Feb 12','Feb 19','Feb 26','Mar 05','Mar 12','Mar 19','Mar 27'],
    shots:    [18200,21400,19800,24100,22500,26800,28400,25100,27800,29200,31400,28900,12100],
    sessions: [260,305,285,344,322,384,410,362,402,422,454,420,180],
    shotRate: [46,49,47,50,49,52,53,51,53,54,55,53,44],
    players:  [1.8,1.9,1.9,2.0,1.9,2.1,2.1,2.0,2.1,2.1,2.2,2.1,1.7],
    length:   [44,47,46,49,48,51,52,50,51,52,54,52,43],
    usage:    [29,32,31,36,34,39,41,37,40,42,45,41,28],
  },
  'Last 12 months': {
    dates:    ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
    shots:    [58400,72100,84200,91000,88300,75400,68900,62400,55800,71200,84600,81720],
    sessions: [840,1040,1210,1310,1270,1085,992,898,804,1025,1218,1180],
    shotRate: [44,47,50,52,52,48,46,44,43,47,50,50],
    players:  [1.7,1.9,2.0,2.1,2.1,1.9,1.8,1.7,1.6,1.9,2.0,2.0],
    length:   [43,47,50,52,51,48,46,44,41,47,50,49],
    usage:    [28,33,38,41,40,35,31,28,25,33,38,37],
  },
};

// Bay activity data per metric — Pace is shots/hour
const bayActivityByMetric: Record<string, { bay: number; value: number }[]> = {
  'Total shots':            [1,2,3,4,5,6,7,8,9].map((b,i) => ({ bay: b, value: [5800,9400,12100,5200,11800,12600,10900,8300,7100][i] })),
  'Number of sessions':     [1,2,3,4,5,6,7,8,9].map((b,i) => ({ bay: b, value: [82,133,172,74,168,179,155,118,101][i] })),
  'Pace':                   [1,2,3,4,5,6,7,8,9].map((b,i) => ({ bay: b, value: [49,53,55,47,54,56,52,50,48][i] })),
  'Players per session':    [1,2,3,4,5,6,7,8,9].map((b,i) => ({ bay: b, value: [1.9,2.2,2.6,1.7,2.5,2.7,2.4,2.0,1.8][i] })),
  'Average session length': [1,2,3,4,5,6,7,8,9].map((b,i) => ({ bay: b, value: [49,52,58,47,60,62,55,50,47][i] })),
  'Usage rate':             [1,2,3,4,5,6,7,8,9].map((b,i) => ({ bay: b, value: [38,44,51,35,49,53,46,41,37][i] })),
};

// Preset date ranges (computed dynamically from today)
function getPresetRange(p: string, today: string): [string, string] {
  const d = new Date(today);
  const fmt = (dt: Date) => dt.toISOString().split('T')[0];
  if (p === 'Last 7 days')    { const s = new Date(d); s.setDate(s.getDate() - 6);   return [fmt(s), today]; }
  if (p === 'Last 30 days')   { const s = new Date(d); s.setDate(s.getDate() - 29);  return [fmt(s), today]; }
  if (p === 'Last 90 days')   { const s = new Date(d); s.setDate(s.getDate() - 89);  return [fmt(s), today]; }
  if (p === 'Last 12 months') { const s = new Date(d); s.setFullYear(s.getFullYear() - 1); s.setDate(s.getDate() + 1); return [fmt(s), today]; }
  return [today, today];
}

// Prior comparison period label — same duration, immediately before current range
function getCompareLabel(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const days = Math.round((e.getTime() - s.getTime()) / 86400000);
  const priorEnd = new Date(s); priorEnd.setDate(priorEnd.getDate() - 1);
  const priorStart = new Date(priorEnd); priorStart.setDate(priorStart.getDate() - days);
  const fmtLabel = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmtLabel(priorStart)} – ${fmtLabel(priorEnd)}`;
}

// ── Custom date range helpers ─────────────────────────────────────────────────
function daysBetween(a: string, b: string): number {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function genDateLabels(start: string, end: string, points: number): string[] {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Array.from({ length: points }, (_, i) => {
    const d = new Date(s + (i / (points - 1)) * (e - s));
    return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`;
  });
}

function computeCustomData(start: string, end: string): ChartDataset & { kpi: typeof periodKPIs[string] } {
  const days = daysBetween(start, end);
  const scale = days / 30;
  const base30 = periodChartData['Last 30 days'];
  const pts = Math.min(18, Math.max(4, Math.round(days / 2)));
  const shots = Array.from({ length: pts }, (_, i) => Math.round(base30.shots[i % base30.shots.length] * scale * (0.9 + Math.random() * 0.2)));
  const sessions = shots.map(s => Math.round(s / 70));
  const shotRate = shots.map(() => Math.round((47 + Math.random() * 11)));
  const players = shots.map(() => +(1.7 + Math.random() * 0.6).toFixed(1));
  const length = shots.map(() => Math.round(44 + Math.random() * 16));
  const usage = shots.map(() => Math.round(28 + Math.random() * 18));
  const totalShots = shots.reduce((a, b) => a + b, 0);
  const totalSessions = sessions.reduce((a, b) => a + b, 0);
  const kpi = {
    shots: totalShots.toLocaleString(),
    sessions: totalSessions.toLocaleString(),
    avgLen: `${Math.round(length.reduce((a, b) => a + b, 0) / length.length)} min`,
    usage: `${Math.round(usage.reduce((a, b) => a + b, 0) / usage.length)}%`,
    shotsDelta: `+${(Math.random() * 40 + 5).toFixed(1)}%`,
    sessionsDelta: `+${(Math.random() * 30 + 3).toFixed(1)}%`,
    lenDelta: `+${(Math.random() * 6).toFixed(1)} min`,
    usageDelta: `+${(Math.random() * 4).toFixed(1)}%`,
    compareLabel: `${start} – ${end} (prior period)`,
  };
  return { dates: genDateLabels(start, end, pts), shots, sessions, shotRate, players, length, usage, kpi };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function heatColor(val: number, max: number): string {
  if (val === 0) return '#f8fafc';
  const t = val / max;
  if (t < 0.25) return `rgba(147,197,253,${0.3 + t * 1.5})`;
  if (t < 0.5)  return `rgba(96,165,250,${0.5 + t})`;
  if (t < 0.75) return `rgba(59,130,246,${0.6 + t * 0.5})`;
  return `rgba(29,78,216,${0.7 + t * 0.3})`;
}

function InfoBtn({ tooltip }: { tooltip: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-semibold"
        style={{ borderColor: '#94a3b8', color: '#94a3b8' }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >i</button>
      {show && (
        <div className="absolute left-6 top-0 z-20 w-64 p-3 rounded-lg shadow-lg text-xs" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#475569' }}>
          {tooltip}
        </div>
      )}
    </span>
  );
}

// ── Dual-handle range slider ──────────────────────────────────────────────────
function DualRangeSlider({
  min, max, valueMin, valueMax, onChangeMin, onChangeMax,
}: {
  min: number; max: number;
  valueMin: number; valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}) {
  const range = max - min || 1;
  const pctMin = ((valueMin - min) / range) * 100;
  const pctMax = ((valueMax - min) / range) * 100;
  return (
    <div className="relative" style={{ height: 20 }}>
      <style>{`
        .drs{-webkit-appearance:none;appearance:none;pointer-events:none;background:transparent;width:100%;height:100%;position:absolute;top:0;left:0;margin:0;outline:none;}
        .drs::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:all;width:16px;height:16px;border-radius:50%;background:#fff;border:2.5px solid #3b82f6;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.18);}
        .drs::-moz-range-thumb{pointer-events:all;width:14px;height:14px;border-radius:50%;background:#fff;border:2.5px solid #3b82f6;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.18);}
      `}</style>
      <div className="absolute" style={{ top: '50%', left: 0, right: 0, height: 4, transform: 'translateY(-50%)', backgroundColor: '#e2e8f0', borderRadius: 2 }}>
        <div style={{ position: 'absolute', left: `${pctMin}%`, right: `${100 - pctMax}%`, top: 0, bottom: 0, backgroundColor: '#3b82f6', borderRadius: 2 }}/>
      </div>
      <input type="range" min={min} max={max} value={valueMin} onChange={e => onChangeMin(Math.min(+e.target.value, valueMax - 1))} className="drs" style={{ zIndex: valueMin >= max - 1 ? 5 : 3 }}/>
      <input type="range" min={min} max={max} value={valueMax} onChange={e => onChangeMax(Math.max(+e.target.value, valueMin + 1))} className="drs" style={{ zIndex: 4 }}/>
    </div>
  );
}

function DownloadBtn() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="w-5 h-5 rounded-full border flex items-center justify-center"
        style={{ borderColor: '#94a3b8', color: '#94a3b8' }}
        onClick={() => setOpen(v => !v)}
        title="Download"
      >
        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
          <path d="M6 2v6M3 6l3 3 3-3M2 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)}/>
          <div
            className="absolute left-0 top-6 z-30 rounded-lg shadow-xl py-1"
            style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', minWidth: 140 }}
          >
            <div className="px-3 pt-2 pb-0.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#94a3b8' }}>Image</div>
            {['PNG', 'JPG', 'PDF'].map(fmt => (
              <button
                key={fmt}
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 py-1.5 text-sm transition-colors"
                style={{ color: '#1e293b' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {fmt}
              </button>
            ))}
            <div className="px-3 pt-2 pb-0.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#94a3b8', borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '8px' }}>Data</div>
            {['CSV', 'XLSX'].map(fmt => (
              <button
                key={fmt}
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 py-1.5 text-sm transition-colors"
                style={{ color: '#1e293b' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {fmt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Line chart with hover tooltips ───────────────────────────────────────────
function LineChart({ data, labels, unit = '', color = '#3b82f6', height = 160 }: { data: number[]; labels: string[]; unit?: string; color?: string; height?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data);
  const min = 0;
  const w = 700, h = height;
  const pad = { top: 12, right: 20, bottom: 32, left: 40 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const pts = data.map((v, i) => ({
    x: pad.left + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2),
    y: pad.top + chartH - ((v - min) / (max - min || 1)) * chartH,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = pathD + ` L${pts[pts.length-1].x},${pad.top + chartH} L${pts[0].x},${pad.top + chartH} Z`;

  const labelStep = Math.max(1, Math.floor(labels.length / 6));
  const yLines = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: pad.top + chartH - t * chartH,
    val: Math.round(min + t * (max - min)),
  }));

  // Tooltip x position: clamp so it doesn't overflow
  const ttW = 140;
  const ttH = 24;
  const ttX = (i: number) => Math.max(pad.left, Math.min(w - pad.right - ttW, pts[i].x - ttW / 2));
  const ttY = (i: number) => Math.max(4, pts[i].y - ttH - 10);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ overflow: 'visible' }}>
      {/* Y grid lines */}
      {yLines.map(({ y, val }) => (
        <g key={val}>
          <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#f1f5f9" strokeWidth="1"/>
          <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{val}</text>
        </g>
      ))}
      {/* Area fill */}
      <path d={areaD} fill={color} opacity="0.12"/>
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2"/>
      {/* Vertical hover line */}
      {hovered !== null && (
        <line
          x1={pts[hovered].x} y1={pad.top}
          x2={pts[hovered].x} y2={pad.top + chartH}
          stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2"
        />
      )}
      {/* Dots */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y}
          r={hovered === i ? 5 : 3}
          fill={color}
          stroke={hovered === i ? '#fff' : 'none'}
          strokeWidth="2"
        />
      ))}
      {/* Hover areas (invisible wide bands) */}
      {pts.map((p, i) => {
        const x0 = i === 0 ? 0 : (pts[i-1].x + p.x) / 2;
        const x1 = i === pts.length - 1 ? w : (p.x + pts[i+1].x) / 2;
        return (
          <rect
            key={i}
            x={x0} y={0}
            width={x1 - x0} height={h}
            fill="transparent"
            style={{ cursor: 'default' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        );
      })}
      {/* Tooltip */}
      {hovered !== null && (
        <g>
          <rect x={ttX(hovered)} y={ttY(hovered)} width={ttW} height={ttH} rx="4" fill="#1e293b"/>
          <text
            x={ttX(hovered) + ttW / 2}
            y={ttY(hovered) + ttH / 2 + 4}
            textAnchor="middle" fontSize="10" fill="#fff"
          >
            {labels[hovered]}: {data[hovered].toLocaleString()}{unit ? ` ${unit}` : ''}
          </text>
        </g>
      )}
      {/* X labels */}
      {labels.map((lbl, i) => {
        if (i % labelStep !== 0 && i !== labels.length - 1) return null;
        return (
          <text key={i} x={pts[i].x} y={h - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{lbl}</text>
        );
      })}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [period, setPeriod] = useState('Last 30 days');
  const [startDate, setStartDate] = useState(() => getPresetRange('Last 30 days', new Date().toISOString().split('T')[0])[0]);
  const [endDate, setEndDate] = useState(() => getPresetRange('Last 30 days', new Date().toISOString().split('T')[0])[1]);
  const [customData, setCustomData] = useState<ReturnType<typeof computeCustomData> | null>(null);
  const [gameModeMetric, setGameModeMetric] = useState<'shots' | 'pace' | 'time'>('shots');
  const [detailedMetric, setDetailedMetric] = useState<'shots' | 'sessions' | 'shotRate' | 'players' | 'length' | 'usage'>('shots');
  const [bayMetric, setBayMetric] = useState('Total shots');
  const [contrastOn, setContrastOn] = useState(false);
  const [bucketHours, setBucketHours] = useState(1);
  const [hoveredGM, setHoveredGM] = useState<number | null>(null);
  const [hoveredBay, setHoveredBay] = useState<number | null>(null);
  const [bayRangeMin, setBayRangeMin] = useState(0);
  const [bayRangeMax, setBayRangeMax] = useState(8); // 9 bays → indices 0-8
  const [dateRangeMin, setDateRangeMin] = useState(0);
  const [dateRangeMax, setDateRangeMax] = useState(999); // clamped to data length inline

  const bayMetricUnit: Record<string, string> = {
    'Total shots': 'shots',
    'Number of sessions': 'sessions',
    'Pace': 'shots/hr',
    'Players per session': 'players',
    'Average session length': 'min',
    'Usage rate': '%',
  };
  const detailMetricUnit: Record<string, string> = {
    shots: 'shots',
    sessions: 'sessions',
    shotRate: 'shots/hr',
    players: 'players',
    length: 'min',
    usage: '%',
  };

  const resetDateRange = () => { setDateRangeMin(0); setDateRangeMax(999); };

  const handlePeriodChange = (p: string) => {
    if (p === 'custom') return;
    setPeriod(p);
    setCustomData(null);
    const [s, e] = getPresetRange(p, today);
    setStartDate(s);
    setEndDate(e);
    resetDateRange();
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end && end >= start) {
      const presets = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months'];
      const match = presets.map(k => [k, getPresetRange(k, today)] as [string, [string, string]]).find(([, [s, e]]) => s === start && e === end);
      if (match) {
        setPeriod(match[0]);
        setCustomData(null);
      } else {
        setPeriod('custom');
        setCustomData(computeCustomData(start, end));
      }
      resetDateRange();
    }
  };

  const kpi = customData ? customData.kpi : (periodKPIs[period] ?? periodKPIs['Last 30 days']);
  const chartData: ChartDataset = customData ?? (periodChartData[period] ?? periodChartData['Last 30 days']);
  const currentBayData = bayActivityByMetric[bayMetric] ?? bayActivityByMetric['Total shots'];

  const maxPeak = 517;
  // For "time spent", compute total hours per game mode = shots / pace
  const gmTimeHours = (g: typeof gameModes[0]) => Math.round(g.shots / g.pace);
  const gmVal = (g: typeof gameModes[0]) =>
    gameModeMetric === 'shots' ? g.shots
    : gameModeMetric === 'pace' ? g.pace
    : gmTimeHours(g);
  const maxGM = Math.max(...gameModes.map(g => gmVal(g)));

  const detailData =
    detailedMetric === 'shots'    ? chartData.shots
    : detailedMetric === 'sessions' ? chartData.sessions
    : detailedMetric === 'shotRate' ? chartData.shotRate
    : detailedMetric === 'players'  ? chartData.players.map(v => +v.toFixed(1))
    : detailedMetric === 'length'   ? chartData.length
    : chartData.usage;

  // Heatmap: merge columns into bucketHours-wide buckets
  const numCols = Math.ceil(24 / bucketHours);
  const mergedPeak = DAYS.map((_, di) =>
    Array.from({ length: numCols }, (_, bi) => {
      const count = Math.min(bucketHours, 24 - bi * bucketHours);
      const sum = Array.from({ length: count }, (__, k) => peakData[di][bi * bucketHours + k]).reduce((a, b) => a + b, 0);
      return Math.round(sum / count);
    })
  );
  const mergedHourLabels = Array.from({ length: numCols }, (_, bi) => {
    const startH = bi * bucketHours;
    return `${String(startH).padStart(2, '0')}:00`;
  });

  // Game mode tooltip value/unit
  const gmTooltipText = (gm: typeof gameModes[0]) => {
    if (gameModeMetric === 'shots') return `${gm.shots.toLocaleString()} shots`;
    if (gameModeMetric === 'pace')  return `${gm.pace} shots/hr`;
    return `${gmTimeHours(gm).toLocaleString()} hrs`;
  };

  // Visible bay window from dual-range slider
  const safeMax = Math.min(bayRangeMax, currentBayData.length - 1);
  const visibleBayData = currentBayData.slice(bayRangeMin, safeMax + 1);

  // Visible date window from dual-range slider
  const safeDateMax = Math.min(dateRangeMax, detailData.length - 1);
  const visibleDetailData = detailData.slice(dateRangeMin, safeDateMax + 1);
  const visibleDetailLabels = chartData.dates.slice(dateRangeMin, safeDateMax + 1);

  return (
    <div className="p-6 bg-white min-h-full">
      {/* Date controls */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <select
          value={period}
          onChange={e => handlePeriodChange(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm font-medium"
          style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
        >
          {['Last 7 days','Last 30 days','Last 90 days','Last 12 months'].map(o => <option key={o}>{o}</option>)}
          {period === 'custom' && <option value="custom">Custom range</option>}
        </select>
        <div>
          <label className="text-xs block mb-0.5" style={{ color: '#94a3b8' }}>Start date</label>
          <div className="flex items-center border rounded px-2 py-1.5 gap-2" style={{ borderColor: '#e2e8f0' }}>
            <input type="date" value={startDate} max={today} onChange={e => handleDateChange(e.target.value, endDate)} className="text-sm outline-none" style={{ color: '#1e293b' }}/>
          </div>
        </div>
        <div>
          <label className="text-xs block mb-0.5" style={{ color: '#94a3b8' }}>End date</label>
          <div className="flex items-center border rounded px-2 py-1.5 gap-2" style={{ borderColor: '#e2e8f0' }}>
            <input type="date" value={endDate} max={today} onChange={e => handleDateChange(startDate, e.target.value)} className="text-sm outline-none" style={{ color: '#1e293b' }}/>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0">
          {/* Quick indicators */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-base" style={{ color: '#1e293b' }}>Quick indicators</h2>
              <InfoBtn tooltip="Quick indicators show aggregated data for the selected period. Total shots, sessions, average session length and usage rate." />
            </div>
            <div className="text-xs mb-4" style={{ color: '#94a3b8' }}>
              Compared to: {customData ? kpi.compareLabel : getCompareLabel(startDate, endDate)}
            </div>
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Total shots', value: kpi.shots, delta: kpi.shotsDelta },
                { label: 'Number of sessions', value: kpi.sessions, delta: kpi.sessionsDelta },
                { label: 'Average session length', value: kpi.avgLen, delta: kpi.lenDelta },
                { label: 'Usage rate', value: kpi.usage, delta: kpi.usageDelta },
              ].map(card => (
                <div key={card.label}>
                  <div className="text-xs mb-1 font-medium" style={{ color: '#64748b' }}>{card.label}</div>
                  <div className="text-3xl font-black mb-0.5" style={{ color: '#1e293b' }}>{card.value}</div>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                    <svg viewBox="0 0 10 10" fill="none" className="w-3 h-3">
                      <path d="M5 2l4 6H1l4-6z" fill="currentColor"/>
                    </svg>
                    {card.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak activity heatmap */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-bold text-base" style={{ color: '#1e293b' }}>Peak activity</h2>
              <InfoBtn tooltip="Shows the average number of shots per hour for each day of the week during the selected period." />
              <DownloadBtn />
            </div>

            <div className="overflow-x-auto">
              <div style={{ minWidth: '620px' }}>
                {/* Heatmap grid */}
                <div className="flex">
                  {/* Day labels */}
                  <div className="flex-shrink-0 mr-2" style={{ paddingTop: '2px' }}>
                    {DAYS.map(d => (
                      <div key={d} className="flex items-center justify-end pr-2 text-xs" style={{ height: '28px', color: '#94a3b8', fontSize: '11px' }}>{d}</div>
                    ))}
                  </div>
                  {/* Grid */}
                  <div className="flex-1">
                    {mergedPeak.map((row, di) => (
                      <div key={di} className="flex gap-px mb-px">
                        {row.map((val, bi) => (
                          <div
                            key={bi}
                            style={{
                              flex: 1,
                              height: '28px',
                              backgroundColor: contrastOn
                                ? val > 100 ? '#1d4ed8' : val > 50 ? '#93c5fd' : '#f8fafc'
                                : heatColor(val, maxPeak),
                              cursor: 'default',
                            }}
                            title={`${DAYS[di]} ${mergedHourLabels[bi]}: ${val}`}
                          />
                        ))}
                      </div>
                    ))}
                    {/* Hour labels */}
                    <div className="flex mt-1">
                      {mergedHourLabels.filter((_, i) => i % Math.max(1, Math.floor(numCols / 8)) === 0).map((h, i) => (
                        <div key={i} className="text-center" style={{ flex: Math.max(1, Math.floor(numCols / 8)), fontSize: '9px', color: '#94a3b8' }}>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scale bar */}
                <div className="flex items-center gap-2 mt-3 ml-[52px]">
                  <span className="text-xs" style={{ color: '#94a3b8' }}>0</span>
                  <div className="flex-1 h-2 rounded" style={{ background: 'linear-gradient(to right, #f8fafc, #93c5fd, #3b82f6, #1d4ed8)' }}/>
                  <span className="text-xs" style={{ color: '#94a3b8' }}>{maxPeak}</span>
                </div>

                {/* Contrast + Intervals */}
                <div className="flex items-center gap-6 mt-3 ml-[52px]">
                  <button
                    onClick={() => setContrastOn(v => !v)}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-all select-none"
                    style={{
                      backgroundColor: contrastOn ? '#1e40af' : '#f1f5f9',
                      color: contrastOn ? '#fff' : '#475569',
                      border: `1px solid ${contrastOn ? '#1d4ed8' : '#e2e8f0'}`,
                    }}
                  >
                    <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5" style={{ flexShrink: 0 }}>
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M7 1a6 6 0 010 12V1z" fill="currentColor"/>
                    </svg>
                    Contrast
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#64748b' }}>Intervals</span>
                    <input type="range" min="1" max="8" step="1" value={bucketHours} onChange={e => setBucketHours(+e.target.value)} className="w-24 h-1 accent-blue-500"/>
                    <span className="text-xs w-6" style={{ color: '#94a3b8' }}>{bucketHours}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed view */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-base" style={{ color: '#1e293b' }}>Detailed view</h2>
              <InfoBtn tooltip={'Data used in widget:\n• Total shots — All shots traced by Toptracer Range.\n• Number of sessions — Counts every session started.\n• Pace — Average shots per hour.\n• Players per session — Average number of players from each session.\n• Average session length — Rounded to closest integer.\n• Usage rate — Total game mode shots / total shots traced.'} />
              <DownloadBtn />
            </div>

            {/* Metric tabs */}
            <div className="flex gap-5 mb-4 border-b" style={{ borderColor: '#e2e8f0' }}>
              {([
                { id: 'shots',    label: 'Total shots' },
                { id: 'sessions', label: 'Number of sessions' },
                { id: 'shotRate', label: 'Pace' },
                { id: 'players',  label: 'Players per session' },
                { id: 'length',   label: 'Average session length' },
                { id: 'usage',    label: 'Usage rate' },
              ] as const).map(m => (
                <button key={m.id} onClick={() => setDetailedMetric(m.id)}
                  className="text-xs pb-2 border-b-2 -mb-px transition-colors whitespace-nowrap"
                  style={{
                    borderBottomColor: detailedMetric === m.id ? '#3b82f6' : 'transparent',
                    color: detailedMetric === m.id ? '#3b82f6' : '#94a3b8',
                    fontWeight: detailedMetric === m.id ? 600 : 400,
                  }}>
                  {m.label}
                </button>
              ))}
            </div>

            <LineChart
              data={visibleDetailData}
              labels={visibleDetailLabels}
              unit={detailMetricUnit[detailedMetric] ?? ''}
              color="#3b82f6"
              height={160}
            />

            {/* Date range slider */}
            <div className="mt-3 px-1">
              <DualRangeSlider
                min={0}
                max={detailData.length - 1}
                valueMin={dateRangeMin}
                valueMax={Math.min(dateRangeMax, detailData.length - 1)}
                onChangeMin={setDateRangeMin}
                onChangeMax={setDateRangeMax}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: '#94a3b8' }}>{chartData.dates[dateRangeMin]}</span>
                <span className="text-xs" style={{ color: '#94a3b8' }}>{chartData.dates[Math.min(dateRangeMax, chartData.dates.length - 1)]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-80 flex-shrink-0">
          {/* Game modes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base" style={{ color: '#1e293b' }}>Game modes</h2>
                <InfoBtn tooltip="Shows total activity by game mode for the selected period." />
                <DownloadBtn />
              </div>
              <div className="flex gap-3">
                {([['shots','Total shots'],['pace','Pace'],['time','Time spent']] as const).map(([id, label]) => (
                  <button key={id} onClick={() => setGameModeMetric(id)}
                    className="text-xs pb-1 border-b"
                    style={{
                      borderBottomColor: gameModeMetric === id ? '#3b82f6' : 'transparent',
                      color: gameModeMetric === id ? '#3b82f6' : '#94a3b8',
                      fontWeight: gameModeMetric === id ? 600 : 400,
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Game mode bar chart with hover tooltips */}
            <div className="overflow-hidden">
              <div className="flex items-end gap-1 h-40 mb-2">
                {gameModes.map((gm, i) => {
                  const pct = gmVal(gm) / maxGM;
                  const isHovered = hoveredGM === i;
                  return (
                    <div
                      key={i}
                      className="flex-1 min-w-0 flex flex-col items-center justify-end relative"
                      style={{ height: '100%' }}
                      onMouseEnter={() => setHoveredGM(i)}
                      onMouseLeave={() => setHoveredGM(null)}
                    >
                      {isHovered && (
                        <div
                          className="absolute bottom-full mb-1 left-1/2 z-10 text-xs px-2 py-1.5 rounded pointer-events-none"
                          style={{
                            backgroundColor: '#1e293b',
                            color: '#fff',
                            transform: 'translateX(-50%)',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            lineHeight: 1.4,
                          }}
                        >
                          <div className="font-semibold">{gm.label}</div>
                          <div style={{ color: '#93c5fd' }}>{gmTooltipText(gm)}</div>
                        </div>
                      )}
                      <div
                        className="w-full rounded-sm transition-all"
                        style={{
                          height: `${Math.max(pct * 90, 2)}%`,
                          backgroundColor: isHovered ? '#3b82f6' : '#93c5fd',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Circular icons row */}
              <div className="flex gap-1">
                {gameModes.map((gm, i) => (
                  <div key={i} className="flex-1 min-w-0 flex justify-center">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: '#cbd5e1' }} title={gm.label}>
                      <span style={{ fontSize: '9px' }}>⛳</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bay activity */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-base" style={{ color: '#1e293b' }}>Bay activity</h2>
              <InfoBtn tooltip="Shows activity per bay for the selected period. Use the slider to scroll through all bays." />
              <DownloadBtn />
            </div>

            {/* Bar chart */}
            {(() => {
              const maxVal = Math.max(...visibleBayData.map(b => b.value));
              const unit = bayMetricUnit[bayMetric] ?? '';
              return (
                <>
                  {/* Chart area with y-axis */}
                  <div className="flex gap-1">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-between pb-5" style={{ width: 36, flexShrink: 0 }}>
                      {[maxVal, Math.round(maxVal * 0.5), 0].map(v => (
                        <div key={v} className="text-right text-xs leading-none" style={{ color: '#94a3b8', fontSize: '9px' }}>
                          {v.toLocaleString()}
                        </div>
                      ))}
                    </div>

                    {/* Bars */}
                    <div className="flex-1 flex flex-col">
                      <div
                        className="flex gap-2 relative"
                        style={{ height: 120 }}
                      >
                        {/* Grid lines */}
                        {[1, 0.5].map(t => (
                          <div
                            key={t}
                            className="absolute left-0 right-0 pointer-events-none"
                            style={{
                              bottom: `${t * 100}%`,
                              borderTop: '1px solid #f1f5f9',
                            }}
                          />
                        ))}

                        {visibleBayData.map(b => {
                          const isHovered = hoveredBay === b.bay;
                          const barPct = maxVal > 0 ? (b.value / maxVal) * 100 : 0;
                          const tooltipVal = unit === '%'
                            ? `${b.value}%`
                            : `${b.value.toLocaleString()} ${unit}`;
                          return (
                            <div
                              key={b.bay}
                              className="flex-1 relative flex items-end"
                              style={{ height: '100%' }}
                              onMouseEnter={() => setHoveredBay(b.bay)}
                              onMouseLeave={() => setHoveredBay(null)}
                            >
                              {/* Dashed vertical guide */}
                              {isHovered && (
                                <div
                                  className="absolute pointer-events-none"
                                  style={{
                                    left: '50%',
                                    top: 0,
                                    bottom: 0,
                                    borderLeft: '1px dashed #94a3b8',
                                  }}
                                />
                              )}
                              {/* Tooltip */}
                              {isHovered && (
                                <div
                                  className="absolute z-20 pointer-events-none text-xs rounded px-2 py-1.5"
                                  style={{
                                    bottom: `calc(${barPct}% + 8px)`,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#1e293b',
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    lineHeight: 1.4,
                                  }}
                                >
                                  <div className="font-semibold">Bay {b.bay}</div>
                                  <div style={{ color: '#93c5fd' }}>{tooltipVal}</div>
                                </div>
                              )}
                              {/* Bar */}
                              <div
                                style={{
                                  width: '100%',
                                  height: `${Math.max(barPct, 1)}%`,
                                  backgroundColor: isHovered ? '#3b82f6' : '#93c5fd',
                                  borderRadius: '3px 3px 0 0',
                                  transition: 'background-color 0.15s',
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* X axis bay labels */}
                      <div className="flex gap-2 mt-1">
                        {visibleBayData.map(b => (
                          <div key={b.bay} className="flex-1 text-center text-xs" style={{ color: '#94a3b8', fontSize: '10px' }}>
                            {b.bay}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bay range slider */}
                  <div className="mt-3 px-1">
                    <DualRangeSlider
                      min={0}
                      max={currentBayData.length - 1}
                      valueMin={bayRangeMin}
                      valueMax={safeMax}
                      onChangeMin={setBayRangeMin}
                      onChangeMax={setBayRangeMax}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs" style={{ color: '#94a3b8' }}>Bay {currentBayData[bayRangeMin]?.bay}</span>
                      <span className="text-xs" style={{ color: '#94a3b8' }}>Bay {currentBayData[safeMax]?.bay}</span>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Metric tabs for bay activity */}
            <div className="flex gap-3 mt-4 border-t pt-3 flex-wrap" style={{ borderColor: '#f1f5f9' }}>
              {['Total shots','Number of sessions','Pace','Players per session','Average session length','Usage rate'].map(m => (
                <button key={m}
                  onClick={() => { setBayMetric(m); setBayRangeMin(0); setBayRangeMax(8); }}
                  className="text-xs pb-1 border-b whitespace-nowrap"
                  style={{
                    borderBottomColor: bayMetric === m ? '#3b82f6' : 'transparent',
                    color: bayMetric === m ? '#3b82f6' : '#94a3b8',
                    fontWeight: bayMetric === m ? 600 : 400,
                  }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
