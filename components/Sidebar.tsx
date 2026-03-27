'use client';

import React from 'react';
import { NavTab } from '@/types';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  rangeName: string;
  onBellClick: () => void;
}

const navItems: { label: string; id: NavTab; icon: React.ReactNode }[] = [
  {
    id: 'bays',
    label: 'Bays',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <circle cx="11" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M5 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <line x1="11" y1="12" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'Events',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M11 3l1.8 5.4L18 8.6l-4 3.9.9 5.5L11 15.5l-3.9 2.5.9-5.5-4-3.9 5.2-.2L11 3z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'displays',
    label: 'Displays',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <rect x="2" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <line x1="8" y1="19" x2="14" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="16" x2="11" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <polyline points="3,17 8,10 12,13 17,6 20,8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="8" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'overbet',
    label: 'Over Net',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M3 17 Q11 4 19 17" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="19" cy="17" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <path d="M4 9v4h3.5l6 4.5V4.5L7.5 9H4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <path d="M17 8c1 .8 1.8 2 1.8 3s-.8 2.2-1.8 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'support',
    label: 'Support',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <line x1="3" y1="11" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="14" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="3" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="14" x2="11" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'range-settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
        <circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M11 3v2M11 17v2M3 11h2M17 11h2M5.05 5.05l1.41 1.41M15.54 15.54l1.41 1.41M15.54 6.46l-1.41 1.41M6.46 15.54l-1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, rangeName, onBellClick }) => {
  return (
    <div
      className="fixed left-0 top-0 h-screen w-[168px] flex flex-col z-20"
      style={{ backgroundColor: '#0d1f38' }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="font-black tracking-[0.18em] text-xs leading-tight" style={{ color: '#fff' }}>
          TOPTRACER
        </div>
        <div className="font-black tracking-[0.18em] text-xs" style={{ color: '#fff' }}>
          RANGE.
        </div>
        <div className="text-xs tracking-[0.18em] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px' }}>
          MANAGEMENT SYSTEM
        </div>
      </div>

      {/* Location dropdown */}
      <div className="px-3 pb-3">
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded text-xs cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <span className="truncate text-left">{rangeName}</span>
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0 ml-1">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5"
              style={{
                color: active ? '#4db8ff' : 'rgba(255,255,255,0.65)',
                backgroundColor: 'transparent',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
              }}
            >
              <span style={{ color: active ? '#4db8ff' : 'rgba(255,255,255,0.5)' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bell + user */}
      <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button className="mb-3 opacity-50 hover:opacity-80 transition-opacity" onClick={onBellClick}>
          <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5" style={{ color: '#fff' }}>
            <path d="M11 3a7 7 0 017 7v3l1.5 2.5H3.5L5 13v-3a7 7 0 017-7z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M9 18a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
        <button
          className="flex items-center gap-2 w-full text-left"
          onClick={() => onTabChange('profile')}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#2a5298' }}
          >
            NA
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: '#fff' }}>Nathan Ade</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
