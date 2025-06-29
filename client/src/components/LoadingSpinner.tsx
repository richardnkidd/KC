import React from 'react';
import logoPath from '@assets/logo.png';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#F5F3F0] to-[#EADDCA] z-50">
      <div className="text-center">
        <div className="relative">
          <img 
            src={logoPath} 
            alt="Loading..." 
            className="w-24 h-24 animate-spin-slow mb-4"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#407B9E]/20 to-transparent blur-2xl"></div>
        </div>
        <p className="text-lg font-display text-[#333333]/80">Loading Kamaʻāina Compass...</p>
        <p className="text-sm text-[#333333]/60 mt-2">Gathering real-time O'ahu data</p>
      </div>
    </div>
  );
};