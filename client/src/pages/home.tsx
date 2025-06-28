import React, { useState, useEffect } from 'react';
import { Waves, RefreshCw, WifiOff, Palmtree } from 'lucide-react';
import { WeatherCard } from '../components/WeatherCard';
import SurfCard from '@/components/cards/SurfCard';
import { TideCard } from '../components/TideCard';
import { MoviesCard } from '../components/MoviesCard';
import { EventsCard } from '../components/EventsCard';
import { mutate } from 'swr';
import { useToast } from '../hooks/use-toast';

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const updateLastUpdated = () => {
      const now = new Date();
      const timeAgo = Math.floor((Date.now() - now.getTime()) / 60000);
      setLastUpdated(timeAgo === 0 ? 'Just now' : `${timeAgo} min ago`);
    };

    updateLastUpdated();
    const interval = setInterval(updateLastUpdated, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "Data will be refreshed automatically",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Showing cached data from your last visit",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        mutate('/api/weather'),
        mutate('/api/tides'),
        mutate('/api/movies'),
        mutate('/api/events'),
        mutate('/api/surf?lat=21.276&lng=-157.822'),
      ]);
      setLastUpdated('Just now');
      toast({
        title: "Refreshed",
        description: "All data has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Unable to update some data sources",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Decorative wave patterns */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 opacity-5">
          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="currentColor" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="site-header sticky top-0 border-b border-white/10" style={{ zIndex: 'var(--z-header)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#214263] to-[#407B9E] opacity-90"></div>
                  <Waves className="w-6 h-6 text-white relative z-10 animate-wave" />
                </div>
              </div>
              <div>
                <h1 className="text-h1 font-display gradient-text">Kamaʻāina Compass</h1>
                <p className="text-small text-secondary">Real-time island rhythms</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-small text-secondary hidden sm:inline">
                Updated {lastUpdated}
              </span>
              <button 
                className="tropical-button p-3 !px-4"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-5 h-5 relative z-10 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="tropical-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <WeatherCard />
          </div>
          <div className="tropical-card p-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <SurfCard />
          </div>
          <div className="tropical-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <TideCard />
          </div>
          <div className="tropical-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <MoviesCard />
          </div>
          <div className="tropical-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <EventsCard />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#214263]/10 to-transparent blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-br from-[#435443]/10 to-transparent blur-3xl"></div>
      </main>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto tropical-card p-4 flex items-center space-x-3 animate-slide-up">
          <div className="w-10 h-10 rounded-full bg-[#8B2323]/20 flex items-center justify-center">
            <WifiOff className="w-5 h-5 text-[#8B2323]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#EADDCA]">You're offline</p>
            <p className="text-xs text-[#EADDCA]/70">Showing cached data from your last visit</p>
          </div>
        </div>
      )}
    </div>
  );
}