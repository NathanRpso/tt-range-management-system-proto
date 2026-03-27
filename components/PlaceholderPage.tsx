'use client';

import React from 'react';

interface PlaceholderPageProps {
  title: string;
  icon: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon, description }) => {
  return (
    <div className="p-6 flex flex-col items-start">
      <h1 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>{title}</h1>
      <div className="flex flex-col items-center justify-center w-full max-w-md mt-16 mx-auto text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#475569' }}>{title}</h2>
        <p className="text-sm" style={{ color: '#94a3b8' }}>{description}</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
