import type { EventData } from '@shared/schema';

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN || process.env.EVENTBRITE_API_KEY || '';

export async function getEventsData(): Promise<EventData> {
  if (!EVENTBRITE_TOKEN) {
    console.warn('Eventbrite token not configured, using fallback data');
    return getFallbackEvents();
  }

  try {
    // Search for events in Honolulu area
    const response = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?location.address=Honolulu,HI&location.within=25mi&expand=venue&sort_by=date`,
      {
        headers: {
          'Authorization': `Bearer ${EVENTBRITE_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Eventbrite API responded with status: ${response.status}`);
    }

    const data = await response.json();

    const events = data.events?.slice(0, 10).map((event: any) => {
      const startDate = new Date(event.start.local);
      const endDate = new Date(event.end.local);
      
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                         'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      
      const month = monthNames[startDate.getMonth()];
      const day = startDate.getDate().toString();
      
      const timeString = `${startDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })} - ${endDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;

      let price = 'Free';
      let priceType: 'free' | 'paid' | 'premium' = 'free';

      if (event.ticket_availability?.minimum_ticket_price) {
        const minPrice = event.ticket_availability.minimum_ticket_price.major_value;
        if (minPrice > 0) {
          price = `$${minPrice}`;
          priceType = minPrice > 30 ? 'premium' : 'paid';
        }
      }

      return {
        title: event.name.text,
        date: `${month} ${day}`,
        day: day,
        time: timeString,
        venue: event.venue?.name || 'TBA',
        description: event.description?.text?.slice(0, 100) + '...' || 'Event details available on registration',
        price,
        priceType,
      };
    }) || [];

    if (events.length === 0) {
      return getFallbackEvents();
    }

    const eventsData: EventData = {
      upcoming: events,
      lastUpdated: new Date().toISOString(),
    };

    return eventsData;
  } catch (error) {
    console.error('Error fetching events data:', error);
    return getFallbackEvents();
  }
}

function getFallbackEvents(): EventData {
  const today = new Date();
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                     'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  // Generate future dates starting from tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const in3Days = new Date(today);
  in3Days.setDate(in3Days.getDate() + 3);
  
  const in5Days = new Date(today);
  in5Days.setDate(in5Days.getDate() + 5);
  
  const events = [
    {
      title: "Honolulu Night Market",
      date: `${monthNames[tomorrow.getMonth()]} ${tomorrow.getDate()}`,
      day: tomorrow.getDate().toString(),
      time: "5:00 PM - 10:00 PM",
      venue: "Kakaako Waterfront Park",
      description: "Local vendors, food trucks, and live music",
      price: "Free",
      priceType: "free" as const,
    },
    {
      title: "Sunset Beach Concert Series",
      date: `${monthNames[in3Days.getMonth()]} ${in3Days.getDate()}`,
      day: in3Days.getDate().toString(),
      time: "7:00 PM - 9:00 PM",
      venue: "Waikiki Beach",
      description: "Jazz fusion band featuring local artists",
      price: "$25",
      priceType: "paid" as const,
    },
    {
      title: "Hawaiian Cultural Festival",
      date: `${monthNames[in5Days.getMonth()]} ${in5Days.getDate()}`,
      day: in5Days.getDate().toString(),
      time: "10:00 AM - 6:00 PM",
      venue: "Iolani Palace",
      description: "Traditional performances, crafts, and food",
      price: "$15",
      priceType: "paid" as const,
    },
    {
      title: "Diamond Head Sunrise Hike",
      date: "JUN 22",
      day: "22",
      time: "5:30 AM",
      venue: "Diamond Head State Monument",
      description: "Guided group hike with photography workshop",
      price: "$35",
      priceType: "premium" as const,
    },
    {
      title: "Farmers Market & Craft Fair",
      date: "JUN 25",
      day: "25",
      time: "8:00 AM - 2:00 PM",
      venue: "Kapiolani Park",
      description: "Fresh produce, handmade goods, and local treats",
      price: "Free",
      priceType: "free" as const,
    },
  ];

  return {
    upcoming: events,
    lastUpdated: new Date().toISOString(),
  };
}
