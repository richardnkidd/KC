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
      fallbackData: generateFallbackData(neighborhood)
    }
  );
};

function generateFallbackData(neighborhood: string): RainRadarData {
  // Simulate different conditions based on neighborhood
  const isWindward = ['Kailua', 'Kāneʻohe', 'Castles'].includes(neighborhood);
  const isNorthShore = ['Haleʻiwa'].includes(neighborhood);
  const basePrecip = isWindward ? 0.05 : isNorthShore ? 0.02 : 0;
  
  // Helper function to ensure clean percentage values - much more robust
  const cleanPercentage = (value: number): number => {
    // First ensure the value is within bounds
    const bounded = Math.max(0, Math.min(100, value));
    // Then round to nearest integer to avoid floating point precision issues
    return Math.round(bounded);
  };
  
  // Helper function to generate realistic rain chances
  const generateRainChance = (baseChance: number, hourOffset: number): number => {
    // Create more realistic rain patterns
    const timeOfDay = (new Date().getHours() + hourOffset) % 24;
    let modifier = 1;
    
    // Afternoon rain is more common in Hawaii
    if (timeOfDay >= 14 && timeOfDay <= 18) {
      modifier = 1.4;
    }
    // Early morning is usually drier
    else if (timeOfDay >= 5 && timeOfDay <= 9) {
      modifier = 0.7;
    }
    // Evening and night moderate chances
    else {
      modifier = 1;
    }
    
    // Add some random variation but keep it reasonable
    const randomVariation = (Math.random() - 0.5) * 15; // ±7.5% variation
    const result = (baseChance * modifier) + randomVariation;
    
    return cleanPercentage(result);
  };
  
  return {
    current: {
      precipitation: Math.round(basePrecip * 100) / 100, // Round to 2 decimal places
      visibility: isWindward ? 8 : 10,
      windSpeed: isWindward ? 18 : 12,
      windDirection: isWindward ? 70 : 60, // ENE for windward, NE for others
      condition: basePrecip > 0 ? 'Light Rain' : 'Partly Cloudy',
      lastUpdated: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const baseChance = isWindward ? 25 : isNorthShore ? 15 : 10;
      
      return {
        time: new Date(Date.now() + i * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric',
          hour12: true 
        }),
        precipitation: Math.round((basePrecip + (Math.random() - 0.5) * 0.1) * 100) / 100,
        chanceOfRain: generateRainChance(baseChance, i),
        temperature: Math.round((76 + Math.random() * 8) * 10) / 10
      };
    }),
    alerts: generateAlerts(isWindward, isNorthShore),
    vog: {
      aqi: Math.round(35 + Math.random() * 30), // Round AQI to whole number
      level: 'Good',
      recommendation: 'Air quality is satisfactory for most people.',
      volcanoStatus: Math.random() > 0.8 ? 'elevated' : 'quiet'
    },
    location: {
      name: neighborhood,
      coordinates: getNeighborhoodCoords(neighborhood)
    }
  };
}

function generateAlerts(isWindward: boolean, isNorthShore: boolean): RainRadarData['alerts'] {
  const alerts: RainRadarData['alerts'] = [];
  
  if (isWindward && Math.random() > 0.6) {
    alerts.push({
      type: 'Flash Flood Watch',
      description: 'Heavy rainfall possible in windward and mauka areas through this evening.',
      expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      severity: 'moderate'
    });
  }
  
  if (isNorthShore && Math.random() > 0.7) {
    alerts.push({
      type: 'High Surf Advisory',
      description: 'North and west facing shores may experience dangerous surf conditions.',
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      severity: 'moderate'
    });
  }
  
  return alerts;
}

function getNeighborhoodCoords(neighborhood: string): { lat: number; lng: number } {
  const coords: Record<string, { lat: number; lng: number }> = {
    "Honolulu": { lat: 21.3099, lng: -157.8581 },
    "Waikīkī": { lat: 21.2793, lng: -157.8293 },
    "Mānoa": { lat: 21.3157, lng: -157.8025 },
    "Kailua": { lat: 21.4022, lng: -157.7394 },
    "Haleʻiwa": { lat: 21.5933, lng: -158.1039 },
    "Kāneʻohe": { lat: 21.4389, lng: -157.7623 },
    "Pearl City": { lat: 21.3972, lng: -157.9736 },
    "Diamond Head": { lat: 21.2642, lng: -157.8073 },
    "Makaha": { lat: 21.4692, lng: -158.2208 },
    "Koko Head": { lat: 21.2777, lng: -157.6877 }
  };
  
  return coords[neighborhood] || coords["Honolulu"];
}