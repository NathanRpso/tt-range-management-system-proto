'use client';

import React, { useState } from 'react';
import { mockPlayers } from '@/data/mockData';

const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'sessions' | 'shots' | 'registered'>('sessions');

  const filtered = mockPlayers
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'sessions') return b.totalSessions - a.totalSessions;
      if (sortBy === 'shots') return b.totalShots - a.totalShots;
      return b.registeredDate.localeCompare(a.registeredDate);
    });

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-xl font-bold mb-5" style={{ color: '#1e293b' }}>User Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Registered Players', value: mockPlayers.length, color: '#0077cc' },
          { label: 'Active This Month', value: 8, color: '#16a34a' },
          { label: 'Avg. Sessions / Player', value: Math.round(mockPlayers.reduce((s, p) => s + p.totalSessions, 0) / mockPlayers.length), color: '#7c3aed' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e2e8f0' }}>
            <div className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm" style={{ color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm border" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}>
        <span>⚠️</span>
        <span>Toptracer player data sync is active. Some historical records may not be available.</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 max-w-xs"
          style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
        />
        <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
          <span>Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border rounded px-2 py-1.5 text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}>
            <option value="sessions">Sessions</option>
            <option value="shots">Total Shots</option>
            <option value="name">Name</option>
            <option value="registered">Date Registered</option>
          </select>
        </div>
        <button className="px-3 py-1.5 text-xs rounded border ml-auto" style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Player', 'Email', 'Registered', 'Sessions', 'Total Shots', 'Avg Session', 'Fav. Game'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#94a3b8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors" style={{ borderTop: '1px solid #f1f5f9' }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: '#0077cc' }}>
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium" style={{ color: '#1e293b' }}>{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3" style={{ color: '#64748b' }}>{p.email}</td>
                <td className="px-5 py-3" style={{ color: '#64748b' }}>{p.registeredDate}</td>
                <td className="px-5 py-3 font-semibold" style={{ color: '#0077cc' }}>{p.totalSessions}</td>
                <td className="px-5 py-3" style={{ color: '#475569' }}>{p.totalShots.toLocaleString()}</td>
                <td className="px-5 py-3" style={{ color: '#475569' }}>{p.avgSessionMin} min</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                    {p.favoriteGame}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: '#94a3b8' }}>No players found</div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
