'use client';

import React from 'react';
import { NavTab } from '@/types';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  rangeName: string;
}

const tiles: { id: NavTab; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'bays',
    label: 'BAYS',
    description: 'Get an overview of the activity at the range. Assign players to bays when operating in locked mode.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="11" r="5" stroke="white" strokeWidth="2.5" fill="none"/>
        <path d="M10 35c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <line x1="20" y1="21" x2="28" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="28" y1="28" x2="24" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'EVENTS',
    description: 'Create and customize events. Invite players to join and share the event leaderboards afterwards.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 6l3.09 9.26L32 15.27l-7 6.82 1.64 9.91L20 27l-6.64 5-1.36-9.91-7-6.82 8.91-.01L20 6z" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'displays',
    label: 'DISPLAYS',
    description: 'Manage the content that appears on the screens throughout your facility, including leaderboards or advertising upcoming events.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="7" width="32" height="21" rx="2" stroke="white" strokeWidth="2.5" fill="none"/>
        <line x1="14" y1="33" x2="26" y2="33" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="20" y1="28" x2="20" y2="33" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'dashboard',
    label: 'DASHBOARD',
    description: 'See how well your range is doing by viewing activity and different sets of data over time.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <polyline points="6,30 14,18 21,24 30,10 36,14" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="36" cy="14" r="2" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'overbet',
    label: 'OVER NET',
    description: 'Keep track of how many balls go over the net and where. View the over net shots as a heatmap or single shots.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M6 30 Q20 8 34 30" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="34" cy="30" r="3" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'marketing',
    label: 'MARKETING',
    description: 'Style your driving range with branded Toptracer Range material.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M8 16v8h6l10 8V8L14 16H8z" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
        <path d="M30 14c2 1.5 3.5 4 3.5 6.5S32 26 30 27.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M27 17.5c1 1 1.5 2.5 1.5 3.5s-.5 2.5-1.5 3.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'support',
    label: 'SUPPORT',
    description: 'Contact us if you need help or have any questions. Support can be contacted 24 hours a day, every day by phone and email.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" fill="none"/>
        <circle cx="20" cy="20" r="5" stroke="white" strokeWidth="2.5" fill="none"/>
        <line x1="6" y1="20" x2="15" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="25" y1="20" x2="34" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="20" y1="6" x2="20" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="20" y1="25" x2="20" y2="34" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'range-settings',
    label: 'SETTINGS',
    description: 'Configure the correct settings for your range. View the latest change in settings and manage users.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="4" stroke="white" strokeWidth="2.5" fill="none"/>
        <path d="M20 6v4M20 30v4M6 20h4M30 20h4M9.17 9.17l2.83 2.83M27.17 27.17l2.83 2.83M30.83 9.17l-2.83 2.83M12.83 27.17l-2.83 2.83" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, rangeName }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #0d2a4a 0%, #1a4a7a 40%, #0a1f3d 100%)',
      }}
    >
      {/* Top-left location selector */}
      <div className="px-6 pt-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <span>{rangeName}</span>
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Hero text */}
      <div className="text-center pt-10 pb-8">
        <h1
          className="font-black italic uppercase tracking-tight mb-3"
          style={{ fontSize: '3.5rem', color: '#fff', lineHeight: 1, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          LET&apos;S GET TO IT
        </h1>
        <p className="font-semibold text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Where do you want to go?
        </p>
      </div>

      {/* Tile grid */}
      <div className="flex-1 flex items-start justify-center px-8 pb-4">
        <div className="grid grid-cols-3 gap-3 w-full max-w-4xl">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => onNavigate(tile.id)}
              className="flex rounded-lg overflow-hidden text-left transition-transform hover:scale-[1.02] hover:shadow-2xl"
              style={{ minHeight: '110px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
            >
              {/* Dark icon panel */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: '90px', backgroundColor: '#0d2040' }}
              >
                {tile.icon}
              </div>
              {/* White text panel */}
              <div className="flex-1 bg-white px-4 py-3 flex flex-col justify-center">
                <div
                  className="font-black text-sm mb-1 tracking-wide"
                  style={{ color: '#0d2040' }}
                >
                  {tile.label}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: '#5a6a7e' }}>
                  {tile.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom branding + sign out */}
      <div className="text-center pb-8 pt-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
            <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">T</text>
          </svg>
          <div>
            <div className="font-black tracking-[0.2em] text-sm" style={{ color: '#fff' }}>TOPTRACER RANGE.</div>
            <div className="text-xs tracking-[0.35em] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>MANAGEMENT SYSTEM</div>
          </div>
        </div>
        <button
          className="flex items-center gap-2 mx-auto text-sm transition-opacity hover:opacity-100 opacity-60"
          style={{ color: '#fff' }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
            <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3M13 14l3-4-3-4M16 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
