'use client';

import React from 'react';

export default function MarketingPage() {
  return (
    <div className="p-6" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#1e293b' }}>Marketing</h1>
      <p className="text-sm mb-6" style={{ color: '#0077cc' }}>
        Style your driving range with branded Toptracer Range material.
      </p>

      {/* Marketing Toolkit Card */}
      <div className="rounded-2xl overflow-hidden border bg-white" style={{ maxWidth: 380, borderColor: '#e2e8f0' }}>
        {/* Gradient image area */}
        <div
          className="relative flex items-center justify-center"
          style={{
            height: 180,
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 35%, #ec4899 65%, #f43f5e 100%)',
          }}
        >
          {/* Decorative icons */}
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" className="absolute inset-0 m-auto opacity-20">
            <circle cx="80" cy="60" r="50" stroke="white" strokeWidth="1.5" />
            <circle cx="80" cy="60" r="32" stroke="white" strokeWidth="1.5" />
          </svg>

          {/* Megaphone icon */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              {/* Megaphone body */}
              <path
                d="M10 24H20L44 12V52L20 40H10V24Z"
                fill="white"
                opacity="0.9"
              />
              {/* Sound waves */}
              <path d="M48 22C51 25 51 39 48 42" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M52 18C57 23 57 41 52 46" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
              {/* Handle */}
              <rect x="14" y="40" width="6" height="10" rx="2" fill="white" opacity="0.9" />
            </svg>

            {/* Small floating icons */}
            <div className="flex items-center gap-3">
              {/* Star */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L9.8 6.2H15.3L10.8 9.4L12.6 14.6L8 11.4L3.4 14.6L5.2 9.4L0.7 6.2H6.2L8 1Z" fill="white" />
                </svg>
              </div>
              {/* Chart */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="8" width="3" height="6" rx="0.5" fill="white" />
                  <rect x="6" y="4" width="3" height="10" rx="0.5" fill="white" />
                  <rect x="11" y="1" width="3" height="13" rx="0.5" fill="white" />
                </svg>
              </div>
              {/* Tag */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2H8L14 8L8 14L2 8V2Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  <circle cx="5" cy="5" r="1.2" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="p-5">
          <h2 className="font-bold text-base mb-1" style={{ color: '#1e293b' }}>Marketing Toolkit</h2>
          <p className="text-sm" style={{ color: '#0077cc' }}>
            Promotional and marketing resources for your range.
          </p>
          <button
            disabled
            className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold text-white cursor-not-allowed"
            style={{ backgroundColor: '#93c5fd' }}
            title="Marketing Toolkit is not available in this environment"
          >
            View Toolkit
          </button>
        </div>
      </div>
    </div>
  );
}
