import React from 'react';
import { Sunrise, Sunset, Sun, Camera, Sparkles, Clock } from 'lucide-react';
import { useSun } from '../hooks/useSun';

export const SunCard: React.FC = () => {
  const { data: sunData, isLoading, error } = useSun();

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-[#8B2323]/10 flex items-center justify-center mx-auto mb-4">
          <Sun className="w-8 h-8 text-[#8B2323]" />
        </div>
        <p className="text-base font-medium text-primary">Sun Times Unavailable</p>
        <p className="text-sm text-muted mt-1">Unable to fetch sunrise/sunset data</p>
      </div>
    );
  }

  if (isLoading || !sunData) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-[#2D2D2B]/30 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="h-5 bg-[#2D2D2B]/30 rounded-xl w-24"></div>
            <div className="h-4 bg-[#2D2D2B]/20 rounded-xl w-32"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-20 bg-[#2D2D2B]/30 rounded-2xl"></div>
          <div className="h-20 bg-[#2D2D2B]/30 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Check if we're currently in golden or blue hour
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', {
    timeZone: 'Pacific/Honolulu',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const isGoldenHour = () => {
    // This is a simplified check - in production you'd want to do proper time comparison
    const hour = now.getHours();
    return (hour >= 6 && hour <= 7) || (hour >= 17 && hour <= 18);
  };

  const isBlueHour = () => {
    const hour = now.getHours();
    return (hour >= 5 && hour < 6) || (hour >= 18 && hour < 19);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative animate-float">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF9800] to-[#FF5722]"></div>
              <Sun className="w-6 h-6 text-white relative z-10" />
            </div>
          </div>
          <div>
            <h2 className="text-h2 font-display text-emphasis-high">Sun Times</h2>
            <p className="text-small text-emphasis-medium">Best photo moments</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-caption text-emphasis-low">Day Length</p>
          <p className="text-body font-semibold gradient-text">{sunData.dayLength}</p>
        </div>
      </div>

      {/* Main Sun Times */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Sunrise */}
        <div className="glass rounded-2xl p-4 hover:bg-[rgb(var(--tropical-stone)/0.2)] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE0B2]/20 to-[#FFCC80]/20 flex items-center justify-center">
                <Sunrise className="w-5 h-5 text-[#FF9800]" />
              </div>
              <h3 className="text-base font-medium text-primary">Sunrise</h3>
            </div>
          </div>
          <p className="text-2xl font-light text-primary">{sunData.sunrise.formatted}</p>
        </div>

        {/* Sunset */}
        <div className="glass rounded-2xl p-4 hover:bg-[rgb(var(--tropical-stone)/0.2)] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5722]/20 to-[#D84315]/20 flex items-center justify-center">
                <Sunset className="w-5 h-5 text-[#FF5722]" />
              </div>
              <h3 className="text-base font-medium text-primary">Sunset</h3>
            </div>
          </div>
          <p className="text-2xl font-light text-primary">{sunData.sunset.formatted}</p>
        </div>
      </div>

      {/* Photography Hours */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-secondary mb-3 flex items-center">
          <Camera className="w-4 h-4 mr-2" />
          Best Photography Times
        </h3>

        {/* Golden Hour */}
        <div className={`glass rounded-2xl p-4 ${isGoldenHour() ? 'ring-2 ring-[#FF9800]/30' : ''}`}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD54F]/20 to-[#FFB300]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FFB300]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-medium text-primary">Golden Hour</h4>
                {isGoldenHour() && (
                  <span className="px-2 py-1 text-xs rounded-full bg-[#FFB300]/20 text-[#FF9800] font-medium">
                    NOW
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mb-2">Warm, soft light perfect for portraits</p>
              <div className="space-y-1">
                <p className="text-sm text-primary">Morning: {sunData.goldenHour.morning}</p>
                <p className="text-sm text-primary">Evening: {sunData.goldenHour.evening}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blue Hour */}
        <div className={`glass rounded-2xl p-4 ${isBlueHour() ? 'ring-2 ring-[#407B9E]/30' : ''}`}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#407B9E]/20 to-[#214263]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#407B9E]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-medium text-primary">Blue Hour</h4>
                {isBlueHour() && (
                  <span className="px-2 py-1 text-xs rounded-full bg-[#407B9E]/20 text-[#407B9E] font-medium">
                    NOW
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mb-2">Even blue light ideal for cityscapes</p>
              <div className="space-y-1">
                <p className="text-sm text-primary">Morning: {sunData.blueHour.morning}</p>
                <p className="text-sm text-primary">Evening: {sunData.blueHour.evening}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solar Noon */}
      <div className="mt-4 pt-4 border-t border-[rgb(var(--tropical-sage)/0.2)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-[#FF9800]" />
            <span className="text-sm text-muted">Solar Noon</span>
          </div>
          <span className="text-sm font-medium text-primary">{sunData.solarNoon.formatted}</span>
        </div>
      </div>
    </div>
  );
};