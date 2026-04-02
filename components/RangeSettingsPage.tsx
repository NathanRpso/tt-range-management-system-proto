'use client';

import React, { useState } from 'react';

type TopTab = 'range-settings' | 'audit-log' | 'user-management';
type BayMode = 'unlocked' | 'locked';

interface AssignmentLength {
  id: number;
  minutes: number;
  show: boolean;
}

interface PortalUser {
  id: number;
  name: string;
  email: string;
  role: 'Range Administrator' | 'Basic User';
}

// ── Module-level settings store — persists across tab navigation ──────────────
interface SettingsSnapshot {
  bayMode: BayMode;
  sessionTimeoutType: 'inactivity' | 'total';
  inactivityMinutes: number;
  noActivityTimeout: string;
  blockedBaysEnabled: boolean;
  blockedBayNums: number[];
  unlockedLengths: AssignmentLength[];
  lockedLengths: AssignmentLength[];
  setupTime: string;
  includedInPrice: boolean;
  extendable: boolean;
  displayLanguage: string;
  timeFormat: '24' | '12';
}

const DEFAULT_SNAPSHOT: SettingsSnapshot = {
  bayMode: 'unlocked',
  sessionTimeoutType: 'inactivity',
  inactivityMinutes: 5,
  noActivityTimeout: '5 minutes',
  blockedBaysEnabled: true,
  blockedBayNums: [2, 3, 5, 6, 8],
  unlockedLengths: [{ id: 1, minutes: 30, show: true }, { id: 2, minutes: 60, show: true }, { id: 3, minutes: 90, show: true }, { id: 4, minutes: 120, show: true }],
  lockedLengths:   [{ id: 1, minutes: 30, show: true }, { id: 2, minutes: 60, show: true }, { id: 3, minutes: 90, show: true }, { id: 4, minutes: 120, show: true }],
  setupTime: '5 minutes',
  includedInPrice: true,
  extendable: false,
  displayLanguage: 'English',
  timeFormat: '12',
};

// Singleton store — survives remounts within the same browser session
let _savedSnapshot: SettingsSnapshot = { ...DEFAULT_SNAPSHOT, blockedBayNums: [...DEFAULT_SNAPSHOT.blockedBayNums], unlockedLengths: [...DEFAULT_SNAPSHOT.unlockedLengths], lockedLengths: [...DEFAULT_SNAPSHOT.lockedLengths] };

const auditLog = [
  { timestamp: '27/05/2025, 7:01 AM', change: 'Chargeable unit: closed.', user: 'nathan.a@gmail.com' },
  { timestamp: '27/05/2025, 7:02 AM', change: 'Chargeable unit: open.', user: 'nathan.a@gmail.com' },
  { timestamp: '27/05/2025, 7:08 AM', change: 'Update open mode timeout.', user: 'nathan.a@gmail.com' },
  { timestamp: '27/05/2025, 10:14 AM', change: 'Update open mode timeout.', user: 'nathan.a@gmail.com' },
  { timestamp: '26/12/2025, 6:04 PM', change: 'Chargeable unit: closed.', user: 'nathan.a@gmail.com' },
  { timestamp: '26/12/2025, 6:08 PM', change: 'Chargeable unit: open.', user: 'nathan.a@gmail.com' },
  { timestamp: '26/12/2025, 6:08 PM', change: 'Chargeable unit: closed.', user: 'nathan.a@gmail.com' },
  { timestamp: '26/12/2025, 6:10 PM', change: 'Chargeable unit: open.', user: 'nathan.a@gmail.com' },
];

const initialUsers: PortalUser[] = [
  { id: 1, name: 'Nathan A', email: 'nathan.a@gmail.com', role: 'Range Administrator' },
  { id: 2, name: 'J. Maverick', email: 'jmaverick@gmail.com', role: 'Basic User' },
  { id: 3, name: 'C. Reeves', email: 'c.reeves@gmail.com', role: 'Range Administrator' },
  { id: 4, name: 'T. Holloway', email: 'tholloway@gmail.com', role: 'Range Administrator' },
];

const ALL_BAYS = [1, 2, 3, 4, 5, 6, 7, 8];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="relative cursor-pointer flex-shrink-0"
      style={{
        width: 44, height: 24, borderRadius: 12,
        backgroundColor: on ? '#0077cc' : '#cbd5e1',
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

function Radio({ checked, onSelect }: { checked: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center justify-center cursor-pointer flex-shrink-0"
      style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${checked ? '#0077cc' : '#cbd5e1'}`,
        backgroundColor: '#fff',
      }}
    >
      {checked && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0077cc' }} />}
    </div>
  );
}

function Checkbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="cursor-pointer flex items-center justify-center"
      style={{
        width: 18, height: 18, borderRadius: 4,
        backgroundColor: checked ? '#0077cc' : '#fff',
        border: `2px solid ${checked ? '#0077cc' : '#cbd5e1'}`,
      }}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

function AssignmentLengthsTable({
  lengths, onChange,
}: {
  lengths: AssignmentLength[];
  onChange: (lengths: AssignmentLength[]) => void;
}) {
  const update = (id: number, patch: Partial<AssignmentLength>) =>
    onChange(lengths.map(l => l.id === id ? { ...l, ...patch } : l));
  const remove = (id: number) => onChange(lengths.filter(l => l.id !== id));
  const add = () => onChange([...lengths, { id: Date.now(), minutes: 30, show: true }]);

  return (
    <div className="mb-5">
      <div className="text-base font-bold mb-3" style={{ color: '#1e293b' }}>Assignment lengths</div>
      <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
              <th className="text-left px-4 py-2.5 font-semibold" style={{ color: '#475569', width: 80 }}>Show</th>
              <th className="text-left px-4 py-2.5 font-semibold" style={{ color: '#475569' }}>Minutes</th>
              <th className="text-right px-4 py-2.5 font-semibold" style={{ color: '#475569', width: 80 }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {lengths.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td className="px-4 py-2.5">
                  <Checkbox checked={l.show} onToggle={() => update(l.id, { show: !l.show })} />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center border rounded" style={{ borderColor: '#e2e8f0', width: 180 }}>
                    <button
                      className="px-2 py-1.5 text-xs"
                      style={{ color: '#64748b', borderRight: '1px solid #e2e8f0' }}
                      onClick={() => update(l.id, { minutes: Math.max(5, l.minutes - 5) })}
                    >▼</button>
                    <span className="flex-1 text-center text-sm py-1.5" style={{ color: '#1e293b' }}>{l.minutes}</span>
                    <button
                      className="px-2 py-1.5 text-xs"
                      style={{ color: '#64748b', borderLeft: '1px solid #e2e8f0' }}
                      onClick={() => update(l.id, { minutes: l.minutes + 5 })}
                    >▲</button>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => remove(l.id)} style={{ color: '#94a3b8' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5 4V2.5A1.5 1.5 0 016.5 1h3A1.5 1.5 0 0111 2.5V4M6 7v5M10 7v5M3 4l1 9.5A1 1 0 005 14.5h6a1 1 0 001-1L13 4" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={add}
        className="mt-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
        style={{ backgroundColor: '#1e293b' }}
      >
        Add new assignment length
      </button>
    </div>
  );
}

interface RangeSettingsTabProps {
  blockedBayNums: number[];
  setBlockedBayNums: (n: number[]) => void;
  blockedBaysEnabled: boolean;
  setBlockedBaysEnabled: (v: boolean) => void;
}

function RangeSettingsTab({ blockedBayNums, setBlockedBayNums, blockedBaysEnabled, setBlockedBaysEnabled }: RangeSettingsTabProps) {
  const s = _savedSnapshot;
  const [bayMode, setBayMode] = useState<BayMode>(s.bayMode);
  const [sessionTimeoutType, setSessionTimeoutType] = useState<'inactivity' | 'total'>(s.sessionTimeoutType);
  const [inactivityMinutes, setInactivityMinutes] = useState(s.inactivityMinutes);
  const [noActivityTimeout, setNoActivityTimeout] = useState(s.noActivityTimeout);
  const [bayDropdownOpen, setBayDropdownOpen] = useState(false);
  const [unlockedLengths, setUnlockedLengths] = useState<AssignmentLength[]>(s.unlockedLengths);
  const [lockedLengths, setLockedLengths] = useState<AssignmentLength[]>(s.lockedLengths);
  const [setupTime, setSetupTime] = useState(s.setupTime);
  const [includedInPrice, setIncludedInPrice] = useState(s.includedInPrice);
  const [extendable, setExtendable] = useState(s.extendable);
  const [displayLanguage, setDisplayLanguage] = useState(s.displayLanguage);
  const [timeFormat, setTimeFormat] = useState<'24' | '12'>(s.timeFormat);
  const [showSaved, setShowSaved] = useState(false);

  // Dirty detection — compare current state to last saved snapshot
  const current: SettingsSnapshot = {
    bayMode, sessionTimeoutType, inactivityMinutes, noActivityTimeout,
    blockedBaysEnabled, blockedBayNums,
    unlockedLengths, lockedLengths,
    setupTime, includedInPrice, extendable, displayLanguage, timeFormat,
  };
  const isDirty = JSON.stringify(current) !== JSON.stringify(_savedSnapshot);

  const toggleBayNum = (num: number) => {
    const next = blockedBayNums.includes(num)
      ? blockedBayNums.filter(n => n !== num)
      : [...blockedBayNums, num].sort((a, b) => a - b);
    setBlockedBayNums(next);
  };

  const handleSave = () => {
    // Persist to module-level store
    _savedSnapshot = JSON.parse(JSON.stringify(current));
    // Push blocked bay state up to parent (already done via props)
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const timeouts = ['1 minute', '2 minutes', '3 minutes', '5 minutes', '10 minutes', '15 minutes', '20 minutes', '30 minutes'];

  return (
    <div className="py-5 px-6 max-w-[740px]">
      {showSaved && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
          ✓ Settings saved successfully
        </div>
      )}

      {/* PIN card */}
      <div className="rounded-xl border mb-5 px-5 py-4" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
        <span className="text-sm" style={{ color: '#475569' }}>
          Pin for screen access: <strong style={{ color: '#1e293b' }}>5926</strong>
        </span>
      </div>

      {/* Bay mode card */}
      <div className="rounded-xl border mb-5 bg-white overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
        <div className="px-5 pt-4 pb-2">
          <p className="text-sm mb-3" style={{ color: '#475569' }}>
            {bayMode === 'unlocked'
              ? <>If set to <strong style={{ color: '#1e293b' }}>Unlocked Bays</strong>, range guests will be able to start assignments directly from the screen.</>
              : <>If set to <strong style={{ color: '#1e293b' }}>Locked Bays</strong>, range staff must assign bays in Bay Management to unlock them for guest use.</>
            }
          </p>
          {/* Sub-tabs */}
          <div className="flex border-b" style={{ borderColor: '#e2e8f0' }}>
            {(['unlocked', 'locked'] as BayMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setBayMode(mode)}
                className="px-4 py-2 text-sm font-medium border-b-2 -mb-px"
                style={{
                  borderBottomColor: bayMode === mode ? '#0077cc' : 'transparent',
                  color: bayMode === mode ? '#0077cc' : '#64748b',
                  background: 'none',
                  borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                }}
              >
                {mode === 'unlocked' ? 'Unlocked bays' : 'Locked bays'}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          {/* Session timeout — unlocked bays only */}
          {bayMode === 'unlocked' && (
            <div className="mb-5">
              <div className="text-sm font-medium mb-3" style={{ color: '#475569' }}>Session timeout</div>
              <div className="flex items-center gap-8 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Radio checked={sessionTimeoutType === 'inactivity'} onSelect={() => setSessionTimeoutType('inactivity')} />
                  <span className="text-sm" style={{ color: '#1e293b' }}>After inactivity</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Radio checked={sessionTimeoutType === 'total'} onSelect={() => setSessionTimeoutType('total')} />
                  <span className="text-sm" style={{ color: '#1e293b' }}>After total play time</span>
                </label>
              </div>
              <div className="flex items-start gap-8">
                <div>
                  <div className="text-xs mb-1.5" style={{ color: '#64748b' }}>Inactivity time (minutes)</div>
                  <div className="flex items-center border rounded" style={{ borderColor: '#e2e8f0', width: 120 }}>
                    <button
                      className="px-2 py-2 text-xs"
                      style={{ color: '#64748b', borderRight: '1px solid #e2e8f0' }}
                      onClick={() => setInactivityMinutes(m => Math.max(1, m - 1))}
                    >▼</button>
                    <span className="flex-1 text-center text-sm py-2" style={{ color: '#1e293b' }}>{inactivityMinutes}</span>
                    <button
                      className="px-2 py-2 text-xs"
                      style={{ color: '#64748b', borderLeft: '1px solid #e2e8f0' }}
                      onClick={() => setInactivityMinutes(m => m + 1)}
                    >▲</button>
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1.5" style={{ color: '#64748b' }}>No activity timeout after</div>
                  <select
                    value={noActivityTimeout}
                    onChange={e => setNoActivityTimeout(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                    style={{ borderColor: '#e2e8f0', color: '#1e293b', minWidth: 140 }}
                  >
                    {timeouts.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Blocked bays — unlocked bays only */}
          {bayMode === 'unlocked' && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-base font-bold" style={{ color: '#1e293b' }}>Blocked bays</div>
                <Toggle on={blockedBaysEnabled} onToggle={() => setBlockedBaysEnabled(!blockedBaysEnabled)} />
              </div>
              <p className="text-sm mb-3" style={{ color: '#0077cc' }}>
                If blocked bays are turned on, range staff must assign the blocked bays in order for the guests to use them.
              </p>
              {blockedBaysEnabled && (
                <div>
                  <div className="text-xs mb-1.5" style={{ color: '#64748b' }}>bay numbers</div>
                  <div
                    className="flex items-center flex-wrap gap-1.5 border rounded-lg px-3 py-2 cursor-pointer relative"
                    style={{ borderColor: '#e2e8f0', minHeight: 40 }}
                    onClick={() => setBayDropdownOpen(v => !v)}
                  >
                    {blockedBayNums.map(n => (
                      <span
                        key={n}
                        className="flex items-center gap-1 text-sm rounded px-1.5 py-0.5"
                        style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}
                        onClick={e => { e.stopPropagation(); toggleBayNum(n); }}
                      >
                        {n}
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>✕</span>
                      </span>
                    ))}
                    <span className="ml-auto" style={{ color: '#94a3b8' }}>▾</span>
                    {bayDropdownOpen && (
                      <div
                        className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 p-2"
                        style={{ borderColor: '#e2e8f0', minWidth: 140 }}
                        onClick={e => e.stopPropagation()}
                      >
                        {ALL_BAYS.map(n => (
                          <label key={n} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded text-sm" style={{ color: '#1e293b' }}>
                            <Checkbox checked={blockedBayNums.includes(n)} onToggle={() => toggleBayNum(n)} />
                            Bay {n}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assignment lengths */}
          <AssignmentLengthsTable
            lengths={bayMode === 'unlocked' ? unlockedLengths : lockedLengths}
            onChange={bayMode === 'unlocked' ? setUnlockedLengths : setLockedLengths}
          />

          {/* Setup time + No activity */}
          <div className="flex items-start gap-8 mb-5">
            <div>
              <div className="text-xs mb-1.5" style={{ color: '#64748b' }}>Setup time</div>
              <select
                value={setupTime}
                onChange={e => setSetupTime(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                style={{ borderColor: '#e2e8f0', color: '#1e293b', minWidth: 140 }}
              >
                {timeouts.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs mb-1.5" style={{ color: '#64748b' }}>No activity timeout after</div>
              <select
                value={noActivityTimeout}
                onChange={e => setNoActivityTimeout(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                style={{ borderColor: '#e2e8f0', color: '#1e293b', minWidth: 140 }}
              >
                {timeouts.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Included in price */}
          <div className="mb-4">
            <div className="text-sm mb-2" style={{ color: '#475569' }}>Toptracer Range included in price</div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio checked={includedInPrice} onSelect={() => setIncludedInPrice(true)} />
                <span className="text-sm" style={{ color: '#1e293b' }}>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio checked={!includedInPrice} onSelect={() => setIncludedInPrice(false)} />
                <span className="text-sm" style={{ color: '#1e293b' }}>No</span>
              </label>
            </div>
          </div>

          {/* Extendable by guest */}
          <div className="mb-2">
            <div className="text-sm mb-2" style={{ color: '#475569' }}>Extendable by guest</div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio checked={extendable} onSelect={() => setExtendable(true)} />
                <span className="text-sm" style={{ color: '#1e293b' }}>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio checked={!extendable} onSelect={() => setExtendable(false)} />
                <span className="text-sm" style={{ color: '#1e293b' }}>No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Displays settings */}
      <div className="rounded-xl border mb-5 bg-white px-5 py-4" style={{ borderColor: '#e2e8f0' }}>
        <div className="text-base font-bold mb-1" style={{ color: '#1e293b' }}>Displays settings</div>
        <p className="text-sm mb-3" style={{ color: '#0077cc' }}>
          If the language is changed, it will affect all the content on the displays you have configured in the Displays page.
        </p>
        <div className="text-xs mb-1.5" style={{ color: '#64748b' }}>Display language</div>
        <select
          value={displayLanguage}
          onChange={e => setDisplayLanguage(e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 text-sm"
          style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
        >
          {['English', 'Swedish', 'German', 'French', 'Spanish', 'Japanese', 'Korean'].map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Time settings */}
      <div className="rounded-xl border mb-6 bg-white px-5 py-4" style={{ borderColor: '#e2e8f0' }}>
        <div className="text-base font-bold mb-1" style={{ color: '#1e293b' }}>Time settings</div>
        <p className="text-sm mb-3" style={{ color: '#475569' }}>What time format you want TRMS to be displayed in.</p>
        <div className="text-xs mb-2" style={{ color: '#64748b' }}>Time format</div>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <Radio checked={timeFormat === '24'} onSelect={() => setTimeFormat('24')} />
            <span className="text-sm" style={{ color: '#1e293b' }}>24-hour</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Radio checked={timeFormat === '12'} onSelect={() => setTimeFormat('12')} />
            <span className="text-sm" style={{ color: '#1e293b' }}>12-hour (AM/PM)</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!isDirty}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
        style={{
          backgroundColor: isDirty ? '#0077cc' : '#93c5fd',
          cursor: isDirty ? 'pointer' : 'not-allowed',
        }}
      >
        Save settings
      </button>
    </div>
  );
}

function AuditLogTab() {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const sorted = sortDir === 'desc' ? [...auditLog] : [...auditLog].reverse();

  return (
    <div className="py-5 px-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
            {[
              { label: 'Timestamp', sortable: true },
              { label: 'Changes', sortable: true },
              { label: 'User', sortable: true },
            ].map(col => (
              <th
                key={col.label}
                className="text-left py-3 pr-6 font-semibold cursor-pointer select-none"
                style={{ color: '#475569' }}
                onClick={() => col.sortable && setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              >
                {col.label}
                {col.sortable && <span style={{ marginLeft: 3, color: '#94a3b8', fontSize: 11 }}>↑↓</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td className="py-3 pr-6" style={{ color: '#0077cc' }}>{row.timestamp}</td>
              <td className="py-3 pr-6" style={{ color: '#0077cc' }}>{row.change}</td>
              <td className="py-3" style={{ color: '#0077cc' }}>{row.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserManagementTab() {
  const [users, setUsers] = useState<PortalUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Basic User' | 'Range Administrator'>('Basic User');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newEmail) return;
    const name = newEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    setUsers(prev => [...prev, { id: Date.now(), name, email: newEmail, role: newRole }]);
    setShowModal(false);
    setNewEmail('');
    setNewRole('Basic User');
  };

  const removeUser = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div className="py-5 px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="border rounded-lg pl-9 pr-3 py-2 text-sm"
            style={{ borderColor: '#e2e8f0', color: '#1e293b', width: 220 }}
          />
          <svg className="absolute left-3 top-2.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#94a3b8" strokeWidth="1.3"/>
            <path d="M9.5 9.5L12.5 12.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#0077cc' }}
        >
          Add user
        </button>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <th className="text-left py-3 pr-6 font-semibold" style={{ color: '#475569' }}>
              Name<span style={{ marginLeft: 3, color: '#94a3b8', fontSize: 11 }}>↑↓</span>
            </th>
            <th className="text-left py-3 pr-6 font-semibold" style={{ color: '#475569' }}>
              Email<span style={{ marginLeft: 3, color: '#94a3b8', fontSize: 11 }}>↑↓</span>
            </th>
            <th className="text-left py-3 pr-6 font-semibold" style={{ color: '#475569' }}>
              Role<span style={{ marginLeft: 3, color: '#94a3b8', fontSize: 11 }}>↑↓</span>
            </th>
            <th className="py-3 w-16" />
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td className="py-3 pr-6" style={{ color: '#0077cc' }}>{user.name}</td>
              <td className="py-3 pr-6" style={{ color: '#0077cc' }}>{user.email}</td>
              <td className="py-3 pr-6" style={{ color: '#475569' }}>{user.role}</td>
              <td className="py-3">
                <div className="flex items-center gap-3 justify-end">
                  <button style={{ color: '#94a3b8' }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M10.5 2.5L12.5 4.5L5 12H3V10L10.5 2.5Z" stroke="#94a3b8" strokeWidth="1.3" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button style={{ color: '#94a3b8' }} onClick={() => removeUser(user.id)}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M2 4h11M5 4V2.5A1.5 1.5 0 016.5 1h2A1.5 1.5 0 0110 2.5V4M6 7v5M9 7v5M3 4l.9 9A1 1 0 004.9 14h5.2a1 1 0 001-.9L12 4" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create User modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(15,23,42,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6" style={{ width: 480 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base tracking-wide uppercase" style={{ color: '#1e293b', letterSpacing: '0.05em' }}>Create User</h2>
              <button onClick={() => setShowModal(false)} style={{ color: '#94a3b8', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1" style={{ color: '#475569' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="Enter an email address"
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-sm mb-1" style={{ color: '#475569' }}>
                Role <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div
                className="flex items-center justify-between border rounded-lg px-3 py-2.5 text-sm cursor-pointer"
                style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
                onClick={() => setRoleDropdownOpen(v => !v)}
              >
                {newRole}
                <span style={{ color: '#94a3b8' }}>▾</span>
              </div>
              {roleDropdownOpen && (
                <div className="absolute left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 overflow-hidden" style={{ borderColor: '#e2e8f0', width: '100%' }}>
                  {(['Basic User', 'Range Administrator'] as const).map(role => (
                    <div
                      key={role}
                      className="px-4 py-2.5 text-sm cursor-pointer"
                      style={{
                        backgroundColor: newRole === role ? '#dbeafe' : '#fff',
                        color: newRole === role ? '#1d4ed8' : '#1e293b',
                      }}
                      onClick={() => { setNewRole(role); setRoleDropdownOpen(false); }}
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddUser}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: '#0077cc' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RangeSettingsPageProps {
  blockedBayNums: number[];
  setBlockedBayNums: (n: number[]) => void;
  blockedBaysEnabled: boolean;
  setBlockedBaysEnabled: (v: boolean) => void;
}

export default function RangeSettingsPage({ blockedBayNums, setBlockedBayNums, blockedBaysEnabled, setBlockedBaysEnabled }: RangeSettingsPageProps) {
  const [topTab, setTopTab] = useState<TopTab>('range-settings');

  const tabs: { key: TopTab; label: string }[] = [
    { key: 'range-settings', label: 'Range Settings' },
    { key: 'audit-log', label: 'Audit Log' },
    { key: 'user-management', label: 'User Management' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Tab bar */}
      <div className="border-b" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex items-center px-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTopTab(tab.key)}
              className="px-4 py-4 text-sm font-medium border-b-2 -mb-px transition-colors"
              style={{
                borderBottomColor: topTab === tab.key ? '#0077cc' : 'transparent',
                color: topTab === tab.key ? '#0077cc' : '#64748b',
                background: 'none',
                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {topTab === 'range-settings' && <RangeSettingsTab blockedBayNums={blockedBayNums} setBlockedBayNums={setBlockedBayNums} blockedBaysEnabled={blockedBaysEnabled} setBlockedBaysEnabled={setBlockedBaysEnabled} />}
      {topTab === 'audit-log' && <AuditLogTab />}
      {topTab === 'user-management' && <UserManagementTab />}
    </div>
  );
}
