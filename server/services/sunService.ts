import type { SunData } from '@shared/schema';

const HONOLULU_LAT = 21.3099;
const HONOLULU_LON = -157.8581;

export async function getSunData(): Promise<SunData> {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch sunrise/sunset data from sunrise-sunset.org API
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${HONOLULU_LAT}&lng=${HONOLULU_LON}&date=${today}&formatted=0`
    );

    if (!response.ok) {
      throw new Error(`Sunrise/Sunset API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error('Invalid response from sunrise/sunset API');
    }

    // Convert UTC times to local Hawaii time
    const convertToHawaii = (utcTimeStr: string) => {
      const date = new Date(utcTimeStr);
      return date.toLocaleTimeString('en-US', {
        timeZone: 'Pacific/Honolulu',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    // Calculate golden hour (1 hour before sunset, 1 hour after sunrise)
    const sunriseTime = new Date(data.results.sunrise);
    const sunsetTime = new Date(data.results.sunset);
    
    const goldenHourMorningEnd = new Date(sunriseTime.getTime() + 60 * 60 * 1000);
    const goldenHourEveningStart = new Date(sunsetTime.getTime() - 60 * 60 * 1000);
    
    // Calculate blue hour (30 min before sunrise, 30 min after sunset)
    const blueHourMorningStart = new Date(sunriseTime.getTime() - 30 * 60 * 1000);
    const blueHourEveningEnd = new Date(sunsetTime.getTime() + 30 * 60 * 1000);

    // Format day length
    const dayLengthSeconds = parseInt(data.results.day_length);
    const hours = Math.floor(dayLengthSeconds / 3600);
    const minutes = Math.floor((dayLengthSeconds % 3600) / 60);
    const dayLength = `${hours}h ${minutes}m`;

    const sunData: SunData = {
      sunrise: {
        time: data.results.sunrise,
        formatted: convertToHawaii(data.results.sunrise),
      },
      sunset: {
        time: data.results.sunset,
        formatted: convertToHawaii(data.results.sunset),
      },
      solarNoon: {
        time: data.results.solar_noon,
        formatted: convertToHawaii(data.results.solar_noon),
      },
      dayLength,
      goldenHour: {
        morning: `${convertToHawaii(data.results.sunrise)} - ${convertToHawaii(goldenHourMorningEnd.toISOString())}`,
        evening: `${convertToHawaii(goldenHourEveningStart.toISOString())} - ${convertToHawaii(data.results.sunset)}`,
      },
      blueHour: {
        morning: `${convertToHawaii(blueHourMorningStart.toISOString())} - ${convertToHawaii(data.results.sunrise)}`,
        evening: `${convertToHawaii(data.results.sunset)} - ${convertToHawaii(blueHourEveningEnd.toISOString())}`,
      },
      lastUpdated: new Date().toISOString(),
    };

    return sunData;
  } catch (error) {
    console.error('Error fetching sun data:', error);
    
    // Return fallback data
    const now = new Date();
    return {
      sunrise: {
        time: now.toISOString(),
        formatted: '6:45 AM',
      },
      sunset: {
        time: now.toISOString(),
        formatted: '6:30 PM',
      },
      solarNoon: {
        time: now.toISOString(),
        formatted: '12:37 PM',
      },
      dayLength: '11h 45m',
      goldenHour: {
        morning: '6:45 AM - 7:45 AM',
        evening: '5:30 PM - 6:30 PM',
      },
      blueHour: {
        morning: '6:15 AM - 6:45 AM',
        evening: '6:30 PM - 7:00 PM',
      },
      lastUpdated: now.toISOString(),
    };
  }
}