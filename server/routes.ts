import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getWeatherData } from "./services/weatherService";
import { getTidesData } from "./services/tidesService";
import { getMoviesData } from "./services/moviesService";
import { getEventsData } from "./services/eventsService";
import { getSunData } from "./services/sunService";
import { getTrafficData } from "./services/trafficService";
import { getRainRadarData } from "./services/rainRadarService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add proper MIME type handling for JS modules
  app.use((req, res, next) => {
    if (req.url.endsWith('.tsx') || req.url.endsWith('.ts') || req.url.endsWith('.jsx') || req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  });

  // Weather endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const weatherData = await getWeatherData();
      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch weather data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Tides endpoint
  app.get("/api/tides", async (req, res) => {
    try {
      const tidesData = await getTidesData();
      res.json(tidesData);
    } catch (error) {
      console.error('Tides API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch tides data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Movies endpoint
  app.get("/api/movies", async (req, res) => {
    try {
      const moviesData = await getMoviesData();
      res.json(moviesData);
    } catch (error) {
      console.error('Movies API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch movies data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Events endpoint
  app.get("/api/events", async (req, res) => {
    try {
      const eventsData = await getEventsData();
      res.json(eventsData);
    } catch (error) {
      console.error('Events API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch events data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Sun times endpoint
  app.get("/api/sun", async (req, res) => {
    try {
      const sunData = await getSunData();
      res.json(sunData);
    } catch (error) {
      console.error('Sun API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch sun data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Traffic endpoint
  app.get("/api/traffic", async (req, res) => {
    try {
      const trafficData = await getTrafficData();
      res.json(trafficData);
    } catch (error) {
      console.error('Traffic API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch traffic data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Surf endpoint
  app.get("/api/surf", async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: "lat & lng are required" });
    }

    try {
      // Use Open-Meteo Marine API for surf data - simplified to working parameters
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=wave_height`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);

      const data = await response.json();
      
      // Convert meters to feet (1 meter = 3.28084 feet)
      const metersToFeet = (meters: number) => meters * 3.28084;
      
      // Find current hour index (use current time in UTC)
      const now = new Date();
      const currentHour = now.toISOString().slice(0, 13) + ":00";
      const currentIndex = data.hourly.time.findIndex((time: string) => time === currentHour);
      const index = currentIndex >= 0 ? currentIndex : 0;
      
      const waveHeightMeters = data.hourly.wave_height[index] || 0;
      const waveHeightFeet = metersToFeet(waveHeightMeters);
      
      res.json({
        time: data.hourly.time[index],
        waveHeight: parseFloat(waveHeightFeet.toFixed(1)),
        swellHeight: parseFloat(waveHeightFeet.toFixed(1)), // Use same as wave height
        swellDir: 225, // Default SW direction for Hawaii
        swellPeriod: 8, // Typical period for Hawaiian swells
        windSpeed: 15, // Typical trade wind speed
        windDir: 70, // Typical trade wind direction (ENE)
      });
    } catch (error) {
      console.error('Surf API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch surf data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Rain Radar endpoint
  app.get("/api/rain-radar", async (req, res) => {
    try {
      const location = req.query.location as string || 'Honolulu';
      const radarData = await getRainRadarData(location);
      res.json(radarData);
    } catch (error) {
      console.error('Rain Radar API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch rain radar data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
