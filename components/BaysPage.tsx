'use client';

import React, { useState } from 'react';
import { mockBays } from '@/data/mockData';
import { Bay } from '@/types';

// ── Toptracer shield SVG ──────────────────────────────────────────────────────
function ShieldIcon({ size = 28, color = '#c8d8e8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 38" fill="none">
      <path
        d="M16 2L3 7v10c0 9 7 16 13 19 6-3 13-10 13-19V7L16 2z"
        stroke={color} strokeWidth="1.5" fill="none"
      />
      <path
        d="M10 19l4 4 8-8"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Golfer silhouette SVG ─────────────────────────────────────────────────────
function GolferSilhouette() {
  return (
    <svg viewBox="0 0 80 100" fill="none" className="w-full h-full opacity-10">
      {/* Head */}
      <circle cx="40" cy="14" r="8" fill="#94a3b8"/>
      {/* Body */}
      <path d="M40 22 L30 50 L35 50 L38 38 L42 38 L45 50 L50 50 L40 22Z" fill="#94a3b8"/>
      {/* Left arm (club swing) */}
      <path d="M40 30 L18 20 L16 28 L40 36" fill="#94a3b8"/>
      {/* Club shaft */}
      <line x1="18" y1="20" x2="8" y2="52" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Legs */}
      <path d="M35 50 L32 70 L38 70 L40 58 L42 70 L48 70 L45 50Z" fill="#94a3b8"/>
    </svg>
  );
}

// ── Assign modal ──────────────────────────────────────────────────────────────
interface AssignModalProps {
  bay: Bay;
  onClose: () => void;
  onComplete: (bay: Bay, partyName: string, minutes: number, notes: string) => void;
}

const TIME_OPTIONS = [30, 60, 90, 120];

function AssignModal({ bay, onClose, onComplete }: AssignModalProps) {
  const [partyName, setPartyName] = useState('Golfer');
  const [minutes, setMinutes] = useState(30);
  const [notes, setNotes] = useState('');

  const untilTime = new Date(Date.now() + minutes * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl w-[480px] p-8" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-black text-lg uppercase tracking-wide" style={{ color: '#0d1f38' }}>
            ASSIGN BAY {bay.number}
          </h2>
          <div className="flex items-center gap-4">
            <ShieldIcon size={40} color="#2a5298"/>
            <button onClick={onClose} className="text-2xl leading-none" style={{ color: '#94a3b8' }}>×</button>
          </div>
        </div>

        {/* Party name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>Party Name</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm outline-none"
            style={{ borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59,130,246,0.15)', color: '#1e293b' }}
            value={partyName}
            onChange={e => setPartyName(e.target.value)}
          />
        </div>

        {/* Time requested */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>Time Requested</label>
          <div className="flex items-center gap-3">
            <select
              value={minutes}
              onChange={e => setMinutes(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm"
              style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
            >
              {TIME_OPTIONS.map(m => (
                <option key={m} value={m}>{m} minutes</option>
              ))}
            </select>
            <span className="text-sm" style={{ color: '#64748b' }}>Until {untilTime}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#475569' }}>Notes</label>
          <textarea
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm resize-none outline-none"
            style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
            placeholder="Add any reminder notes here to help at check-out."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Complete button */}
        <div className="flex justify-end">
          <button
            onClick={() => { onComplete(bay, partyName, minutes, notes); onClose(); }}
            className="px-6 py-2 rounded text-white font-semibold text-sm"
            style={{ backgroundColor: '#3b82f6' }}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── End session modal ─────────────────────────────────────────────────────────
interface EndModalProps {
  bay: Bay;
  onClose: () => void;
  onEnd: (bay: Bay) => void;
}

function EndModal({ bay, onClose, onEnd }: EndModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl w-[400px] p-8" style={{ zIndex: 1 }}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-black text-lg uppercase tracking-wide" style={{ color: '#0d1f38' }}>
            END BAY {bay.number}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: '#94a3b8' }}>×</button>
        </div>
        <div className="mb-2 text-sm" style={{ color: '#475569' }}>
          <strong>Party:</strong> {bay.golferName || 'Walk-in'}
        </div>
        {bay.sessionStarted && (
          <div className="mb-6 text-sm" style={{ color: '#475569' }}>
            <strong>Duration:</strong> {Math.floor((Date.now() - new Date(bay.sessionStarted).getTime()) / 60000)} min
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded border text-sm font-medium" style={{ borderColor: '#e2e8f0', color: '#64748b' }}>Cancel</button>
          <button onClick={() => { onEnd(bay); onClose(); }} className="px-4 py-2 rounded text-white text-sm font-semibold" style={{ backgroundColor: '#dc2626' }}>
            End Bay
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bay card ──────────────────────────────────────────────────────────────────
interface BayCardProps {
  bay: Bay;
  large: boolean;
  canAssign: boolean;
  onAssignClick: (bay: Bay) => void;
  onEndClick: (bay: Bay) => void;
}

function BayCard({ bay, large, canAssign, onAssignClick, onEndClick }: BayCardProps) {
  const isAvailable = bay.status === 'available';
  const isActive = bay.status === 'golfer' || bay.status === 'occupied';
  const cornerColor = isAvailable ? '#5cb85c' : bay.status === 'golfer' ? '#3b82f6' : '#f59e0b';

  const elapsed = bay.sessionStarted
    ? Math.floor((Date.now() - new Date(bay.sessionStarted).getTime()) / 60000)
    : 0;

  if (!large) {
    // Small grid card
    return (
      <div className="relative bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#e2e8f0', width: '110px', height: '80px' }}>
        {/* Corner triangle */}
        <div className="absolute top-0 left-0 w-0 h-0" style={{
          borderTop: `40px solid ${cornerColor}`,
          borderRight: '40px solid transparent',
        }}/>
        <div className="absolute top-0 left-0 w-8 h-8 flex items-end justify-start pl-1 pb-1">
          <span className="text-white font-black text-sm leading-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{bay.number}</span>
        </div>
        {/* Shield icon */}
        <div className="absolute top-1 right-1">
          <ShieldIcon size={18} color={bay.number === 9 ? '#f59e0b' : '#c8d8e8'}/>
        </div>
        {/* Assign indicator */}
        {isAvailable && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
            <div className="w-8 h-1 rounded" style={{ backgroundColor: '#3b82f6' }}/>
          </div>
        )}
      </div>
    );
  }

  // Large grid card
  return (
    <div
      className="relative bg-white border rounded-lg overflow-hidden flex flex-col cursor-pointer transition-shadow hover:shadow-md"
      style={{ borderColor: '#e2e8f0', minHeight: '220px' }}
    >
      {/* Corner triangle with number */}
      <div className="absolute top-0 left-0 w-0 h-0" style={{
        borderTop: `60px solid ${cornerColor}`,
        borderRight: '60px solid transparent',
        zIndex: 1,
      }}/>
      <div className="absolute top-0 left-0 w-12 h-12 flex items-end justify-start pl-2 pb-1.5" style={{ zIndex: 2 }}>
        <span className="text-white font-black text-xl leading-none" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          {bay.number}
        </span>
      </div>

      {/* Top bar */}
      <div className="flex items-start justify-between px-3 pt-3 mb-1" style={{ paddingLeft: '56px' }}>
        <span className="font-black text-base" style={{ color: '#1e293b' }}>
          {isAvailable ? 'Available' : bay.status === 'golfer' ? bay.golferName || 'Golfer' : 'Occupied'}
        </span>
        <ShieldIcon size={26} color={bay.number === 9 ? '#f59e0b' : '#c8d8e8'}/>
      </div>

      {/* Session time if active */}
      {isActive && (
        <div className="px-3 mb-1">
          <span className="text-xs" style={{ color: '#64748b' }}>{elapsed} min</span>
        </div>
      )}

      {/* Golfer silhouette */}
      <div className="flex-1 flex items-center justify-center px-4" style={{ minHeight: '100px' }}>
        <GolferSilhouette />
      </div>

      {/* Assign / End button */}
      <div className="px-3 pb-3 flex justify-center">
        {isAvailable ? (
          canAssign ? (
            <button
              onClick={() => onAssignClick(bay)}
              className="px-6 py-1.5 rounded text-white text-sm font-semibold"
              style={{ backgroundColor: '#3b82f6' }}
            >
              Assign
            </button>
          ) : (
            <span className="text-xs px-3 py-1 rounded" style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}>
              Guest access
            </span>
          )
        ) : (
          <button
            onClick={() => onEndClick(bay)}
            className="px-6 py-1.5 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: '#dc2626' }}
          >
            End
          </button>
        )}
      </div>
    </div>
  );
}

// ── Monitor card for Screen Power ────────────────────────────────────────────
function MonitorCard({ bay, onToggle }: { bay: Bay; onToggle: (id: string) => void }) {
  const hasWarning = bay.number === 9;
  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer select-none"
      style={{ backgroundColor: '#1e2d3d', width: '130px' }}
      onClick={() => onToggle(bay.id)}
    >
      {/* Monitor top notch */}
      <div className="flex justify-center pt-1.5 pb-1">
        <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: '#2d4060' }}/>
      </div>
      {/* Screen area */}
      <div
        className="mx-2 mb-2 rounded flex flex-col items-start justify-between p-2"
        style={{ backgroundColor: '#0d1f38', minHeight: '72px' }}
      >
        {/* Bay number */}
        <span className="text-white font-bold text-sm">{bay.number}</span>
        {/* ON/OFF pill */}
        <button
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: bay.screenOn ? '#16a34a' : '#64748b',
            color: '#fff',
            border: 'none',
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bay.screenOn ? '#4ade80' : '#94a3b8' }}/>
          {bay.screenOn ? 'ON' : 'OFF'}
        </button>
      </div>
      {/* Warning badge */}
      {hasWarning && (
        <div
          className="absolute top-1 right-1 w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: '#f59e0b', color: '#fff' }}
        >?</div>
      )}
    </div>
  );
}

// ── Screen Power tab ──────────────────────────────────────────────────────────
function ScreenPowerTab({ bays, onToggle }: { bays: Bay[]; onToggle: (id: string) => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const on = bays.filter(b => b.screenOn).length;
  const off = bays.length - on;
  const [troubleOpen, setTroubleOpen] = useState<string | null>(null);

  const handlePowerAll = (turnOn: boolean) => {
    bays.forEach(b => onToggle(b.id + (turnOn ? '_on' : '_off')));
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      {/* Left control panel */}
      <div className="w-[380px] flex-shrink-0 border-r p-6 space-y-4 relative" style={{ borderColor: '#e2e8f0' }}>
        {/* Warning overlay */}
        {!confirmed && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8"
            style={{ backgroundColor: 'rgba(30,45,61,0.92)', borderRadius: '0' }}>
            <h2
              className="font-black italic uppercase mb-4 leading-tight"
              style={{ fontSize: '2.8rem', color: '#fff', letterSpacing: '-0.02em' }}
            >
              SCREEN<br/>POWER
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Be aware that using the Screen Power will impact all of the screens in your range.
            </p>
            <button
              onClick={() => setConfirmed(true)}
              className="px-8 py-2 rounded text-white font-semibold text-sm"
              style={{ backgroundColor: '#3b82f6' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* POWER ON */}
        <div className="border rounded-lg p-5" style={{ borderColor: '#e2e8f0' }}>
          <h3 className="font-black text-sm tracking-wide mb-2" style={{ color: '#1e293b' }}>POWER ON</h3>
          <p className="text-xs mb-4" style={{ color: '#64748b' }}>
            <span className="font-semibold" style={{ color: '#16a34a' }}>{off} screens</span> will power on
          </p>
          <button
            onClick={() => handlePowerAll(true)}
            className="px-5 py-1.5 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: '#16a34a' }}
          >
            Power on
          </button>
        </div>

        {/* POWER OFF */}
        <div className="border rounded-lg p-5" style={{ borderColor: '#e2e8f0' }}>
          <h3 className="font-black text-sm tracking-wide mb-2" style={{ color: '#1e293b' }}>POWER OFF</h3>
          <p className="text-xs mb-4" style={{ color: '#64748b' }}>
            <span className="font-semibold" style={{ color: '#ef4444' }}>{on} screens</span> will power off
          </p>
          <button
            onClick={() => handlePowerAll(false)}
            className="px-5 py-1.5 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: '#ef4444' }}
          >
            Power off
          </button>
        </div>

        {/* SCREEN STATUS */}
        <div className="border rounded-lg p-5" style={{ borderColor: '#e2e8f0' }}>
          <h3 className="font-black text-sm tracking-wide mb-4" style={{ color: '#1e293b' }}>SCREEN STATUS</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'ON', value: on },
              { label: 'IN PROGRESS', value: 0 },
              { label: 'OFF', value: off },
            ].map(s => (
              <div key={s.label} className="border rounded p-3 text-center" style={{ borderColor: '#e2e8f0' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#64748b' }}>{s.label}</div>
                <div className="text-2xl font-black" style={{ color: '#1e293b' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TROUBLESHOOTING */}
        <div>
          <h3 className="font-black text-sm tracking-wide mb-3" style={{ color: '#1e293b' }}>TROUBLESHOOTING</h3>
          {['Screens are not powering on', 'Screens are not powering off'].map(issue => (
            <div key={issue} className="border-b" style={{ borderColor: '#e2e8f0' }}>
              <button
                className="w-full flex items-center justify-between py-3 text-sm text-left"
                style={{ color: '#475569' }}
                onClick={() => setTroubleOpen(troubleOpen === issue ? null : issue)}
              >
                <span>{issue}</span>
                <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4 flex-shrink-0" style={{ transform: troubleOpen === issue ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {troubleOpen === issue && (
                <div className="pb-3 text-xs" style={{ color: '#64748b' }}>
                  {issue === 'Screens are not powering on'
                    ? 'Ensure the bay screens are physically connected and receiving power. Check that the Toptracer device is online. Try using the individual bay toggle on this page.'
                    : 'Some screens may take up to 2 minutes to power off. If screens remain on after this, check for active sessions or contact Toptracer support.'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — monitor grid */}
      <div className="flex-1 p-6">
        <div className="flex flex-wrap gap-4">
          {bays.map(bay => (
            <MonitorCard key={bay.id} bay={bay} onToggle={onToggle} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main BaysPage ─────────────────────────────────────────────────────────────
interface BaysPageProps {
  blockedBayNums: number[];
  blockedBaysEnabled: boolean;
}

const BaysPage: React.FC<BaysPageProps> = ({ blockedBayNums, blockedBaysEnabled }) => {
  const [bays, setBays] = useState<Bay[]>(mockBays);
  const [tab, setTab] = useState<'bays' | 'screen-power'>('bays');
  const [gridSize, setGridSize] = useState<'large' | 'small'>('large');
  const [assigningBay, setAssigningBay] = useState<Bay | null>(null);
  const [endingBay, setEndingBay] = useState<Bay | null>(null);

  const handleAssign = (bay: Bay, partyName: string, minutes: number) => {
    setBays(prev => prev.map(b =>
      b.id === bay.id ? { ...b, status: 'golfer', golferName: partyName, sessionStarted: new Date().toISOString() } : b
    ));
  };

  const handleEnd = (bay: Bay) => {
    setBays(prev => prev.map(b =>
      b.id === bay.id ? { ...b, status: 'available', golferName: undefined, sessionStarted: undefined } : b
    ));
  };

  const handleScreenToggle = (idFlag: string) => {
    const [id, flag] = idFlag.split('_');
    setBays(prev => prev.map(b => {
      if (flag === 'on') return { ...b, screenOn: true };
      if (flag === 'off') return { ...b, screenOn: false };
      return b.id === id ? { ...b, screenOn: !b.screenOn } : b;
    }));
  };

  return (
    <div className="bg-white min-h-full">
      {/* Tabs */}
      <div className="border-b px-6 pt-4 flex gap-6" style={{ borderColor: '#e2e8f0' }}>
        {[['bays', 'Bays'], ['screen-power', 'Screen Power']] .map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as typeof tab)}
            className="pb-3 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={{
              borderBottomColor: tab === id ? '#3b82f6' : 'transparent',
              color: tab === id ? '#3b82f6' : '#64748b',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'screen-power' ? (
        <ScreenPowerTab bays={bays} onToggle={handleScreenToggle} />
      ) : (
        <div className="p-6">
          {/* Grid size + view toggle */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex rounded border overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
              {(['large', 'small'] as const).map(s => (
                <button key={s} onClick={() => setGridSize(s)}
                  className="px-4 py-1.5 text-sm capitalize"
                  style={{
                    backgroundColor: gridSize === s ? '#f1f5f9' : '#fff',
                    color: gridSize === s ? '#1e293b' : '#64748b',
                    fontWeight: gridSize === s ? 600 : 400,
                    borderRight: s === 'large' ? '1px solid #e2e8f0' : undefined,
                  }}>
                  {s === 'large' ? 'Large grid' : 'Small grid'}
                </button>
              ))}
            </div>
            {/* Status legend */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#5cb85c' }}/>
                <span className="text-xs" style={{ color: '#64748b' }}>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#3b82f6' }}/>
                <span className="text-xs" style={{ color: '#64748b' }}>Golfer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#f59e0b' }}/>
                <span className="text-xs" style={{ color: '#64748b' }}>Occupied</span>
              </div>
            </div>
          </div>

          {gridSize === 'large' ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {bays.map(bay => (
                <BayCard
                  key={bay.id}
                  bay={bay}
                  large={true}
                  canAssign={!blockedBaysEnabled || blockedBayNums.includes(bay.number)}
                  onAssignClick={setAssigningBay}
                  onEndClick={setEndingBay}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {bays.map(bay => (
                <BayCard
                  key={bay.id}
                  bay={bay}
                  large={false}
                  canAssign={!blockedBaysEnabled || blockedBayNums.includes(bay.number)}
                  onAssignClick={setAssigningBay}
                  onEndClick={setEndingBay}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {assigningBay && (
        <AssignModal
          bay={assigningBay}
          onClose={() => setAssigningBay(null)}
          onComplete={(bay, name, mins, notes) => { handleAssign(bay, name, mins); }}
        />
      )}

      {endingBay && (
        <EndModal
          bay={endingBay}
          onClose={() => setEndingBay(null)}
          onEnd={handleEnd}
        />
      )}
    </div>
  );
};

export default BaysPage;
