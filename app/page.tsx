'use client';

import React, { useState } from 'react';
import { NavTab, Event } from '@/types';
import { mockEvents, mockOverNetShots } from '@/data/mockData';
import LandingPage from '@/components/LandingPage';
import Sidebar from '@/components/Sidebar';
import DashboardPage from '@/components/DashboardPage';
import BaysPage from '@/components/BaysPage';
import EventsPage from '@/components/EventsPage';
import DisplaysPage from '@/components/DisplaysPage';
import UserManagementPage from '@/components/UserManagementPage';
import RangeSettingsPage from '@/components/RangeSettingsPage';
import OverNetPage from '@/components/OverNetPage';
import MarketingPage from '@/components/MarketingPage';
import SupportPage from '@/components/SupportPage';
import ProfilePage from '@/components/ProfilePage';

const RANGE_NAME = 'Golf Complex (us-ky-paducah)';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Shared state
  const [blockedBayNums, setBlockedBayNums] = useState<number[]>([2, 3, 5, 6, 8]);
  const [blockedBaysEnabled, setBlockedBaysEnabled] = useState(true);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(() => mockOverNetShots.slice(0, 5));

  const dismissNotif = (index: number) => setNotifs(prev => prev.filter((_, i) => i !== index));

  if (activeTab === 'home') {
    return <LandingPage onNavigate={setActiveTab} rangeName={RANGE_NAME} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':       return <DashboardPage />;
      case 'bays':            return <BaysPage blockedBayNums={blockedBayNums} blockedBaysEnabled={blockedBaysEnabled} />;
      case 'events':          return <EventsPage events={events} setEvents={setEvents} />;
      case 'displays':        return <DisplaysPage />;
      case 'user-management': return <UserManagementPage />;
      case 'range-settings':  return (
        <RangeSettingsPage
          blockedBayNums={blockedBayNums}
          setBlockedBayNums={setBlockedBayNums}
          blockedBaysEnabled={blockedBaysEnabled}
          setBlockedBaysEnabled={setBlockedBaysEnabled}
        />
      );
      case 'overbet':         return <OverNetPage />;
      case 'marketing':       return <MarketingPage />;
      case 'support':         return <SupportPage />;
      case 'profile':         return <ProfilePage />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#fff' }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rangeName={RANGE_NAME}
        onBellClick={() => setNotifOpen(v => !v)}
      />
      <div className="flex-1 overflow-auto" style={{ marginLeft: '168px' }}>
        {renderPage()}
      </div>

      {/* Over-net notifications drawer */}
      {notifOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setNotifOpen(false)}
          />
          <div
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{ width: 320, backgroundColor: '#0d1f38', boxShadow: '-4px 0 24px rgba(0,0,0,0.4)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-8 pb-4">
              <h2
                className="font-black uppercase leading-tight"
                style={{ color: '#fff', fontSize: 22, letterSpacing: '0.04em' }}
              >
                OVER NET<br/>NOTIFICATIONS
              </h2>
              <button
                onClick={() => setNotifOpen(false)}
                className="text-2xl leading-none mt-1"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                ×
              </button>
            </div>

            <div className="px-6">
              <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {notifs.length === 0 ? (
                <p
                  className="font-bold uppercase tracking-widest text-xs mt-6"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  NO NEW NOTIFICATIONS
                </p>
              ) : (
                <div className="space-y-3">
                  <p
                    className="font-bold uppercase tracking-widest text-xs mb-4"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    RECENT ALERTS
                  </p>
                  {notifs.map((shot, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-3"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs font-bold uppercase tracking-wide"
                          style={{ color: '#ef4444' }}
                        >
                          Bay {shot.bay}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {shot.time.split(' ')[1]}
                          </span>
                          <button
                            onClick={() => dismissNotif(i)}
                            className="leading-none hover:opacity-100 transition-opacity"
                            style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16 }}
                            title="Dismiss"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-semibold" style={{ color: '#fff' }}>
                        {shot.height.toFixed(2)} yd over net
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {shot.time.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => { setActiveTab('overbet'); setNotifOpen(false); }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                View all in Over Net →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
