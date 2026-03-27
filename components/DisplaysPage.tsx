'use client';

import React, { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Display {
  id: string;
  name: string;
  code: string;
  on: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'Event' | 'Leaderboard' | 'Image';
  status: 'FINISHED' | 'ACTIVE' | 'UPCOMING';
  displayingOn: string;
  theme: 'Dark' | 'Light';
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const mockDisplays: Display[] = [];

const mockContent: ContentItem[] = [
  { id: 'c1', title: 'Closest To The Pin Challenge - Closest To The Pin', type: 'Event', status: 'FINISHED', displayingOn: '', theme: 'Dark' },
  { id: 'c2', title: 'Closest To The Pin Challenge - Closest To The Pin', type: 'Event', status: 'FINISHED', displayingOn: '', theme: 'Dark' },
  { id: 'c3', title: 'Golf Complex Closest To Pin - Leaderboard', type: 'Event', status: 'FINISHED', displayingOn: '', theme: 'Dark' },
];

// ── Status badge colour ────────────────────────────────────────────────────────
const STATUS_COLORS: Record<ContentItem['status'], string> = {
  FINISHED: 'rgba(255,255,255,0.35)',
  ACTIVE: '#22c55e',
  UPCOMING: '#f59e0b',
};

// ── Type badge colour ──────────────────────────────────────────────────────────
const TYPE_COLORS: Record<ContentItem['type'], string> = {
  Event: '#e91e8c',
  Leaderboard: '#3b82f6',
  Image: '#8b5cf6',
};

// ── Displaying-on dropdown ─────────────────────────────────────────────────────
// Shared dropdown with click-away. displays = available display names.
function DisplayingOnDropdown({
  value, onChange, displays,
}: {
  value: string;
  onChange: (v: string) => void;
  displays: Display[];
}) {
  const [open, setOpen] = useState(false);
  const label = value || 'Select...';

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full border rounded px-3 py-2 flex items-center justify-between text-sm"
        style={{ borderColor: open ? '#3b82f6' : '#e2e8f0', color: value ? '#1e293b' : '#94a3b8', boxShadow: open ? '0 0 0 1px #3b82f6' : 'none' }}
        onClick={() => setOpen(v => !v)}
      >
        <span>{label}</span>
        <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4 flex-shrink-0">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <>
          {/* Click-away overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}/>
          <div
            className="absolute left-0 right-0 top-full mt-1 bg-white border rounded shadow-lg z-20"
            style={{ borderColor: '#e2e8f0' }}
          >
            <label className="flex items-center gap-2 px-3 py-2 border-b text-sm cursor-pointer hover:bg-slate-50" style={{ borderColor: '#f1f5f9', color: '#64748b' }}>
              <input
                type="checkbox"
                checked={value === '__all__'}
                onChange={e => { onChange(e.target.checked ? '__all__' : ''); setOpen(false); }}
                className="w-3.5 h-3.5"
              />
              Select all
            </label>
            {displays.length === 0 ? (
              <div className="px-3 py-2 text-sm" style={{ color: '#94a3b8' }}>No results found</div>
            ) : (
              displays.map(d => (
                <label key={d.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-50" style={{ color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={value === d.id}
                    onChange={e => { onChange(e.target.checked ? d.id : ''); setOpen(false); }}
                    className="w-3.5 h-3.5"
                  />
                  {d.name}
                </label>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Monitor illustration (empty state) ───────────────────────────────────────
function MonitorEmptyState() {
  return (
    <div className="flex flex-col items-center justify-start pt-16">
      <div className="relative" style={{ width: '340px' }}>
        <div
          className="rounded-lg flex items-center justify-center px-8 py-12 text-center"
          style={{ backgroundColor: '#1e2d3d', minHeight: '220px' }}
        >
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            No display has been configured. Click on Add display to get started!
          </p>
        </div>
        <div className="flex justify-center">
          <div style={{ width: '48px', height: '18px', backgroundColor: '#2d3d50' }}/>
        </div>
        <div className="flex justify-center">
          <div className="rounded-sm" style={{ width: '100px', height: '10px', backgroundColor: '#2d3d50' }}/>
        </div>
      </div>
    </div>
  );
}

// ── Add Display modal ─────────────────────────────────────────────────────────
function AddDisplayModal({ onClose, onAdd }: { onClose: () => void; onAdd: (d: Display) => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl w-[780px] p-8" style={{ zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-lg uppercase tracking-wide" style={{ color: '#1e293b' }}>ADD DISPLAY</h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: '#94a3b8' }}>×</button>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-6">
          {/* Step 1 */}
          <div>
            <div className="relative mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm absolute top-3 left-3 z-10" style={{ backgroundColor: '#3b82f6' }}>1</div>
              <div className="w-full rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '220px', background: 'linear-gradient(135deg, #8b6355 0%, #6b4c3b 100%)' }}>
                <div className="bg-black rounded p-4 w-56">
                  <div className="text-white text-xs mb-2 opacity-60">Search for:</div>
                  <div className="bg-gray-800 rounded px-2 py-1 mb-2 text-xs text-white opacity-80 truncate">https://www4.trms.toptracer.com/</div>
                  <div className="grid grid-cols-10 gap-0.5">
                    {['1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P'].map(k => (
                      <div key={k} className="bg-gray-700 rounded-sm text-white text-center py-0.5" style={{ fontSize: '7px' }}>{k}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs mb-1.5" style={{ color: '#64748b' }}>Type in this URL on your display:</p>
            <div className="border rounded px-3 py-2 text-sm" style={{ borderColor: '#e2e8f0', color: '#94a3b8', backgroundColor: '#f8fafc' }}>
              https://www4.trms.toptracer.com/leaderboard/
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="relative mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm absolute top-3 left-3 z-10" style={{ backgroundColor: '#3b82f6' }}>2</div>
              <div className="w-full rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '220px', background: 'linear-gradient(135deg, #8b6355 0%, #5a3d2b 100%)' }}>
                <div className="rounded p-6 text-center" style={{ backgroundColor: 'rgba(10,30,60,0.85)' }}>
                  <div className="text-xs mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>CODE FOR CONNECTING DISPLAY:</div>
                  <div className="font-black text-3xl tracking-widest border-2 px-6 py-3 rounded" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>CF6AWC</div>
                  <div className="mt-4 flex items-center justify-center gap-2 opacity-60">
                    <div className="w-4 h-4 bg-white rounded-sm"/>
                    <span className="text-xs text-white font-bold tracking-wider">TOPTRACER RANGE</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs mb-1.5" style={{ color: '#64748b' }}>Note the 6-character code on your display and type it in here:</p>
            <input
              className="w-full border rounded px-3 py-2 text-sm outline-none"
              style={{ borderColor: '#3b82f6', boxShadow: '0 0 0 1px #3b82f6' }}
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
              maxLength={6}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm mb-1.5" style={{ color: '#475569' }}>
            What do you want to name the display? *
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs" style={{ borderColor: '#94a3b8', color: '#94a3b8' }}>i</span>
          </label>
          <input
            className="w-64 border rounded px-3 py-2 text-sm outline-none"
            style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => { if (name && code.length === 6) { onAdd({ id: Date.now().toString(), name, code, on: true }); onClose(); } }}
            className="px-6 py-2 rounded text-white font-semibold text-sm"
            style={{ backgroundColor: '#22c55e' }}
          >
            Add display
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Content modal ─────────────────────────────────────────────────────────
function AddContentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: ContentItem) => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentItem['type']>('Event');
  const [theme, setTheme] = useState<ContentItem['theme']>('Dark');
  const [status, setStatus] = useState<ContentItem['status']>('UPCOMING');

  const canSubmit = title.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl w-[520px] p-8" style={{ zIndex: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-base uppercase tracking-wide" style={{ color: '#1e293b' }}>ADD CONTENT</h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: '#94a3b8' }}>×</button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>Title *</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm outline-none"
              style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
              placeholder="Enter content title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>Type</label>
            <div className="flex gap-2">
              {(['Event', 'Leaderboard', 'Image'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="flex-1 py-2 rounded-full border text-sm font-medium transition-colors"
                  style={{
                    borderColor: type === t ? TYPE_COLORS[t] : '#e2e8f0',
                    backgroundColor: type === t ? `${TYPE_COLORS[t]}15` : '#fff',
                    color: type === t ? TYPE_COLORS[t] : '#64748b',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>Status</label>
            <div className="flex gap-2">
              {(['UPCOMING', 'ACTIVE', 'FINISHED'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className="flex-1 py-2 rounded-full border text-sm font-medium transition-colors capitalize"
                  style={{
                    borderColor: status === s ? '#3b82f6' : '#e2e8f0',
                    backgroundColor: status === s ? '#eff6ff' : '#fff',
                    color: status === s ? '#3b82f6' : '#64748b',
                  }}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>Theme</label>
            <div className="flex gap-2">
              {(['Dark', 'Light'] as const).map(th => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setTheme(th)}
                  className="flex-1 py-2 rounded-full border text-sm font-medium transition-colors"
                  style={{
                    borderColor: theme === th ? '#3b82f6' : '#e2e8f0',
                    backgroundColor: theme === th ? '#eff6ff' : '#fff',
                    color: theme === th ? '#3b82f6' : '#64748b',
                  }}
                >
                  {th}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded border text-sm font-medium"
            style={{ borderColor: '#e2e8f0', color: '#64748b' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!canSubmit) return;
              onAdd({ id: Date.now().toString(), title: title.trim(), type, status, displayingOn: '', theme });
              onClose();
            }}
            className="px-5 py-2 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: canSubmit ? '#3b82f6' : '#93c5fd', cursor: canSubmit ? 'pointer' : 'not-allowed' }}
          >
            Add content
          </button>
        </div>
      </div>
    </div>
  );
}

// ── More Details modal ────────────────────────────────────────────────────────
function MoreDetailsModal({
  item, displays, onClose, onDelete, onSave,
}: {
  item: ContentItem;
  displays: Display[];
  onClose: () => void;
  onDelete: () => void;
  onSave: (updated: ContentItem) => void;
}) {
  const [displayingOn, setDisplayingOn] = useState(item.displayingOn);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [theme, setTheme] = useState(item.theme);

  const bgColor = item.status === 'ACTIVE' ? '#0a3320' : '#0d1117';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl w-[680px]" style={{ zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <h2 className="font-black text-base uppercase tracking-wide pr-8" style={{ color: '#1e293b' }}>
            {item.title.toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none flex-shrink-0 mt-0.5" style={{ color: '#94a3b8' }}>×</button>
        </div>

        {/* Preview */}
        <div className="mx-6 mb-5 rounded-lg overflow-hidden" style={{ backgroundColor: bgColor, minHeight: '110px' }}>
          <div className="px-4 pt-3 pb-1">
            <span className="text-xs font-bold uppercase" style={{ color: STATUS_COLORS[item.status] }}>{item.status}</span>
            <br/>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>-</span>
          </div>
          <div className="px-4 pb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: TYPE_COLORS[item.type] }}
            >
              🏆 {item.type}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Title (editable in edit mode) */}
          <div>
            {editing ? (
              <input
                className="w-full border rounded px-3 py-2 text-sm outline-none font-semibold"
                style={{ borderColor: '#3b82f6', color: '#1e293b' }}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            ) : (
              <p className="font-semibold text-sm" style={{ color: '#1e293b' }}>{item.title}</p>
            )}
          </div>

          {/* Displaying on */}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#64748b' }}>Displaying on</label>
            <DisplayingOnDropdown
              value={displayingOn}
              onChange={setDisplayingOn}
              displays={displays}
            />
          </div>

          {/* Theme */}
          <div>
            {editing ? (
              <>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748b' }}>Theme</label>
                <div className="flex gap-2">
                  {(['Dark', 'Light'] as const).map(th => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setTheme(th)}
                      className="px-5 py-1.5 rounded-full border text-sm font-medium"
                      style={{
                        borderColor: theme === th ? '#3b82f6' : '#e2e8f0',
                        backgroundColor: theme === th ? '#eff6ff' : '#fff',
                        color: theme === th ? '#3b82f6' : '#64748b',
                      }}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-medium" style={{ color: '#64748b' }}>Theme</span>
                <p className="text-sm mt-0.5" style={{ color: '#1e293b' }}>{item.theme}</p>
              </>
            )}
          </div>

          {/* Copy link banner */}
          <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: '#f0f7ff' }}>
            <span className="text-sm" style={{ color: '#475569' }}>
              If you are using your own signage system you can copy the link here:
            </span>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded text-white text-xs font-semibold ml-4 flex-shrink-0"
              style={{ backgroundColor: '#1e293b' }}
              onClick={() => navigator.clipboard?.writeText(`https://www4.trms.toptracer.com/leaderboard/${item.id}`)}
            >
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 10V3a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Copy link
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              className="px-5 py-1.5 rounded text-white text-sm font-semibold"
              style={{ backgroundColor: '#ef4444' }}
              onClick={onDelete}
            >
              Delete
            </button>
            {editing ? (
              <button
                className="px-5 py-1.5 rounded text-white text-sm font-semibold"
                style={{ backgroundColor: '#22c55e' }}
                onClick={() => { onSave({ ...item, title, theme, displayingOn }); onClose(); }}
              >
                Save
              </button>
            ) : (
              <button
                className="px-5 py-1.5 rounded text-white text-sm font-semibold"
                style={{ backgroundColor: '#3b82f6' }}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Content card ──────────────────────────────────────────────────────────────
function ContentCard({ item, displays, onDetails, onUpdate }: {
  item: ContentItem;
  displays: Display[];
  onDetails: () => void;
  onUpdate: (updated: ContentItem) => void;
}) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden" style={{ borderColor: '#e2e8f0', width: '240px' }}>
      {/* Preview area */}
      <div className="relative" style={{ backgroundColor: '#0d1117', minHeight: '110px' }}>
        <div className="flex items-start justify-between px-3 pt-3">
          <span className="text-xs font-bold" style={{ color: STATUS_COLORS[item.status] }}>{item.status}</span>
          <div className="w-6 h-6 rounded border flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
              <rect x="1" y="1" width="10" height="8" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
              <path d="M4 9v2M8 9v2M3 11h6" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
            </svg>
          </div>
        </div>
        <div className="px-3 pb-3 mt-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: TYPE_COLORS[item.type] }}
          >
            🏆 {item.type}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-3 py-3">
        <p className="text-sm font-semibold mb-3 truncate" style={{ color: '#1e293b' }}>
          {item.title.length > 28 ? item.title.slice(0, 28) + '...' : item.title}
        </p>

        <div className="mb-3">
          <label className="text-xs mb-1 block" style={{ color: '#94a3b8' }}>Displaying on</label>
          <DisplayingOnDropdown
            value={item.displayingOn}
            onChange={v => onUpdate({ ...item, displayingOn: v })}
            displays={displays}
          />
        </div>

        <div className="flex justify-end">
          <button onClick={onDetails} className="text-xs" style={{ color: '#94a3b8' }}>More details</button>
        </div>
      </div>
    </div>
  );
}

// ── Main DisplaysPage ─────────────────────────────────────────────────────────
const DisplaysPage: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'content'>('overview');
  const [displays, setDisplays] = useState<Display[]>(mockDisplays);
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [showAddDisplay, setShowAddDisplay] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [detailItem, setDetailItem] = useState<ContentItem | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'A-Z' | 'Z-A'>('A-Z');

  const filteredContent = content
    .filter(c => !typeFilter || c.type === typeFilter)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === 'A-Z' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));

  const updateItem = (updated: ContentItem) => {
    setContent(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (detailItem?.id === updated.id) setDetailItem(updated);
  };

  const deleteItem = (id: string) => {
    setContent(prev => prev.filter(c => c.id !== id));
    setDetailItem(null);
  };

  return (
    <div className="bg-white min-h-full">
      {/* Tabs + top-right actions */}
      <div className="border-b flex items-center justify-between pr-5" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex px-5 pt-4 gap-6">
          {(['overview', 'content'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="pb-3 text-sm font-medium border-b-2 -mb-px capitalize transition-colors"
              style={{ borderBottomColor: tab === t ? '#3b82f6' : 'transparent', color: tab === t ? '#3b82f6' : '#64748b' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#64748b' }}>
            <span>Sort by</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
              value={sortDir}
              onChange={e => setSortDir(e.target.value as 'A-Z' | 'Z-A')}
            >
              <option>A-Z</option>
              <option>Z-A</option>
            </select>
          </div>
          {tab === 'overview' ? (
            <button
              onClick={() => setShowAddDisplay(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-white text-sm font-semibold"
              style={{ backgroundColor: '#3b82f6' }}
            >
              + Add display
            </button>
          ) : (
            <button
              onClick={() => setShowAddContent(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-white text-sm font-semibold"
              style={{ backgroundColor: '#3b82f6' }}
            >
              + Add content
            </button>
          )}
        </div>
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="p-6">
          {displays.length === 0 ? (
            <MonitorEmptyState />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {displays.map(d => (
                <div key={d.id} className="border rounded-xl p-4" style={{ borderColor: '#e2e8f0' }}>
                  <div className="font-semibold text-sm mb-1" style={{ color: '#1e293b' }}>{d.name}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>Code: {d.code}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content tab */}
      {tab === 'content' && (
        <div className="p-6">
          {/* Search + filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm pl-8 outline-none"
                style={{ borderColor: '#e2e8f0', color: '#1e293b', width: '200px' }}
              />
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 absolute left-2.5 top-2.5" style={{ color: '#94a3b8' }}>
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            {(['Event', 'Leaderboard', 'Image'] as const).map(f => (
              <button key={f} onClick={() => setTypeFilter(typeFilter === f ? null : f)}
                className="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
                style={{
                  borderColor: typeFilter === f ? '#3b82f6' : '#e2e8f0',
                  backgroundColor: typeFilter === f ? '#eff6ff' : '#fff',
                  color: typeFilter === f ? '#3b82f6' : '#64748b',
                }}>
                {f}
              </button>
            ))}
          </div>

          {/* Content cards */}
          <div className="flex flex-wrap gap-4">
            {filteredContent.map(item => (
              <ContentCard
                key={item.id}
                item={item}
                displays={displays}
                onDetails={() => setDetailItem(item)}
                onUpdate={updateItem}
              />
            ))}
            {filteredContent.length === 0 && (
              <p className="text-sm" style={{ color: '#94a3b8' }}>No content found.</p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddDisplay && (
        <AddDisplayModal
          onClose={() => setShowAddDisplay(false)}
          onAdd={d => setDisplays(prev => [...prev, d])}
        />
      )}

      {showAddContent && (
        <AddContentModal
          onClose={() => setShowAddContent(false)}
          onAdd={c => setContent(prev => [...prev, c])}
        />
      )}

      {detailItem && (
        <MoreDetailsModal
          item={detailItem}
          displays={displays}
          onClose={() => setDetailItem(null)}
          onDelete={() => deleteItem(detailItem.id)}
          onSave={updateItem}
        />
      )}
    </div>
  );
};

export default DisplaysPage;
