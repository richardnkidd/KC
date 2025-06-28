import { useState } from "react";
import { ArrowUpRight, Waves, MapPin, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useSurf } from "@/hooks/useSurf";
import { cn } from "@/lib/utils";

/** Popular Oahu surf spots with coordinates */
const SURF_SPOTS = [
  { name: "Ala Moana Bowls", lat: 21.276, lng: -157.822, region: "Town" },
  { name: "Pipeline", lat: 21.665, lng: -158.053, region: "North Shore" },
  { name: "Sunset Beach", lat: 21.679, lng: -158.041, region: "North Shore" },
  { name: "Waimea Bay", lat: 21.643, lng: -158.066, region: "North Shore" },
  { name: "Rocky Point", lat: 21.670, lng: -158.049, region: "North Shore" },
  { name: "Haleiwa", lat: 21.595, lng: -158.104, region: "North Shore" },
  { name: "Diamond Head", lat: 21.255, lng: -157.805, region: "Town" },
  { name: "Sandy Beach", lat: 21.285, lng: -157.673, region: "East Side" },
  { name: "Makapuu", lat: 21.310, lng: -157.649, region: "East Side" },
  { name: "Makaha", lat: 21.469, lng: -158.222, region: "West Side" },
  { name: "White Plains", lat: 21.306, lng: -158.044, region: "West Side" },
  { name: "Castles", lat: 21.363, lng: -157.677, region: "Windward" },
] as const;

/** Utility to turn compass degrees into N, NE, E… */
const headings = ["N","NE","E","SE","S","SW","W","NW"] as const;
const toHeading = (deg:number) => headings[Math.round(deg / 45) % 8];

/** Color function for wave heights */
const heightColor = (ft:number) => {
  if (ft < 2) return "text-[#407B9E]";
  if (ft < 4) return "text-[#214263]";
  if (ft < 6) return "text-[#0F2B3E]";
  return "text-[#8B2323]";
};

export default function SurfCard() {
  const [selectedSpot, setSelectedSpot] = useState(SURF_SPOTS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data, isLoading, error } = useSurf({
    name: selectedSpot.name,
    lat: selectedSpot.lat,
    lng: selectedSpot.lng,
  });

  if (error) return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Waves className="w-5 h-5 text-[#407B9E]" />
        <h3 className="text-h3 font-display">Surf Report</h3>
      </div>
      <div className="text-secondary text-small">Unable to load surf conditions</div>
    </div>
  );

  const { waveHeight = 0, swellDir = 0, swellPeriod = 0, windSpeed = 0, windDir = 0, time = new Date() } = data || {};

  return (
    <div>
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative animate-float">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#20B2AA] to-[#008B8B]"></div>
              <Waves className="w-6 h-6 text-white relative z-10" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-h2 font-display text-emphasis-high">Surf Report</h2>

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
          <p className="text-caption text-emphasis-low">
            {time && `Updated ${new Date(time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
          </p>
        </div>
      </div>

      {/* Wave Height Display */}
      {isLoading ? (
        <div className="loading-skeleton h-20 w-full rounded-2xl mb-6"></div>
      ) : (
        <>
          <div className="flex items-end justify-between mb-6">
            <div className="flex items-baseline space-x-2">
              <span className={cn(
                "font-light",
                heightColor(waveHeight)
              )} style={{ fontSize: '48px' }}>
                {waveHeight.toFixed(1)}
              </span>
              <span className="text-xl text-emphasis-medium">ft</span>
            </div>

            {/* Swell & Wind Info */}
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end space-x-2">
                <ArrowUpRight
                  style={{ transform: `rotate(${swellDir}deg)` }}
                  className="w-4 h-4 text-[#407B9E]"
                />
                <span className="text-small text-emphasis-medium">
                  Swell {toHeading(swellDir)} / {Math.round(swellPeriod)}s
                </span>
              </div>
              <div className="text-small text-emphasis-low">
                Wind {windSpeed}kn {toHeading(windDir)}
              </div>
            </div>
          </div>

          {/* Conditions Summary */}
          <div className="glass rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-caption text-emphasis-low mb-1">Wave Quality</p>
                <p className="text-body font-medium text-emphasis-high">
                  {waveHeight < 2 ? 'Small' : waveHeight < 4 ? 'Fun Size' : waveHeight < 6 ? 'Solid' : 'Firing! 🔥'}
                </p>
              </div>
              <div>
                <p className="text-caption text-emphasis-low mb-1">Wind Conditions</p>
                <p className="text-body font-medium text-emphasis-high">
                  {windSpeed < 10 ? 'Light' : windSpeed < 20 ? 'Moderate' : 'Strong'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[rgb(var(--tropical-sage)/0.2)]">
        <p className="text-xs text-muted flex items-center">
          <Waves className="w-3 h-3 mr-2" />
          Open-Meteo Marine API • Updates hourly
        </p>
      </div>
    </div>
  );
}