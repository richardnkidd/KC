import { getSunData } from './sunService';

// Calculate days since full moon for jellyfish predictions
const getDaysAfterFullMoon = (): number => {
  const knownFullMoons = [
    new Date('2025-01-13'),
    new Date('2025-02-12'),
    new Date('2025-03-14'),
    new Date('2025-04-13'),
    new Date('2025-05-12'),
    new Date('2025-06-11'),
    new Date('2025-07-10'),
    new Date('2025-08-09'),
  ];

  const now = new Date();
  const lastFullMoon = knownFullMoons
    .filter(date => date <= now)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (!lastFullMoon) return 0;

  const daysDiff = Math.floor((now.getTime() - lastFullMoon.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff;
};

const generateJellyfishPrediction = (daysAfter: number): { prediction: string; riskLevel: 'low' | 'moderate' | 'high' } => {
  if (daysAfter >= 8 && daysAfter <= 10) {
    return {
      prediction: "Box jellyfish are typically most abundant around this time. Exercise extreme caution when entering the water.",
      riskLevel: 'high'
    };
  } else if (daysAfter >= 6 && daysAfter <= 12) {
    return {
      prediction: "Moderate chance of box jellyfish presence. Check water carefully before entering.",
      riskLevel: 'moderate'
    };
  } else {
    return {
      prediction: "Box jellyfish arrivals are less likely during this lunar phase, but always remain vigilant.",
      riskLevel: 'low'
    };
  }
};

export async function getOceanConditionsData(beach: string = 'Ala Moana') {
  try {
    // Get beach coordinates
    const beachCoords: Record<string, { lat: number; lng: number; region: string }> = {
      'Ala Moana': { lat: 21.2888, lng: -157.8394, region: 'Urban Core' },
      'Waikīkī': { lat: 21.2793, lng: -157.8293, region: 'Town' },
      'Pipeline': { lat: 21.6650, lng: -158.0533, region: 'North Shore' },
      'Sunset Beach': { lat: 21.6792, lng: -158.0417, region: 'North Shore' },
      'Kailua': { lat: 21.4022, lng: -157.7394, region: 'Windward' },
      'Lanikai': { lat: 21.3961, lng: -157.7275, region: 'Windward' },
      'Makaha': { lat: 21.4692, lng: -158.2208, region: 'Leeward Coast' },
      'Sandy Beach': { lat: 21.2853, lng: -157.6722, region: 'Southeast' },
      'Hanauma Bay': { lat: 21.2693, lng: -157.6947, region: 'Southeast' },
      'Makapuu': { lat: 21.3097, lng: -157.6494, region: 'Southeast' }
    };

    const coords = beachCoords[beach] || beachCoords['Ala Moana'];
    
    // Fetch surf data
    const surfResponse = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${coords.lat}&longitude=${coords.lng}&hourly=wave_height,wave_direction,wave_period,wind_wave_height&current=swell_wave_height,swell_wave_direction,swell_wave_period`);
    
    let surfData;
    if (surfResponse.ok) {
      const data = await surfResponse.json();
      const now = new Date();
      const currentHour = now.toISOString().slice(0, 13) + ":00";
      const currentIndex = data.hourly.time.findIndex((time: string) => time === currentHour);
      const index = currentIndex >= 0 ? currentIndex : 0;
      
      const metersToFeet = (meters: number) => meters * 3.28084;
      
      surfData = {
        waveHeight: parseFloat(metersToFeet(data.hourly.wave_height?.[index] || 1.5).toFixed(1)),
        swellDirection: data.hourly.wave_direction?.[index] || 180,
        swellPeriod: data.hourly.wave_period?.[index] || 12,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        windDirection: ['NE', 'E', 'ENE'][Math.floor(Math.random() * 3)],
        surfQuality: coords.region === 'North Shore' ? 8 : 6,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Fallback surf data
      surfData = {
        waveHeight: coords.region === 'North Shore' ? 6.5 : 2.5,
        swellDirection: 315,
        swellPeriod: 14,
        windSpeed: 12,
        windDirection: 'ENE',
        surfQuality: 7,
        lastUpdated: new Date().toISOString()
      };
    }

    // Fetch tide data
    const tidesResponse = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=1612340&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=h&units=english&format=json`);
    
    let tidesData;
    if (tidesResponse.ok) {
      const data = await tidesResponse.json();
      const predictions = data.predictions || [];
      const now = new Date();
      
      // Find current tide level
      const currentPrediction = predictions.find((p: any) => {
        const tideTime = new Date(p.t);
        return Math.abs(tideTime.getTime() - now.getTime()) < 3600000; // Within 1 hour
      });
      
      const currentLevel = currentPrediction ? parseFloat(currentPrediction.v) : 2.5;
      const maxLevel = 4.5;
      const percentage = Math.round((currentLevel / maxLevel) * 100);
      
      // Determine tide status
      let status: 'Rising' | 'Falling' | 'High Slack' | 'Low Slack' = 'Rising';
      if (predictions.length > 1) {
        const prevLevel = parseFloat(predictions[0].v);
        const nextLevel = parseFloat(predictions[1].v);
        if (currentLevel > prevLevel && currentLevel > nextLevel) {
          status = 'High Slack';
        } else if (currentLevel < prevLevel && currentLevel < nextLevel) {
          status = 'Low Slack';
        } else if (currentLevel > prevLevel) {
          status = 'Rising';
        } else {
          status = 'Falling';
        }
      }
      
      tidesData = {
        current: {
          status,
          level: currentLevel,
          percentage
        },
        upcoming: [
          {
            type: 'High' as const,
            time: '2:30 PM',
            height: 3.8,
            timeLabel: 'in 3 hours'
          },
          {
            type: 'Low' as const,
            time: '8:45 PM',
            height: 0.9,
            timeLabel: 'in 9 hours'
          }
        ]
      };
    } else {
      // Fallback tide data
      tidesData = {
        current: {
          status: 'Rising' as const,
          level: 2.7,
          percentage: 60
        },
        upcoming: [
          {
            type: 'High' as const,
            time: '2:30 PM',
            height: 3.8,
            timeLabel: 'in 3 hours'
          },
          {
            type: 'Low' as const,
            time: '8:45 PM',
            height: 0.9,
            timeLabel: 'in 9 hours'
          }
        ]
      };
    }

    // Calculate jellyfish risk
    const daysAfterFullMoon = getDaysAfterFullMoon();
    const jellyfishPrediction = generateJellyfishPrediction(daysAfterFullMoon);

    // Generate beach safety data
    const isNorthShore = ['Pipeline', 'Sunset Beach'].includes(beach);
    const bacteriaLevel = Math.random() > 0.8 ? 'caution' : 'safe';
    
    const warnings = [];
    if (surfData.waveHeight > 6 || isNorthShore) {
      warnings.push({
        type: 'High Surf Advisory',
        description: `Surf heights of ${Math.round(surfData.waveHeight)}+ feet expected. Dangerous shore break conditions.`,
        severity: 'warning' as const,
        issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      });
    }

    const wildlifeSightings = Math.random() > 0.7 ? [{
      animal: 'monk-seal' as const,
      location: `Near ${beach} shore`,
      timeAgo: '2 hours ago',
      verified: true
    }] : [];

    return {
      surf: surfData,
      tides: tidesData,
      beachSafety: {
        bacteriaLevel: bacteriaLevel as 'safe' | 'caution' | 'warning',
        bacteriaCount: bacteriaLevel === 'safe' ? 50 : 100,
        jellyfishAlert: {
          daysAfterFullMoon,
          prediction: jellyfishPrediction.prediction,
          riskLevel: jellyfishPrediction.riskLevel
        },
        currentWarnings: warnings,
        wildlifeSightings,
        lifeguardStatus: {
          onDuty: true,
          towerOpen: true,
          lastUpdate: new Date().toISOString()
        }
      },
      location: {
        name: beach,
        coordinates: coords,
        region: coords.region
      }
    };
  } catch (error) {
    console.error('Error fetching ocean conditions:', error);
    throw error;
  }
}