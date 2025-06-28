import React, { useState } from 'react';
import { Car, AlertTriangle, Clock, ChevronDown, Construction, Navigation } from 'lucide-react';
import { useTraffic } from '../hooks/useTraffic';
import { cn } from '@/lib/utils';

export const TrafficCard: React.FC = () => {
  const { data: traffic, isLoading, error } = useTraffic();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-[#8B2323]/10 flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-[#8B2323]" />
        </div>
        <p className="text-base font-medium text-primary">Traffic Unavailable</p>
        <p className="text-sm text-muted mt-1">Unable to fetch traffic data</p>
      </div>
    );
  }

  if (isLoading || !traffic) {
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
        </div>
      </div>
    );
  }

  const selectedRouteData = selectedRoute 
    ? traffic.routes.find(r => r.name === selectedRoute)
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'heavy': return 'text-orange-600';
      case 'severe': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-500/20 text-green-700';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-700';
      case 'heavy': return 'bg-orange-500/20 text-orange-700';
      case 'severe': return 'bg-red-500/20 text-red-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative animate-float">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626] to-[#F59E0B]"></div>
              <Car className="w-6 h-6 text-white relative z-10" />
            </div>
          </div>
          <div>
            <h2 className="text-h2 font-display text-emphasis-high">Traffic</h2>
            <p className="text-small text-emphasis-medium">Live commute times</p>
          </div>
        </div>
        {traffic.zipperLane.active && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs text-blue-700 font-medium">Zipper Lane Active</span>
          </div>
        )}
      </div>

      {/* Route Selector */}
      <div className="mb-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 p-4 glass rounded-2xl hover:bg-[rgb(var(--tropical-stone)/0.2)] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-[#407B9E]" />
              <span className="text-body font-medium text-primary">
                {selectedRoute || 'Select a route'}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-5 h-5 text-[#407B9E] transition-transform",
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
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-[rgba(0,0,0,0.06)] overflow-hidden z-50">
                <div className="max-h-64 overflow-y-auto">
                  {traffic.routes.map((route) => (
                    <button
                      key={route.name}
                      onClick={() => {
                        setSelectedRoute(route.name);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-[#F5FAF8] transition-colors flex items-center justify-between",
                        selectedRoute === route.name && "bg-[#EEE0C9]/30"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium text-primary">{route.name}</p>
                        <p className="text-xs text-muted">{route.from} → {route.to}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-sm font-medium", getStatusColor(route.status))}>
                          {formatTime(route.currentTime)}
                        </p>
                        {route.delay > 0 && (
                          <p className="text-xs text-muted">+{route.delay} min</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Route Details */}
      {selectedRouteData && (
        <div className="space-y-4 mb-6">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-primary">Current Conditions</h3>
              <span className={cn(
                "px-3 py-1 text-xs font-medium rounded-full",
                getStatusBg(selectedRouteData.status)
              )}>
                {selectedRouteData.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-caption text-emphasis-low mb-1">Current</p>
                <p className={cn("text-xl font-light", getStatusColor(selectedRouteData.status))}>
                  {formatTime(selectedRouteData.currentTime)}
                </p>
              </div>
              <div>
                <p className="text-caption text-emphasis-low mb-1">Normal</p>
                <p className="text-xl font-light text-primary">
                  {formatTime(selectedRouteData.normalTime)}
                </p>
              </div>
              <div>
                <p className="text-caption text-emphasis-low mb-1">Delay</p>
                <p className="text-xl font-light text-orange-600">
                  {selectedRouteData.delay > 0 ? `+${selectedRouteData.delay}` : '0'} min
                </p>
              </div>
            </div>
          </div>

          {/* Incidents */}
          {selectedRouteData.incidents.length > 0 && (
            <div className="space-y-2">
              {selectedRouteData.incidents.map((incident, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 glass rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary capitalize">{incident.type}</p>
                    <p className="text-xs text-muted">{incident.description}</p>
                    <p className="text-xs text-muted mt-1">{incident.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* General Alerts */}
      {traffic.alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-secondary mb-2">Traffic Alerts</h3>
          {traffic.alerts.map((alert, index) => (
            <div key={index} className={cn(
              "p-3 rounded-xl flex items-start space-x-3",
              alert.type === 'closure' ? 'bg-red-500/10' : 
              alert.type === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
            )}>
              {alert.type === 'closure' ? (
                <Construction className="w-5 h-5 text-red-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">{alert.title}</p>
                <p className="text-xs text-muted mt-1">{alert.description}</p>
                <p className="text-xs text-muted mt-1">
                  Affects: {alert.roads.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[rgb(var(--tropical-sage)/0.2)]">
        <p className="text-xs text-muted flex items-center">
          <Clock className="w-3 h-3 mr-2" />
          Updates every minute • Traffic estimates
        </p>
      </div>
    </div>
  );
};