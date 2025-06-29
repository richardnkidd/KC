import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, MapPin, ChevronDown, AlertTriangle, Activity, Eye, Wind, Droplets, TrendingUp } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { useRainRadar } from '../hooks/useRainRadar';
import { cn } from '@/lib/utils';

// O'ahu neighborhood coordinates
const OAHU_NEIGHBORHOODS = {
  "Honolulu": { lat: 21.3099, lng: -157.8581, region: "Urban Core" },
  "Waikīkī": { lat: 21.2793, lng: -157.8293, region: "Town" },
  "Mānoa": { lat: 21.3157, lng: -157.8025, region: "Valley" },
  "Kailua": { lat: 21.4022, lng: -157.7394, region: "Windward" },
  "Haleʻiwa": { lat: 21.5933, lng: -158.1039, region: "North Shore" },
  "Kāneʻohe": { lat: 21.4389, lng: -157.7623, region: "Windward" },
  "Pearl City": { lat: 21.3972, lng: -157.9736, region: "Leeward" },
  "Diamond Head": { lat: 21.2642, lng: -157.8073, region: "Town" },
  "Makaha": { lat: 21.4692, lng: -158.2208, region: "Leeward Coast" },
  "Koko Head": { lat: 21.2777, lng: -157.6877, region: "Southeast" }
} as const;

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes('rain') || lower.includes('shower')) return CloudRain;
  if (lower.includes('drizzle')) return CloudDrizzle;
  if (lower.includes('cloud')) return Cloud;
  return Sun;
};

export const WeatherHubCard: React.FC = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Honolulu');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'air-quality' | 'forecast'>('overview');

  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather();
  const { data: radarData, isLoading: radarLoading, error: radarError } = useRainRadar(selectedNeighborhood);

  const isLoading = weatherLoading || radarLoading;
  const error = weatherError || radarError;

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-[#8B2323]/10 flex items-center justify-center mx-auto mb-4">
          <CloudRain className="w-8 h-8 text-[#8B2323]" />
        </div>
        <p className="text-base font-medium text-primary">Weather Data Unavailable</p>
        <p className="text-sm text-muted mt-1">Unable to fetch weather information</p>
      </div>
    );
  }

  if (isLoading || !weather || !radarData) {
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

  const WeatherIcon = getWeatherIcon(weather.current.condition);
  
  const getCurrentCondition = () => {
    const precip = radarData.current.precipitation;
    if (precip === 0) return { text: 'Clear', color: 'text-[#10B981]', icon: '☀️' };
    if (precip < 0.1) return { text: 'Light Rain', color: 'text-[#3B82F6]', icon: '🌦️' };
    if (precip < 0.5) return { text: 'Moderate Rain', color: 'text-[#F59E0B]', icon: '🌧️' };
    return { text: 'Heavy Rain', color: 'text-[#EF4444]', icon: '⛈️' };
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getVogLevel = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: 'text-[#10B981]', bg: 'bg-[#10B981]/20', description: 'Air quality is satisfactory for most people.' };
    if (aqi <= 100) return { level: 'Moderate', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/20', description: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/20', description: 'Active children and adults, and people with respiratory disease should limit prolonged outdoor exertion.' };
    return { level: 'Unhealthy', color: 'text-[#8B2323]', bg: 'bg-[#8B2323]/20', description: 'Everyone may begin to experience health effects; sensitive groups may experience more serious health effects.' };
  };

  const condition = getCurrentCondition();
  const vogStatus = getVogLevel(radarData.vog.aqi);

  // Fixed helper function to properly round percentages
  const formatPercentage = (value: number): string => {
    return Math.round(Math.max(0, Math.min(100, value))).toString();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Location Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative animate-float">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]"></div>
              <WeatherIcon className="w-6 h-6 text-white relative z-10" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-h2 font-display text-emphasis-high">Weather Hub</h2>
            
            {/* Neighborhood Selector */}
            <div className="relative mt-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-small text-emphasis-medium hover:text-emphasis-high transition-colors group"
              >
                <MapPin className="w-3 h-3" />
                <span>{selectedNeighborhood}</span>
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
                        Object.entries(OAHU_NEIGHBORHOODS).reduce((acc, [name, info]) => {
                          if (!acc[info.region]) acc[info.region] = [];
                          acc[info.region].push(name);
                          return acc;
                        }, {} as Record<string, string[]>)
                      ).map(([region, neighborhoods]) => (
                        <div key={region}>
                          <div className="px-4 py-2 text-xs font-medium text-[#333333]/50 bg-[#F5FAF8]">
                            {region}
                          </div>
                          {neighborhoods.map((neighborhood) => (
                            <button
                              key={neighborhood}
                              onClick={() => {
                                setSelectedNeighborhood(neighborhood);
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2 text-sm hover:bg-[#F5FAF8] transition-colors",
                                selectedNeighborhood === neighborhood && "bg-[#EEE0C9]/30 text-[#214263] font-medium"
                              )}
                            >
                              {neighborhood}
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
          <p className="text-caption text-emphasis-low">Live Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-muted">Real-time</span>
          </div>
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
          ☀️ Current
        </button>
        <button
          onClick={() => setActiveTab('air-quality')}
          className={cn(
            "flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeTab === 'air-quality' 
              ? "bg-white text-[#214263] shadow-sm" 
              : "text-[#333333]/60 hover:text-[#333333]/80"
          )}
        >
          🌋 Air Quality
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={cn(
            "flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeTab === 'forecast' 
              ? "bg-white text-[#214263] shadow-sm" 
              : "text-[#333333]/60 hover:text-[#333333]/80"
          )}
        >
          📅 Forecast
        </button>
      </div>

      {/* Tab Content - flex-1 to take remaining space */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'overview' && (
          <div className="space-y-6 flex-1">
            {/* Current Conditions - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Temperature */}
              <div className="glass rounded-2xl p-4">
                <div className="text-center">
                  <span className="font-light gradient-text" style={{ fontSize: '36px' }}>{weather.current.temp}°</span>
                  <p className="text-body text-emphasis-high mt-1">{weather.current.condition}</p>
                  <p className="text-small text-emphasis-low">Feels like {weather.current.feelsLike}°F</p>
                </div>
              </div>

              {/* Precipitation */}
              <div className="glass rounded-2xl p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl">{condition.icon}</span>
                    <span className="font-light gradient-text" style={{ fontSize: '24px' }}>{radarData.current.precipitation}"</span>
                  </div>
                  <p className={cn("text-body font-medium", condition.color)}>{condition.text}</p>
                  <p className="text-small text-emphasis-low">per hour</p>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Droplets className="w-4 h-4 text-[#407B9E]" />
                  <p className="text-caption text-emphasis-low">Humidity</p>
                </div>
                <p className="text-body font-medium text-emphasis-high">{weather.current.humidity}%</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Wind className="w-4 h-4 text-[#407B9E]" />
                  <p className="text-caption text-emphasis-low">Wind</p>
                </div>
                <p className="text-body font-medium text-emphasis-high">
                  {radarData.current.windSpeed}mph {getWindDirection(radarData.current.windDirection)}
                </p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Eye className="w-4 h-4 text-[#407B9E]" />
                  <p className="text-caption text-emphasis-low">Visibility</p>
                </div>
                <p className="text-body font-medium text-emphasis-high">{radarData.current.visibility} mi</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-[#407B9E]" />
                  <p className="text-caption text-emphasis-low">UV Index</p>
                </div>
                <p className="text-body font-medium text-emphasis-high">{weather.current.uvIndex}</p>
              </div>
            </div>

            {/* Active Alerts */}
            {radarData.alerts.length > 0 && (
              <div className="space-y-3">
                {radarData.alerts.map((alert, idx) => (
                  <div key={idx} className={cn(
                    "rounded-xl p-4 border",
                    alert.severity === 'severe' ? 'bg-[#EF4444]/10 border-[#EF4444]/30' :
                    alert.severity === 'moderate' ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30' :
                    'bg-[#3B82F6]/10 border-[#3B82F6]/30'
                  )}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={cn(
                        "w-5 h-5 mt-0.5",
                        alert.severity === 'severe' ? 'text-[#EF4444]' :
                        alert.severity === 'moderate' ? 'text-[#F59E0B]' :
                        'text-[#3B82F6]'
                      )} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-primary">{alert.type}</h4>
                        <p className="text-xs text-muted mt-1">{alert.description}</p>
                        <p className="text-xs text-muted/70 mt-2">
                          Expires: {new Date(alert.expires).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'air-quality' && (
          <div className="space-y-6">
            {/* VOG Status */}
            <div className={cn("rounded-2xl p-6", vogStatus.bg)}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">Air Quality Index</h3>
                  <p className={cn("text-sm font-medium mt-1", vogStatus.color)}>{vogStatus.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light gradient-text">{radarData.vog.aqi}</p>
                  <p className="text-xs text-muted">AQI</p>
                </div>
              </div>
              <p className="text-sm text-muted">{vogStatus.description}</p>
            </div>

            {/* Volcano Status */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  radarData.vog.volcanoStatus === 'active' ? 'bg-[#EF4444]/20' :
                  radarData.vog.volcanoStatus === 'elevated' ? 'bg-[#F59E0B]/20' :
                  'bg-[#10B981]/20'
                )}>
                  <span className="text-lg">🌋</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-primary">Kilauea Status</h4>
                  <p className="text-xs text-muted capitalize">{radarData.vog.volcanoStatus}</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass rounded-2xl p-4">
              <h4 className="text-sm font-medium text-primary mb-3">Today's Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-muted">
                  <span>✓</span>
                  <span>{radarData.vog.recommendation}</span>
                </div>
                {vogStatus.level !== 'Good' && (
                  <>
                    <div className="flex items-center space-x-2 text-xs text-muted">
                      <span>✓</span>
                      <span>Keep windows closed during peak afternoon hours</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted">
                      <span>✓</span>
                      <span>Use air conditioning when possible</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-6">
            {/* 3-Day Forecast */}
            <div className="space-y-3">
              {weather.forecast.slice(0, 3).map((day, idx) => (
                <div key={idx} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-muted">{day.day}</p>
                        <p className="text-sm font-medium text-primary">{day.date}</p>
                      </div>
                      <div className="w-8 h-8">
                        <img 
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                          alt={day.condition}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-primary">{day.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{day.highTemp}°</p>
                      <p className="text-xs text-muted">{day.lowTemp}°</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 24-Hour Rain Forecast - Always visible at bottom */}
      <div className="mt-auto pt-6 border-t border-[rgba(0,0,0,0.06)]">
        <h4 className="text-sm font-medium text-secondary mb-3">24-Hour Rain Forecast</h4>
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {radarData.hourly.map((hour, idx) => (
            <div key={idx} className="flex-shrink-0 text-center">
              <p className="text-xs text-muted mb-1">{hour.time}</p>
              <div className="w-12 h-20 bg-gradient-to-t from-[#3B82F6]/20 to-transparent rounded-lg relative">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#3B82F6]/40 rounded-lg transition-all"
                  style={{ height: `${formatPercentage(hour.chanceOfRain)}%` }}
                />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-primary">
                  {formatPercentage(hour.chanceOfRain)}%
                </span>
              </div>
              <p className="text-xs text-muted mt-1">{Math.round(hour.temperature)}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};