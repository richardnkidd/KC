import type { TrafficData } from '@shared/schema';

// Common O'ahu routes with typical times
const ROUTES = [
  // H-1 Routes
  { 
    id: 'pearl-downtown',
    name: 'H-1 Pearl City → Downtown',
    from: 'Pearl City',
    to: 'Downtown Honolulu',
    normalMinutes: 25,
    highway: 'H-1'
  },
  {
    id: 'kapolei-waikiki',
    name: 'H-1 Kapolei → Waikiki',
    from: 'Kapolei',
    to: 'Waikiki',
    normalMinutes: 35,
    highway: 'H-1'
  },
  {
    id: 'hawaii-kai-downtown',
    name: 'H-1 Hawaii Kai → Downtown',
    from: 'Hawaii Kai',
    to: 'Downtown Honolulu',
    normalMinutes: 30,
    highway: 'H-1'
  },
  // H-2 Routes
  {
    id: 'mililani-downtown',
    name: 'H-2/H-1 Mililani → Downtown',
    from: 'Mililani',
    to: 'Downtown Honolulu',
    normalMinutes: 30,
    highway: 'H-2'
  },
  {
    id: 'wahiawa-pearl',
    name: 'H-2 Wahiawa → Pearl Harbor',
    from: 'Wahiawa',
    to: 'Pearl Harbor',
    normalMinutes: 20,
    highway: 'H-2'
  },
  // H-3 Routes
  {
    id: 'kaneohe-downtown',
    name: 'H-3/H-1 Kaneohe → Downtown',
    from: 'Kaneohe',
    to: 'Downtown Honolulu',
    normalMinutes: 25,
    highway: 'H-3'
  },
  {
    id: 'kailua-airport',
    name: 'H-3/H-1 Kailua → Airport',
    from: 'Kailua',
    to: 'Honolulu Airport',
    normalMinutes: 22,
    highway: 'H-3'
  },
  // Pali Highway
  {
    id: 'kailua-downtown-pali',
    name: 'Pali Hwy Kailua → Downtown',
    from: 'Kailua',
    to: 'Downtown Honolulu',
    normalMinutes: 20,
    highway: 'Pali'
  },
  // Likelike Highway
  {
    id: 'kaneohe-downtown-likelike',
    name: 'Likelike Kaneohe → Downtown',
    from: 'Kaneohe',
    to: 'Downtown Honolulu',
    normalMinutes: 18,
    highway: 'Likelike'
  },
  // Kalanianaole Highway
  {
    id: 'waimanalo-hawaii-kai',
    name: 'Kalanianaole Waimanalo → Hawaii Kai',
    from: 'Waimanalo',
    to: 'Hawaii Kai',
    normalMinutes: 15,
    highway: 'Kalanianaole'
  },
  // North Shore
  {
    id: 'haleiwa-wahiawa',
    name: 'Kam Hwy Haleiwa → Wahiawa',
    from: 'Haleiwa',
    to: 'Wahiawa',
    normalMinutes: 25,
    highway: 'Kamehameha'
  },
  // West Side
  {
    id: 'makaha-kapolei',
    name: 'Farrington Makaha → Kapolei',
    from: 'Makaha',
    to: 'Kapolei',
    normalMinutes: 30,
    highway: 'Farrington'
  },
];

// Simulate traffic conditions based on time of day
function getTrafficMultiplier(hour: number, isWeekday: boolean): number {
  if (!isWeekday) {
    // Weekend traffic is generally lighter
    if (hour >= 10 && hour <= 16) return 1.2; // Midday beach traffic
    return 1.0;
  }

  // Weekday rush hours
  if ((hour >= 6 && hour <= 9) || (hour >= 15 && hour <= 18)) {
    return 1.8 + Math.random() * 0.4; // 1.8x to 2.2x normal time
  }
  
  // Midday
  if (hour >= 10 && hour <= 14) {
    return 1.1 + Math.random() * 0.2;
  }
  
  // Evening/Night
  return 1.0;
}

function getTrafficStatus(delayPercent: number): 'clear' | 'moderate' | 'heavy' | 'severe' {
  if (delayPercent < 10) return 'clear';
  if (delayPercent < 30) return 'moderate';
  if (delayPercent < 60) return 'heavy';
  return 'severe';
}

export async function getTrafficData(): Promise<TrafficData> {
  try {
    const now = new Date();
    const hawaiiTime = new Date(now.toLocaleString("en-US", {timeZone: "Pacific/Honolulu"}));
    const hour = hawaiiTime.getHours();
    const dayOfWeek = hawaiiTime.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    
    // Check if zipper lane is active (weekday mornings)
    const zipperLaneActive = isWeekday && hour >= 5 && hour <= 9;
    
    // Generate current traffic conditions
    const routes = ROUTES.map(route => {
      const multiplier = getTrafficMultiplier(hour, isWeekday);
      const currentTime = Math.round(route.normalMinutes * multiplier);
      const delay = currentTime - route.normalMinutes;
      const delayPercent = (delay / route.normalMinutes) * 100;
      
      // Random chance of incidents during heavy traffic
      const incidents = [];
      if (multiplier > 1.5 && Math.random() > 0.7) {
        incidents.push({
          type: 'accident' as const,
          description: 'Multi-vehicle accident',
          location: `Near ${route.from} on-ramp`
        });
      }
      
      return {
        name: route.name,
        from: route.from,
        to: route.to,
        normalTime: route.normalMinutes,
        currentTime,
        delay,
        status: getTrafficStatus(delayPercent),
        incidents
      };
    });

    // Generate alerts based on conditions
    const alerts = [];
    
    if (hour >= 6 && hour <= 9 && isWeekday) {
      alerts.push({
        type: 'warning' as const,
        title: 'Morning Rush Hour',
        description: 'Heavy traffic on all major highways. Allow extra time.',
        roads: ['H-1', 'H-2', 'H-3', 'Pali Highway', 'Likelike Highway']
      });
    }
    
    if (dayOfWeek === 0 && hour >= 10 && hour <= 14) {
      alerts.push({
        type: 'info' as const,
        title: 'Beach Traffic',
        description: 'Increased traffic to North Shore and East Side beaches.',
        roads: ['Kamehameha Highway', 'Kalanianaole Highway']
      });
    }
    
    // Random construction
    if (Math.random() > 0.8) {
      alerts.push({
        type: 'closure' as const,
        title: 'Lane Closure',
        description: 'Right lane closed for construction work.',
        roads: ['H-1 Eastbound near Ward Ave']
      });
    }

    const trafficData: TrafficData = {
      routes,
      alerts,
      zipperLane: {
        active: zipperLaneActive,
        direction: 'Honolulu-bound',
        hours: '5:30 AM - 9:00 AM weekdays'
      },
      lastUpdated: new Date().toISOString()
    };

    return trafficData;
  } catch (error) {
    console.error('Error generating traffic data:', error);
    
    // Return fallback data
    return {
      routes: ROUTES.map(route => ({
        name: route.name,
        from: route.from,
        to: route.to,
        normalTime: route.normalMinutes,
        currentTime: route.normalMinutes,
        delay: 0,
        status: 'clear' as const,
        incidents: []
      })),
      alerts: [],
      zipperLane: {
        active: false,
        direction: 'Honolulu-bound',
        hours: '5:30 AM - 9:00 AM weekdays'
      },
      lastUpdated: new Date().toISOString()
    };
  }
}