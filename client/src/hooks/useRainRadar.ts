import useSWR from 'swr';

export interface RainRadarData {
  current: {
    precipitation: number; // inches per hour
    visibility: number; // miles
    windSpeed: number; // mph
    windDirection: number; // degrees
    condition: string;
    lastUpdated: string;
  };
  hourly: Array<{
    time: string;
    precipitation: number;
    chanceOfRain: number; // percentage
    temperature: number;
  }>;
  alerts: Array<{
    type: string;
    description: string;
    expires: string;
    severity: 'minor' | 'moderate' | 'severe';
  }>;
  vog: {
    aqi: number;
    level: string;
    recommendation: string;
    volcanoStatus: 'quiet' | 'elevated' | 'active';
  };
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export const useRainRadar = (neighborhood: string = 'Honolulu') => {
  return useSWR<RainRadarData>(
    `/api/rain-radar?location=${encodeURIComponent(neighborhood)}`,
    {
      refreshInterval: 300000, // Update every 5 minutes
      revalidateOnFocus: true,
      dedupingInterval: 60000,
      fallbackData: {
        current: {
          precipitation: 0,
          visibility: 10,
          windSpeed: 12,
          windDirection: 60,
          condition: 'Clear',
          lastUpdated: new Date().toISOString()
        },
        hourly: [
          { time: '12PM', precipitation: 0, chanceOfRain: 10, temperature: 78 },
          { time: '1PM', precipitation: 0.02, chanceOfRain: 25, temperature: 79 },
          { time: '2PM', precipitation: 0.1, chanceOfRain: 45, temperature: 80 },
          { time: '3PM', precipitation: 0.05, chanceOfRain: 30, temperature: 81 },
          { time: '4PM', precipitation: 0, chanceOfRain: 15, temperature: 80 },
          { time: '5PM', precipitation: 0, chanceOfRain: 5, temperature: 79 }
        ],
        alerts: [
          {
            type: 'Flash Flood Watch',
            description: 'Heavy rainfall possible in windward and mauka areas through this evening.',
            expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            severity: 'moderate' as const
          }
        ],
        vog: {
          aqi: 45,
          level: 'Good',
          recommendation: 'Air quality is satisfactory for most people.',
          volcanoStatus: 'quiet' as const
        },
        location: {
          name: neighborhood,
          coordinates: { lat: 21.3099, lng: -157.8581 }
        }
      }
    }
  );
};