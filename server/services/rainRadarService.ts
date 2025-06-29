import type { RainRadarData } from '@/hooks/useRainRadar';

// O'ahu neighborhood coordinates
const OAHU_NEIGHBORHOODS: Record<string, { lat: number; lng: number }> = {
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

// Simulate micro-climate variations
function getMicroClimateData(neighborhood: string) {
  const variations: Record<string, { precipMultiplier: number; windMultiplier: number }> = {
    "Mānoa": { precipMultiplier: 2.5, windMultiplier: 0.6 }, // Valley, more rain, less wind
    "Kailua": { precipMultiplier: 1.2, windMultiplier: 1.4 }, // Windward, moderate rain, strong trades
    "Kāneʻohe": { precipMultiplier: 1.5, windMultiplier: 1.3 }, // Windward
    "Haleʻiwa": { precipMultiplier: 0.8, windMultiplier: 1.2 }, // North Shore, less rain
    "Pearl City": { precipMultiplier: 0.7, windMultiplier: 0.8 }, // Leeward, drier
    "Makaha": { precipMultiplier: 0.5, windMultiplier: 0.9 }, // Leeward coast, very dry
    "Waikīkī": { precipMultiplier: 0.6, windMultiplier: 1.0 }, // Town, protected
    "Diamond Head": { precipMultiplier: 0.6, windMultiplier: 1.1 }, // Town, slightly windier
    "Koko Head": { precipMultiplier: 0.4, windMultiplier: 1.3 }, // SE, dry and windy
    "Honolulu": { precipMultiplier: 1.0, windMultiplier: 1.0 } // Baseline
  };
  
  return variations[neighborhood] || variations["Honolulu"];
}

// Generate realistic VOG data based on trade wind conditions
function getVogData(windSpeed: number, windDirection: number) {
  const isKonaWind = windDirection > 180 && windDirection < 360; // South/West winds
  const baseAQI = isKonaWind ? 60 : 35;
  const windFactor = windSpeed > 15 ? 0.7 : 1.0; // Strong winds disperse VOG
  
  const aqi = Math.round(baseAQI * windFactor + Math.random() * 20);
  
  let level, recommendation, volcanoStatus;
  
  if (aqi <= 50) {
    level = 'Good';
    recommendation = 'Air quality is satisfactory for most people.';
    volcanoStatus = 'quiet' as const;
  } else if (aqi <= 100) {
    level = 'Moderate';
    recommendation = 'Unusually sensitive people should consider limiting prolonged outdoor exertion.';
    volcanoStatus = 'elevated' as const;
  } else if (aqi <= 150) {
    level = 'Unhealthy for Sensitive Groups';
    recommendation = 'People with respiratory or heart conditions, children and older adults should limit prolonged outdoor exertion.';
    volcanoStatus = 'active' as const;
  } else {
    level = 'Unhealthy';
    recommendation = 'Everyone should limit prolonged outdoor exertion.';
    volcanoStatus = 'active' as const;
  }
  
  return { aqi, level, recommendation, volcanoStatus };
}

export async function getRainRadarData(location: string = 'Honolulu'): Promise<RainRadarData> {
  try {
    const coords = OAHU_NEIGHBORHOODS[location] || OAHU_NEIGHBORHOODS['Honolulu'];
    const microClimate = getMicroClimateData(location);
    
    // Use OpenWeatherMap API key if available
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (apiKey) {
      try {
        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`
        );
        
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          
          // Fetch forecast for hourly data
          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`
          );
          
          const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;
          
          // Process real data with micro-climate adjustments
          const precipitation = (weatherData.rain?.['1h'] || 0) * microClimate.precipMultiplier;
          const windSpeed = weatherData.wind.speed * microClimate.windMultiplier;
          const windDirection = weatherData.wind.deg;
          
          const vogData = getVogData(windSpeed, windDirection);
          
          // Generate alerts based on conditions
          const alerts = [];
          if (precipitation > 0.5) {
            alerts.push({
              type: 'Heavy Rain Warning',
              description: `Heavy rainfall detected in ${location}. Drive with caution and watch for flooding.`,
              expires: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
              severity: 'moderate' as const
            });
          }
          
          if (windSpeed > 25) {
            alerts.push({
              type: 'High Wind Advisory',
              description: `Strong trade winds affecting ${location}. Secure loose objects and use caution while driving.`,
              expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
              severity: 'minor' as const
            });
          }
          
          return {
            current: {
              precipitation: Math.round(precipitation * 100) / 100,
              visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1609.34) : 10, // meters to miles
              windSpeed: Math.round(windSpeed),
              windDirection,
              condition: weatherData.weather[0].main,
              lastUpdated: new Date().toISOString()
            },
            hourly: forecastData?.list?.slice(0, 6).map((item: any, index: number) => ({
              time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
              }),
              precipitation: Math.round((item.rain?.['3h'] || 0) * microClimate.precipMultiplier * 100) / 100,
              chanceOfRain: item.pop * 100,
              temperature: Math.round(item.main.temp)
            })) || generateFallbackHourly(microClimate),
            alerts,
            vog: vogData,
            location: {
              name: location,
              coordinates: coords
            }
          };
        }
      } catch (error) {
        console.error('Error fetching rain radar data:', error);
      }
    }
    
    // Fallback data generation
    return generateFallbackData(location, coords, microClimate);
    
  } catch (error) {
    console.error('Error in rain radar service:', error);
    return generateFallbackData(location, OAHU_NEIGHBORHOODS['Honolulu'], { precipMultiplier: 1, windMultiplier: 1 });
  }
}

function generateFallbackHourly(microClimate: { precipMultiplier: number }) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const baseChance = Math.random() * 50;
    const precipChance = Math.min(95, baseChance * microClimate.precipMultiplier);
    
    return {
      time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      precipitation: precipChance > 30 ? Math.random() * 0.3 * microClimate.precipMultiplier : 0,
      chanceOfRain: Math.round(precipChance),
      temperature: 78 + Math.round(Math.random() * 6)
    };
  });
}

function generateFallbackData(
  location: string, 
  coords: { lat: number; lng: number },
  microClimate: { precipMultiplier: number; windMultiplier: number }
): RainRadarData {
  const hour = new Date().getHours();
  const isAfternoon = hour >= 12 && hour <= 18;
  
  // Afternoon showers are common in Hawaii
  const basePrecip = isAfternoon ? 0.1 : 0.02;
  const precipitation = basePrecip * microClimate.precipMultiplier;
  
  const windSpeed = 12 * microClimate.windMultiplier;
  const windDirection = 60; // ENE trades
  
  const alerts = [];
  if (precipitation > 0.2) {
    alerts.push({
      type: 'Scattered Showers',
      description: `Typical afternoon showers expected in ${location} area. Brief heavy downpours possible.`,
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      severity: 'minor' as const
    });
  }
  
  return {
    current: {
      precipitation: Math.round(precipitation * 100) / 100,
      visibility: 10,
      windSpeed: Math.round(windSpeed),
      windDirection,
      condition: precipitation > 0.05 ? 'Light Rain' : 'Partly Cloudy',
      lastUpdated: new Date().toISOString()
    },
    hourly: generateFallbackHourly(microClimate),
    alerts,
    vog: getVogData(windSpeed, windDirection),
    location: {
      name: location,
      coordinates: coords
    }
  };
}