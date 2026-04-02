'use client';

import React, { useState } from 'react';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="relative cursor-pointer flex-shrink-0"
      style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: on ? '#3b82f6' : '#cbd5e1', transition: 'background-color 0.2s' }}
    >
      <div
        style={{
          position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
          left: on ? 23 : 3, transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
  const [language, setLanguage] = useState('English');
  const [soundOn, setSoundOn] = useState(true);
  const [emailOn, setEmailOn] = useState(false);

  return (
    <div className="min-h-full bg-white">
      {/* Tab bar */}
      <div className="flex border-b px-8 pt-5" style={{ borderColor: '#e2e8f0' }}>
        {([['profile', 'Profile settings'], ['notifications', 'Notifications']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="mr-8 pb-3 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: activeTab === id ? '#3b82f6' : 'transparent',
              color: activeTab === id ? '#3b82f6' : '#64748b',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-8 py-8 max-w-2xl">
        {activeTab === 'profile' ? (
          <>
            {/* Name / email / sign out */}
            <div className="mb-8 pb-8 border-b" style={{ borderColor: '#e2e8f0' }}>
              <div className="font-bold text-base mb-0.5" style={{ color: '#1e293b' }}>Nathan A</div>
              <div className="text-sm mb-3" style={{ color: '#64748b' }}>nathan.a@gmail.com</div>
              <button className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#ef4444' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M5.5 2H2.5A1 1 0 001.5 3v9a1 1 0 001 1h3M10 10.5l3-3-3-3M13.5 7.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign out
              </button>
            </div>

            {/* Language preference */}
            <div className="mb-8 pb-8 border-b" style={{ borderColor: '#e2e8f0' }}>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1e293b' }}>Language preference</div>
              <div className="text-sm mb-3" style={{ color: '#64748b' }}>
                This language is applied for your account when using Toptracer Range Management System.
              </div>
              <div className="relative inline-block">
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="appearance-none border rounded px-3 py-2 pr-8 text-sm"
                  style={{ borderColor: '#cbd5e1', color: '#1e293b', backgroundColor: '#fff' }}
                >
                  {['English', 'Spanish', 'French', 'German', 'Japanese', 'Swedish'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <svg className="absolute right-2.5 top-3 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Cookie settings */}
            <div className="mb-8 pb-8 border-b" style={{ borderColor: '#e2e8f0' }}>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1e293b' }}>Cookie settings</div>
              <div className="text-sm mb-3" style={{ color: '#3b82f6' }}>Current setting: Accepted all cookies</div>
              <button
                className="px-4 py-2 rounded border text-sm font-medium"
                style={{ borderColor: '#cbd5e1', color: '#475569', backgroundColor: '#f8fafc' }}
              >
                Open cookie settings
              </button>
              <div className="mt-3">
                <a href="#" className="inline-flex items-center gap-1 text-sm" style={{ color: '#3b82f6' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4.5 8.5L8.5 4.5M8.5 4.5H5.5M8.5 4.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Privacy policy
                </a>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1e293b' }}>Terms &amp; Conditions</div>
              <div className="text-sm" style={{ color: '#64748b' }}>
                Usage of the{' '}
                <span style={{ color: '#3b82f6' }}>Toptracer Range Management System</span>
                {' '}is subject to the terms of your{' '}
                <span style={{ color: '#3b82f6' }}>Toptracer Range Customer Agreement</span>.
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Notifications tab */}
            <div className="font-semibold text-base mb-4" style={{ color: '#1e293b' }}>Over the net</div>

            {/* Sound card */}
            <div className="rounded-xl border mb-4 p-5" style={{ borderColor: '#e2e8f0' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 6H1v4h2l4 3V3L3 6z" stroke="#475569" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
                      <path d="M11 5a4 4 0 010 6" stroke="#475569" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                      <path d="M13 3a7 7 0 010 10" stroke="#475569" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                    </svg>
                    <span className="font-semibold text-sm" style={{ color: '#1e293b' }}>Sound</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#3b82f6' }}>
                    Hear a sound when a ball goes over the net, if the Toptracer Range Management System is open in your PC browser.
                  </p>
                  <p className="text-sm" style={{ color: '#3b82f6' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Note:</span>{' '}
                    <span style={{ color: '#475569' }}>Sound may be blocked until you interact with the page (e.g., tap or click). Not supported on mobile devices or tablets due to browser restrictions.</span>
                  </p>
                </div>
                <Toggle on={soundOn} onToggle={() => setSoundOn(v => !v)} />
              </div>
            </div>

            {/* Emails card */}
            <div className="rounded-xl border p-5" style={{ borderColor: '#e2e8f0' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#475569" strokeWidth="1.3"/>
                      <path d="M1.5 4L8 9l6.5-5" stroke="#475569" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <span className="font-semibold text-sm" style={{ color: '#1e293b' }}>Emails</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#475569' }}>
                    {"We'll send an email to "}
                    <span className="font-bold" style={{ color: '#1e293b' }}>nathan.a@gmail.com</span>
                    {" each time a ball goes over the net."}
                  </p>
                  <p className="text-sm" style={{ color: '#475569' }}>
                    <span className="font-bold">Tip:</span>{' '}Make sure to add{' '}
                    <span className="font-bold">no-reply@email.www4.trms.toptracer.com</span>
                    {' '}to your contacts so it doesn{"'"}t end up in your spam or junk folder.
                  </p>
                </div>
                <Toggle on={emailOn} onToggle={() => setEmailOn(v => !v)} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
