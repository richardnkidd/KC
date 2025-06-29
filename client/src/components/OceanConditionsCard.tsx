import React, { useState } from 'react';
import { Waves, ArrowUp, ArrowDown, ArrowUpRight, MapPin, ChevronDown, Activity, Wind } from 'lucide-react';
import { useSurf } from '../hooks/useSurf';
import { useTides } from '../hooks/useTides';
import { cn } from '@/lib/utils';

// Popular Oahu surf spots with coordinates
const SURF_SPOTS = [
  { name: "Ala Moana Bowls", lat: 21.276, lng: -157.822, region: "Town" },
  { name: "Pipeline", lat: 21.665, lng: -158.053, region: "North Shore" },
  { name: "Sunset Beach", lat: 21.679, lng: -158.041, region: "North Shore" },
  { name: "Waimea Bay", lat: 21.643, lng: -158.066, region: "North Shore" },
  { name: "Diamond Head", lat: 21.255, lng: -157.805, region: "Town" },
  { name: "Sandy Beach", lat: 21.285, lng: -157.673, region: "East Side" },
  { name: "Makapuu", lat: 21.310, lng: -157.649, region: "East Side" },
  { name: "Makaha", lat: 21.469, lng: -158.222, region: "West Side" },
  { name: "White Plains", lat: 21.306, lng: -158.044, region: "West Side" },
  { name: "Castles", lat: 21.363, lng: -157.677, region: "Windward" },
] as const;

const headings = ["N","NE","E","SE","S","SW","W","NW"] as const;
const toHeading = (deg: number) => headings[Math.round(deg / 45) % 8];

const heightColor = (ft: number) => {
  if (ft < 2) return "text-[#407B9E]";
  if (ft < 4) return "text-[#214263]";
  if (ft < 6) return "text-[#0F2B3E]";
  return "text-[#8B2323]";
};

export const OceanConditionsCard: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState(SURF_SPOTS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'surf' | 'tides'>('overview');

  const { data: surfData, isLoading: surfLoading, error: surfError } = useSurf({
    name: selectedSpot.name,
    lat: selectedSpot.lat,
    lng: selectedSpot.lng,
  });

  const { data: tides, isLoading: tidesLoading, error: tidesError } = useTides();

  const isLoading = surfLoading || tidesLoading;
  const error = surfError || tidesError;

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-[#8B2323]/10 flex items-center justify-center mx-auto mb-4">
          <Waves className="w-8 h-8 text-[#8B2323]" />
        </div>
        <p className="text-base font-medium text-primary">Ocean Data Unavailable</p>
        <p className="text-sm text-muted mt-1">Unable to fetch ocean conditions</p>
      </div>
    );
  }

  if (isLoading || !surfData || !tides) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-[#2D2D2B]/30 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="h-6 bg-[#2D2D2B]/30 rounded-xl w-32"></div>
            <div className="h-4 bg-[#2D2D2B]/20 rounded-xl w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-32 bg-[#2D2D2B]/30 rounded-2xl"></div>
          <div className="h-32 bg-[#2D2D2B]/30 rounded-2xl"></div>
        </div>
        <div className="h-20 bg-[#2D2D2B]/30 rounded-2xl"></div>
      </div>
    );
  }

  const { waveHeight = 0, swellDir = 0, swellPeriod = 0, windSpeed = 0, windDir = 0, time = new Date() } = surfData || {};

  const getWaveQuality = (height: number) => {
    if (height < 2) return { text: 'Small', color: 'text-[#6B7280]', emoji: '😴' };
    if (height < 4) return { text: 'Fun Size', color: 'text-[#407B9E]', emoji: '🙂' };
    if (height < 6) return { text: 'Solid', color: 'text-[#214263]', emoji: '😊' };
    return { text: 'Firing! 🔥', color: 'text-[#8B2323]', emoji: '🤙' };
  };

  const waveQuality = getWaveQuality(waveHeight);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative animate-float">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#20B2AA] to-[#008B8B]"></div>
              <Waves className="w-6 h-6 text-white relative z-10" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-h2 font-display text-emphasis-high">Ocean Conditions</h2>
            
            {/* Spot Selector */}
            <div className="relative mt-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-small text-emphasis-medium hover:text-emphasis-high transition-colors group"
              >
                <MapPin className="w-3 h-3" />
                <span>{selectedSpot.name}</span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-transform",
                  isDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full mt-2 w-64 bg-white rounded-2xl shadow-lg border border-[rgba(0,0,0,0.06)] overflow-hidden z-50">
                    <div className="max-h-64 overflow-y-auto">
                      {Object.entries(
                        SURF_SPOTS.reduce((acc, spot) => {
                          if (!acc[spot.region]) acc[spot.region] = [];
                          acc[spot.region].push(spot);
                          return acc;
                        }, {} as Record<string, typeof SURF_SPOTS[number][]>)
                      ).map(([region, spots]) => (
                        <div key={region}>
                          <div className="px-4 py-2 text-xs font-medium text-[#333333]/50 bg-[#F5FAF8]">
                            {region}
                          </div>
                          {spots.map((spot) => (
                            <button
                              key={spot.name}
                              onClick={() => {
                                setSelectedSpot(spot);
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2 text-sm hover:bg-[#F5FAF8] transition-colors",
                                selectedSpot.name === spot.name && "bg-[#EEE0C9]/30 text-[#214263] font-medium"
                              )}
                            >
                              {spot.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-caption text-emphasis-low">Current</p>
          <p className="text-body font-semibold gradient-text">{tides.current.status}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 p-1 bg-[rgba(0,0,0,0.04)] rounded-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            "flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeTab === 'overview' 
              ? "bg-white text-[#214263] shadow-sm" 
              : "text-[#333333]/60 hover:text-[#333333]/80"
          )}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('surf')}
          className={cn(
            "flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeTab === 'surf' 
              ? "bg-white text-[#214263] shadow-sm" 
              : "text-[#333333]/60 hover:text-[#333333]/80"
          )}
        >
          Surf Report
        </button>
        <button
          onClick={() => setActiveTab('tides')}
          className={cn(
            "flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeTab === 'tides' 
              ? "bg-white text-[#214263] shadow-sm" 
              : "text-[#333333]/60 hover:text-[#333333]/80"
          )}
        >
          Tide Chart
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Conditions - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Wave Height */}
            <div className="glass rounded-2xl p-4">
              <div className="text-center">
                <div className="flex items-baseline justify-center space-x-1 mb-2">
                  <span className={cn("font-light", heightColor(waveHeight))} style={{ fontSize: '36px' }}>
                    {waveHeight.toFixed(1)}
                  </span>
                  <span className="text-xl text-emphasis-medium">ft</span>
                </div>
                <p className={cn("text-body font-medium", waveQuality.color)}>{waveQuality.text}</p>
                <p className="text-small text-emphasis-low">Wave height</p>
              </div>
            </div>

            {/* Tide Level */}
            <div className="glass rounded-2xl p-4">
              <div className="text-center">
                <div className="flex items-baseline justify-center space-x-1 mb-2">
                  <span className="font-light gradient-text" style={{ fontSize: '36px' }}>{tides.current.level}</span>
                  <span className="text-xl text-emphasis-medium">ft</span>
                </div>
                <p className="text-body font-medium text-primary">{tides.current.status}</p>
                <p className="text-small text-emphasis-low">Tide level</p>
              </div>
            </div>
          </div>

          {/* Detailed Ocean Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowUpRight
                  style={{ transform: `rotate(${swellDir}deg)` }}
                  className="w-4 h-4 text-[#407B9E]"
                />
                <p className="text-caption text-emphasis-low">Swell</p>
              </div>
              <p className="text-body font-medium text-emphasis-high">
                {toHeading(swellDir)} / {Math.round(swellPeriod)}s
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowUpRight
                  style={{ transform: `rotate(${windDir}deg)` }}
                  className="w-4 h-4 text-[#407B9E]"
                />
                <p className="text-caption text-emphasis-low">Wind</p>
              </div>
              <p className="text-body font-medium text-emphasis-high">
                {windSpeed}kn {toHeading(windDir)}
              </p>
            </div>
          </div>

          {/* Tide Progress Bar */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-small text-emphasis-medium">Tide Progress</span>
              <span className="text-body font-semibold text-emphasis-high">{tides.current.level} ft</span>
            </div>

            <div className="relative">
              <div className="w-full rounded-full overflow-hidden" style={{ height: '16px', backgroundColor: 'rgb(var(--tropical-stone) / 0.3)' }}>
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-[rgb(var(--tropical-ocean-light)/0.3)] to-transparent animate-wave"></div>
                </div>
                <div 
                  className="relative h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${tides.current.percentage}%`,
                    background: `linear-gradient(90deg, 
                      rgb(var(--tropical-ocean)) 0%, 
                      rgb(var(--tropical-ocean-light)) 50%,
                      rgb(var(--tropical-sand)/0.5) 100%)`
                  }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Surf Report Tab */}
      {activeTab === 'surf' && (
        <div className="space-y-6">
          {/* Wave Quality Card */}
          <div className="glass rounded-2xl p-4 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#407B9E]/20 to-[#214263]/10 flex items-center justify-center">
              <span className="text-4xl">{waveQuality.emoji}</span>
            </div>
            <h3 className={cn("text-xl font-medium mb-2", waveQuality.color)}>{waveQuality.text}</h3>
            <p className="text-sm text-muted">
              {waveHeight.toFixed(1)} ft waves at {selectedSpot.name}
            </p>
          </div>

          {/* Detailed Surf Metrics */}
          <div className="space-y-3">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Waves className="w-5 h-5 text-[#407B9E]" />
                  <div>
                    <p className="text-sm font-medium text-primary">Wave Height</p>
                    <p className="text-xs text-muted">Hawaiian scale</p>
                  </div>
                </div>
                <span className={cn("text-xl font-light", heightColor(waveHeight))}>
                  {waveHeight.toFixed(1)} ft
                </span>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ArrowUpRight
                    style={{ transform: `rotate(${swellDir}deg)` }}
                    className="w-5 h-5 text-[#407B9E]"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">Primary Swell</p>
                    <p className="text-xs text-muted">Direction & period</p>
                  </div>
                </div>
                <span className="text-xl font-light">
                  {toHeading(swellDir)} / {Math.round(swellPeriod)}s
                </span>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wind className="w-5 h-5 text-[#407B9E]" />
                  <div>
                    <p className="text-sm font-medium text-primary">Wind</p>
                    <p className="text-xs text-muted">Current conditions</p>
                  </div>
                </div>
                <span className="text-xl font-light">
                  {windSpeed}kn {toHeading(windDir)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tides Tab */}
      {activeTab === 'tides' && (
        <div className="space-y-6">
          {/* Current Tide Status */}
          <div className="glass rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {tides.current.status === 'Rising' ? (
                <ArrowUp className="w-8 h-8 text-[#10B981]" />
              ) : (
                <ArrowDown className="w-8 h-8 text-[#3B82F6]" />
              )}
              <span className="text-3xl font-light gradient-text">{tides.current.level} ft</span>
            </div>
            <p className="text-lg font-medium text-primary">{tides.current.status} Tide</p>
            <p className="text-sm text-muted mt-1">{tides.current.percentage}% to next tide</p>
          </div>

          {/* Upcoming Tides */}
          <div>
            <h3 className="text-sm font-medium text-secondary mb-3">Next 4 Tides</h3>
            <div className="space-y-3">
              {tides.upcoming.map((tide, index) => (
                <div key={index} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      tide.type === 'High' ? "bg-[#407B9E]/20" : "bg-[#EADDCA]/20"
                    )}>
                      {tide.type === 'High' ? (
                        <ArrowUp className="w-5 h-5 text-[#407B9E]" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-[#EADDCA]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{tide.type} Tide</p>
                      <p className="text-xs text-muted">{tide.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-light">{tide.height} ft</p>
                    <p className="text-xs text-muted">{tide.timeLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};