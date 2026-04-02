'use client';

import React, { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LeaderboardCategory {
  id: string;
  name: string;
  gender: string;
  age: string;
  skillLevel: string;
}

interface EventForm {
  name: string;
  startTime: string;
  endTime: string;
  host: string;
  coHost: string;
  website: string;
  termsUrl: string;
  prizes: string;
  description: string;
  gameMode: string;
  course: string;
  unit: string;
  gameRules: string;
  categories: LeaderboardCategory[];
  termsAccepted: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// Monday-first
const WEEK_DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const COURSES = [
  'The Belfry, The Brabazon Course (Hole 2: 41 Meters)',
  'St Andrews, Old Course (Hole 11: 163 Meters)',
  'Harbour Town Golf Links (Hole 14: 159 Meters)',
  'Bethpage Black Course (Hole 8: 170 Meters)',
  'Pinehurst No.2 (Hole 9: 180 Meters)',
  'Naruo Golf Club (Hole 4: 191 Meters)',
  'Royal St. George\'s GC (Hole 11: 206 Meters)',
  'Augusta National (Hole 12: 155 Meters)',
  'Pebble Beach (Hole 7: 106 Meters)',
];

const GAME_MODES = ['Closest to Pin','TopDrive','Around the World','Bullseye','Range Mode','Skills Challenge'];

const SKILL_LEVELS = [
  'All (Hcp +9.9-54.0)',
  'Tour Pro (Hcp +9.9-0.0)',
  'Expert (Hcp 0.1-9.9)',
  'Intermediate (Hcp 10.0-24.0)',
  'Beginner (Hcp 24.1-54.0)',
];

const AGE_GROUPS = ['All','Juniors (Under 19)','Adults (19-54)','Seniors (55+)'];
const GENDERS = ['All','Men','Women'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Monday=0 offset for first day
function getMondayOffset(year: number, month: number) {
  const jsDay = new Date(year, month, 1).getDay(); // 0=Sun
  return jsDay === 0 ? 6 : jsDay - 1;
}

// Returns datetime-local string rounded up to the nearest 30-min slot, using dateStr for the date if provided
function getNearestFutureHalfHour(dateStr?: string): string {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const useDate = dateStr ?? todayStr;
  if (useDate === todayStr) {
    const rounded = new Date(now);
    const mins = rounded.getMinutes();
    if (mins === 0) {
      // already on the hour — jump to :30
      rounded.setMinutes(30, 0, 0);
    } else if (mins <= 30) {
      rounded.setMinutes(30, 0, 0);
    } else {
      rounded.setHours(rounded.getHours() + 1, 0, 0, 0);
    }
    const h = String(rounded.getHours()).padStart(2, '0');
    const m = String(rounded.getMinutes()).padStart(2, '0');
    return `${useDate}T${h}:${m}`;
  }
  return `${useDate}T09:00`;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <div className="text-right text-xs mt-0.5" style={{ color: value.length > max * 0.9 ? '#ef4444' : '#94a3b8' }}>
      {value.length} / {max}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm mb-1.5" style={{ color: '#3b82f6' }}>
      {children}{required && <span style={{ color: '#3b82f6' }}> *</span>}
    </label>
  );
}

const inputCls = "w-full border rounded px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors";
const inputStyle = { borderColor: '#e2e8f0', color: '#1e293b' };
const selectCls = "w-full border rounded px-3 py-2 text-sm outline-none bg-white";

// ── Create / Edit Event full-page form ────────────────────────────────────────
type EventPartial = { title: string; startDate: string; endDate: string; startTime: string; endTime: string; description: string; prizeInfo: string };

interface CreateEventPageProps {
  onBack: () => void;
  onSubmit: (event: EventPartial) => void;
  initialDate?: string;   // YYYY-MM-DD (for new events)
  editEvent?: import('@/types').Event; // pre-populate form for editing
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{msg}</p>;
}

function CreateEventPage({ onBack, onSubmit, initialDate, editEvent }: CreateEventPageProps) {
  const defaultStart = editEvent
    ? `${editEvent.startDate}T${editEvent.startTime}`
    : getNearestFutureHalfHour(initialDate);
  const defaultEndDate = editEvent ? editEvent.endDate : (initialDate ?? defaultStart.split('T')[0]);
  const [form, setForm] = useState<EventForm>({
    name:        editEvent?.title       ?? '',
    startTime:   defaultStart,
    endTime:     editEvent ? `${editEvent.endDate}T${editEvent.endTime}` : `${defaultEndDate}T23:59`,
    host:        'Golf Complex',
    coHost:      '',
    website:     '',
    termsUrl:    '',
    prizes:      editEvent?.prizeInfo   ?? '',
    description: editEvent?.description ?? '',
    gameMode:    'Closest to Pin',
    course:      COURSES[0],
    unit:        'Meters',
    gameRules:   '',
    categories:  [{ id: '1', name: 'All players', gender: 'All', age: 'All', skillLevel: 'All (Hcp +9.9-54.0)' }],
    termsAccepted: !!editEvent,
  });
  const [courseOpen, setCourseOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = <K extends keyof EventForm>(k: K, v: EventForm[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const addCategory = () => {
    setField('categories', [...form.categories, {
      id: Date.now().toString(), name: '', gender: 'All', age: 'All', skillLevel: 'All (Hcp +9.9-54.0)'
    }]);
  };

  const removeCategory = (id: string) =>
    setField('categories', form.categories.filter(c => c.id !== id));

  const updateCategory = (id: string, field: keyof LeaderboardCategory, value: string) =>
    setField('categories', form.categories.map(c => c.id === id ? { ...c, [field]: value } : c));

  return (
    <div className="min-h-full" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-[750px] mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e293b' }}>{editEvent ? 'Edit event' : 'Create event'}</h1>

        {/* Event details */}
        <div className="bg-white rounded-lg border mb-5 p-6" style={{ borderColor: '#e2e8f0' }}>
          <h2 className="text-lg font-semibold mb-5" style={{ color: '#1e293b' }}>Event details</h2>

          <div className="mb-4">
            <FieldLabel required>Event name</FieldLabel>
            <input className={inputCls} style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : '#e2e8f0' }} maxLength={40}
              placeholder="Be clear and descriptive"
              value={form.name} onChange={e => { setField('name', e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}/>
            <CharCount value={form.name} max={40}/>
            <FieldError msg={errors.name}/>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 items-start">
            <div>
              <FieldLabel required>Start time</FieldLabel>
              <div className="relative">
                <input type="datetime-local" className={inputCls} style={{ ...inputStyle, borderColor: errors.startTime ? '#ef4444' : '#e2e8f0' }}
                  value={form.startTime} onChange={e => { setField('startTime', e.target.value); setErrors(prev => ({ ...prev, startTime: '' })); }}/>
              </div>
              <FieldError msg={errors.startTime}/>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <FieldLabel required>End time</FieldLabel>
                <input type="datetime-local" className={inputCls} style={{ ...inputStyle, borderColor: errors.endTime ? '#ef4444' : '#e2e8f0' }}
                  value={form.endTime} onChange={e => { setField('endTime', e.target.value); setErrors(prev => ({ ...prev, endTime: '' })); }}
                  placeholder="Select end time"/>
                <FieldError msg={errors.endTime}/>
              </div>
              <button className="mt-6 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0"
                style={{ borderColor: '#94a3b8', color: '#94a3b8' }}>
                <span className="text-xs font-bold">i</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <FieldLabel>Event host</FieldLabel>
            <input className={inputCls} style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#94a3b8' }}
              value={form.host} readOnly/>
          </div>

          <div className="mb-4">
            <FieldLabel>Event co-host</FieldLabel>
            <input className={inputCls} style={inputStyle} maxLength={60}
              value={form.coHost} onChange={e => setField('coHost', e.target.value)}/>
            <CharCount value={form.coHost} max={60}/>
          </div>

          <div className="mb-4">
            <FieldLabel>Website</FieldLabel>
            <input className={inputCls} style={inputStyle}
              placeholder="https://example.com"
              value={form.website} onChange={e => setField('website', e.target.value)}/>
          </div>

          <div className="mb-4">
            <FieldLabel>Event&apos;s Terms and Conditions URL</FieldLabel>
            <input className={inputCls} style={inputStyle}
              placeholder="https://example.com"
              value={form.termsUrl} onChange={e => setField('termsUrl', e.target.value)}/>
            <p className="text-xs mt-1.5" style={{ color: '#64748b' }}>
              By adding a link to your Terms and Conditions here, players will be able to access rules and regulations, safety guidelines, or any other important information that they need to know before joining the event in the Toptracer Range app.
            </p>
          </div>

          <div className="mb-4">
            <FieldLabel>Prizes</FieldLabel>
            <textarea className={inputCls} style={inputStyle} rows={4}
              placeholder="Clarify what prizes will be handed out for this event"
              maxLength={200}
              value={form.prizes} onChange={e => setField('prizes', e.target.value)}/>
            <CharCount value={form.prizes} max={200}/>
          </div>

          <div className="mb-2">
            <FieldLabel>Description</FieldLabel>
            <textarea className={inputCls} style={inputStyle} rows={4}
              placeholder="Describe your event for the players that want to join"
              maxLength={400}
              value={form.description} onChange={e => setField('description', e.target.value)}/>
            <CharCount value={form.description} max={400}/>
          </div>
        </div>

        {/* Game settings */}
        <div className="bg-white rounded-lg border mb-5 p-6" style={{ borderColor: '#e2e8f0' }}>
          <h2 className="text-lg font-semibold mb-5" style={{ color: '#1e293b' }}>Game settings</h2>

          <div className="mb-4">
            <FieldLabel required>Game mode</FieldLabel>
            <div className="relative">
              <select className={selectCls} style={inputStyle}
                value={form.gameMode} onChange={e => setField('gameMode', e.target.value)}>
                {GAME_MODES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <FieldLabel>Course</FieldLabel>
            <div className="relative">
              <div
                className="w-full border rounded px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
                onClick={() => setCourseOpen(!courseOpen)}
              >
                <span>{form.course}</span>
                <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4 flex-shrink-0">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {courseOpen && (
                <div className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 max-h-48 overflow-y-auto" style={{ borderColor: '#e2e8f0' }}>
                  {COURSES.map(c => (
                    <div key={c} className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
                      style={{ color: '#1e293b' }}
                      onClick={() => { setField('course', c); setCourseOpen(false); }}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <FieldLabel>Unit</FieldLabel>
            <select className={selectCls} style={inputStyle}
              value={form.unit} onChange={e => setField('unit', e.target.value)}>
              <option>Meters</option>
              <option>Yards</option>
            </select>
          </div>

          <div className="mb-2">
            <FieldLabel>Game rules</FieldLabel>
            <textarea className={inputCls} style={inputStyle} rows={4}
              placeholder="If there are specific rules the players need to know, list them here."
              maxLength={400}
              value={form.gameRules} onChange={e => setField('gameRules', e.target.value)}/>
            <CharCount value={form.gameRules} max={400}/>
          </div>
        </div>

        {/* Leaderboard categories */}
        <div className="bg-white rounded-lg border mb-5 p-6" style={{ borderColor: '#e2e8f0' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#1e293b' }}>Leaderboard categories</h2>
          <p className="text-sm mb-5" style={{ color: '#64748b' }}>
            Categories create unique leaderboards for different player groups. Players auto-join all categories matching their profile in the app but can&apos;t sign up if there&apos;s no match.{' '}
            <span style={{ color: '#3b82f6' }}>Each event can have up to 10 categories and requires at least one.</span>
          </p>

          <div className="grid grid-cols-2 gap-4">
            {form.categories.map(cat => (
              <div key={cat.id} className="border rounded-lg p-4" style={{ borderColor: '#e2e8f0' }}>
                <div className="mb-3">
                  <FieldLabel required>Category name</FieldLabel>
                  <input className={inputCls} style={{ ...inputStyle, borderColor: errors[`cat_${cat.id}`] ? '#ef4444' : '#e2e8f0' }} maxLength={30}
                    value={cat.name} onChange={e => { updateCategory(cat.id, 'name', e.target.value); setErrors(prev => ({ ...prev, [`cat_${cat.id}`]: '' })); }}/>
                  <CharCount value={cat.name} max={30}/>
                  <FieldError msg={errors[`cat_${cat.id}`]}/>
                </div>
                <div className="mb-3">
                  <FieldLabel required>Gender</FieldLabel>
                  <select className={selectCls} style={inputStyle}
                    value={cat.gender} onChange={e => updateCategory(cat.id, 'gender', e.target.value)}>
                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <FieldLabel required>Age</FieldLabel>
                  <select className={selectCls} style={inputStyle}
                    value={cat.age} onChange={e => updateCategory(cat.id, 'age', e.target.value)}>
                    {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <FieldLabel required>Skill Level</FieldLabel>
                  <select className={selectCls} style={inputStyle}
                    value={cat.skillLevel} onChange={e => updateCategory(cat.id, 'skillLevel', e.target.value)}>
                    {SKILL_LEVELS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {form.categories.length > 1 && (
                  <button onClick={() => removeCategory(cat.id)}
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: '#94a3b8' }}>
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Add category cell */}
            {form.categories.length < 10 && (
              <div className="border rounded-lg flex items-center justify-center" style={{ borderColor: '#e2e8f0', minHeight: '200px' }}>
                <button onClick={addCategory}
                  className="flex items-center gap-2 px-5 py-2 rounded text-white text-sm font-semibold"
                  style={{ backgroundColor: '#3b82f6' }}>
                  + Add category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sponsors */}
        <div className="bg-white rounded-lg border mb-5 p-6" style={{ borderColor: '#e2e8f0' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#1e293b' }}>Sponsors</h2>
          <p className="text-sm mb-4" style={{ color: '#64748b' }}>
            Sponsors provide branded exposure on event{' '}
            <span style={{ color: '#3b82f6' }}>leaderboards</span>, marketing materials, range screens, and within the app.{' '}
            <span style={{ color: '#3b82f6' }}>Adding a sponsor confirms they have authorized this use.</span>{' '}
            Each event can include up to{' '}
            <span style={{ color: '#3b82f6' }}>8 sponsors</span>.
          </p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded text-white text-sm font-semibold"
              style={{ backgroundColor: '#3b82f6' }}>
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add sponsor
            </button>
            <span className="text-sm" style={{ color: '#94a3b8' }}>No file chosen</span>
            <span className="text-xs" style={{ color: '#94a3b8' }}>Accepted file formats: jpg, png. File size must not exceed 5 MB.</span>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-lg border mb-6 p-6" style={{ borderColor: '#e2e8f0' }}>
          <p className="text-sm mb-4" style={{ color: '#3b82f6', lineHeight: 1.6 }}>
            All aspects of the event are the sole responsibility of the Customer (i.e. the golf facility where the event takes place). The Customer is solely responsible to all participants and for ensuring that the event complies with all applicable laws, rules, and regulations, including e.g. advertising and marketing laws, gaming regulations, and The Rules of Golf relating to Amateur Status. The event is not organized, promoted, or officially sanctioned by Toptracer and Toptracer has no responsibility or liability in respect thereof. The above terms apply even if the event is hosted by a third party. The Customer agrees to indemnify and hold harmless Toptracer and its affiliates from all claims and liabilities arising out of, or in connection with the event (including but not limited to claims arising from sponsor relationships, advertising, and event participants).
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox"
              checked={form.termsAccepted}
              onChange={e => { setField('termsAccepted', e.target.checked); setErrors(prev => ({ ...prev, terms: '' })); }}
              className="w-4 h-4 rounded"
              style={{ accentColor: '#3b82f6' }}/>
            <span className="text-sm" style={{ color: '#1e293b' }}>
              I have read the above terms and accept them on behalf of the Customer{' '}
              <span style={{ color: '#3b82f6' }}>*</span>
            </span>
          </label>
          <FieldError msg={errors.terms}/>
        </div>

        {/* Create event button */}
        <div className="flex justify-center pb-8">
          <button
            className="px-10 py-2.5 rounded text-white font-semibold text-sm"
            style={{ backgroundColor: '#3b82f6' }}
            onClick={() => {
              const errs: Record<string, string> = {};
              if (!form.name.trim()) errs.name = 'Event name is required.';
              if (!form.startTime) errs.startTime = 'Start time is required.';
              if (!form.endTime) errs.endTime = 'End time is required.';
              if (form.startTime && form.endTime && form.endTime <= form.startTime)
                errs.endTime = 'End time must be after start time.';
              form.categories.forEach(c => {
                if (!c.name.trim()) errs[`cat_${c.id}`] = 'Category name is required.';
              });
              if (!form.termsAccepted) errs.terms = 'You must accept the terms to create an event.';
              setErrors(errs);
              if (Object.keys(errs).length > 0) return;
              const startDate = form.startTime.split('T')[0];
              const endDate = form.endTime.split('T')[0] || startDate;
              onSubmit({
                title: form.name,
                startDate,
                endDate,
                startTime: form.startTime.split('T')[1] || '00:00',
                endTime: form.endTime.split('T')[1] || '23:59',
                description: form.description,
                prizeInfo: form.prizes,
              });
              onBack();
            }}
          >
            {editEvent ? 'Save changes' : 'Create event'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Events page (calendar) ───────────────────────────────────────────────
import type { Event as CalEvent } from '@/types';

interface EventsPageProps {
  events: CalEvent[];
  setEvents: (e: CalEvent[]) => void;
}

const EVENT_COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'];

const EventsPage: React.FC<EventsPageProps> = ({ events, setEvents }) => {
  const today = new Date();
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [showCreate, setShowCreate] = useState(false);
  const [clickedDate, setClickedDate] = useState<string | undefined>(undefined);
  const [editingEvent, setEditingEvent] = useState<CalEvent | null>(null);

  const handleDateClick = (dateStr: string) => {
    setClickedDate(dateStr);
    setShowCreate(true);
  };

  const handleEventClick = (ev: CalEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(ev);
  };

  const handleCreateSubmit = (partial: EventPartial) => {
    const newEvent: CalEvent = {
      id: `e${Date.now()}`,
      title: partial.title,
      description: partial.description,
      startDate: partial.startDate,
      endDate: partial.endDate,
      startTime: partial.startTime,
      endTime: partial.endTime,
      bays: [],
      published: false,
      prizeInfo: partial.prizeInfo,
    };
    setEvents([...events, newEvent]);
  };

  const handleEditSubmit = (partial: EventPartial) => {
    if (!editingEvent) return;
    setEvents(events.map(e => e.id === editingEvent.id
      ? { ...e, title: partial.title, description: partial.description, startDate: partial.startDate, endDate: partial.endDate, startTime: partial.startTime, endTime: partial.endTime, prizeInfo: partial.prizeInfo }
      : e
    ));
  };

  if (editingEvent) {
    return (
      <CreateEventPage
        onBack={() => setEditingEvent(null)}
        onSubmit={(partial) => { handleEditSubmit(partial); setEditingEvent(null); }}
        editEvent={editingEvent}
      />
    );
  }

  if (showCreate) {
    return (
      <CreateEventPage
        onBack={() => { setShowCreate(false); setClickedDate(undefined); }}
        onSubmit={handleCreateSubmit}
        initialDate={clickedDate}
      />
    );
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const offset = getMondayOffset(calYear, calMonth);
  const prevMonthDays = getDaysInMonth(calYear, calMonth - 1 < 0 ? 11 : calMonth - 1);

  const isToday = (day: number) =>
    day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };
  const goToday = () => { setCalMonth(today.getMonth()); setCalYear(today.getFullYear()); };

  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const numWeeks = totalCells / 7;

  // Build a date string for any cell index
  const cellDateStr = (i: number): string => {
    const dayNum = i - offset + 1;
    if (dayNum < 1) {
      const pm = calMonth === 0 ? 11 : calMonth - 1;
      const py = calMonth === 0 ? calYear - 1 : calYear;
      return toDateStr(new Date(py, pm, prevMonthDays + dayNum));
    }
    if (dayNum > daysInMonth) {
      const nm = calMonth === 11 ? 0 : calMonth + 1;
      const ny = calMonth === 11 ? calYear + 1 : calYear;
      return toDateStr(new Date(ny, nm, dayNum - daysInMonth));
    }
    return toDateStr(new Date(calYear, calMonth, dayNum));
  };

  // Stable color per event id
  const eventColor = (ev: CalEvent) => EVENT_COLORS[events.indexOf(ev) % EVENT_COLORS.length];

  const multiDay = (ev: CalEvent) => ev.startDate !== ev.endDate;

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: '#e2e8f0' }}>
        <button onClick={goToday}
          className="px-4 py-1.5 rounded border text-sm font-medium"
          style={{ borderColor: '#e2e8f0', color: '#475569' }}>
          Today
        </button>
        <div className="flex items-center gap-1 border rounded overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <select value={view} onChange={e => setView(e.target.value as typeof view)}
            className="px-3 py-1.5 text-sm bg-white outline-none" style={{ color: '#475569' }}>
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
        <button onClick={prevMonth}
          className="w-7 h-7 rounded border flex items-center justify-center"
          style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
          <svg viewBox="0 0 10 10" fill="none" className="w-3 h-3">
            <path d="M7 2L3 5l4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="font-bold text-base tracking-wide" style={{ color: '#1e293b' }}>
          {MONTHS[calMonth]} {calYear}
        </h2>
        <button onClick={nextMonth}
          className="w-7 h-7 rounded border flex items-center justify-center"
          style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
          <svg viewBox="0 0 10 10" fill="none" className="w-3 h-3">
            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex-1"/>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded text-white text-sm font-semibold"
          style={{ backgroundColor: '#3b82f6' }}>
          + Create event
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: '#e2e8f0' }}>
        {WEEK_DAYS.map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold" style={{ color: '#94a3b8' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid — one row per week */}
      <div className="flex-1 flex flex-col">
        {Array.from({ length: numWeeks }).map((_, weekIdx) => {
          const weekDates = Array.from({ length: 7 }).map((_, col) => cellDateStr(weekIdx * 7 + col));
          const weekStart = weekDates[0];
          const weekEnd   = weekDates[6];

          // Multi-day events overlapping this week row
          const spans = events
            .filter(ev => multiDay(ev) && ev.endDate >= weekStart && ev.startDate <= weekEnd)
            .map((ev, si) => ({
              ev,
              color: eventColor(ev),
              startCol: weekDates.indexOf(ev.startDate < weekStart ? weekStart : ev.startDate),
              endCol:   weekDates.indexOf(ev.endDate   > weekEnd   ? weekEnd   : ev.endDate),
              showTitle: ev.startDate >= weekStart,
              slotIdx: si,
            }));

          const spanSlots = spans.length;

          return (
            <div key={weekIdx} className="relative flex-1 grid grid-cols-7" style={{ minHeight: '100px' }}>
              {/* Day cells */}
              {weekDates.map((dateStr, col) => {
                const dayNum = weekIdx * 7 + col - offset + 1;
                const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                const displayDay = dayNum < 1
                  ? prevMonthDays + dayNum
                  : dayNum > daysInMonth ? dayNum - daysInMonth : dayNum;
                const today_ = isCurrentMonth && isToday(dayNum);

                // Single-day events only in cell badges
                const singleDayEvts = events.filter(ev => !multiDay(ev) && ev.startDate === dateStr);

                return (
                  <div
                    key={col}
                    className="border-r border-b p-2 cursor-pointer"
                    style={{
                      borderColor: '#e8ecf0',
                      backgroundColor: today_ ? '#eff6ff' : isCurrentMonth ? '#fff' : '#f8fafc',
                      paddingTop: spanSlots > 0 ? `${8 + spanSlots * 20}px` : '8px',
                    }}
                    onClick={() => isCurrentMonth && handleDateClick(dateStr)}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm mb-1"
                      style={{
                        backgroundColor: today_ ? '#3b82f6' : 'transparent',
                        color: today_ ? '#fff' : isCurrentMonth ? '#1e293b' : '#cbd5e1',
                        fontWeight: today_ ? 700 : 400,
                      }}
                    >
                      {displayDay}
                    </div>
                    <div className="space-y-0.5">
                      {singleDayEvts.slice(0, 2).map((ev, ei) => (
                        <div
                          key={ev.id}
                          className="text-xs px-1.5 py-0.5 rounded font-medium truncate cursor-pointer"
                          style={{
                            backgroundColor: eventColor(ev) + '22',
                            color: eventColor(ev),
                            borderLeft: `3px solid ${eventColor(ev)}`,
                          }}
                          onClick={e => handleEventClick(ev, e)}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {singleDayEvts.length > 2 && (
                        <div className="text-xs" style={{ color: '#94a3b8' }}>+{singleDayEvts.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Multi-day spanning bars — absolutely positioned */}
              {spans.map(({ ev, color, startCol, endCol, showTitle, slotIdx }) => {
                if (startCol === -1 || endCol === -1) return null;
                const startsHere = ev.startDate >= weekStart;
                const endsHere   = ev.endDate   <= weekEnd;
                return (
                  <div
                    key={ev.id}
                    className="absolute text-xs font-medium flex items-center truncate cursor-pointer"
                    style={{
                      top: `${8 + slotIdx * 20}px`,
                      left:  `calc(${(startCol / 7) * 100}% + ${startsHere ? 2 : 0}px)`,
                      width: `calc(${((endCol - startCol + 1) / 7) * 100}% - ${(startsHere ? 2 : 0) + (endsHere ? 2 : 0)}px)`,
                      height: '16px',
                      backgroundColor: color + '28',
                      color,
                      borderLeft:  startsHere ? `3px solid ${color}` : 'none',
                      borderRight: endsHere   ? `3px solid ${color}` : 'none',
                      borderRadius: `${startsHere ? 3 : 0}px ${endsHere ? 3 : 0}px ${endsHere ? 3 : 0}px ${startsHere ? 3 : 0}px`,
                      paddingLeft: startsHere ? '4px' : '2px',
                      zIndex: 2,
                    }}
                    onClick={e => handleEventClick(ev, e)}
                  >
                    {showTitle ? ev.title : ''}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
