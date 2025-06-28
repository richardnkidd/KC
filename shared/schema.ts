import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Weather data types
export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    uvIndex: number;
    wind: string;
    pressure: string;
    icon: string;
  };
  hourly: Array<{
    time: string;
    hour: string;
    temp: number;
    icon: string;
    condition: string;
  }>;
  forecast: Array<{
    date: string;
    day: string;
    icon: string;
    highTemp: number;
    lowTemp: number;
    condition: string;
  }>;
  lastUpdated: string;
}

// Tide data types
export interface TideData {
  current: {
    status: 'Rising' | 'Falling' | 'High' | 'Low';
    level: number;
    percentage: number;
  };
  upcoming: Array<{
    type: 'High' | 'Low';
    time: string;
    timeLabel: string;
    height: number;
  }>;
  lastUpdated: string;
}

// Movie data types
export interface MovieData {
  showtimes: Array<{
    title: string;
    rating: string;
    duration: string;
    genre: string;
    times: string[];
  }>;
  lastUpdated: string;
}

// Events data types
export interface EventData {
  upcoming: Array<{
    title: string;
    date: string;
    day: string;
    time: string;
    venue: string;
    description: string;
    price: string;
    priceType: 'free' | 'paid' | 'premium';
  }>;
  lastUpdated: string;
}

// Sunrise/Sunset data types
export interface SunData {
  sunrise: {
    time: string;
    formatted: string;
  };
  sunset: {
    time: string;
    formatted: string;
  };
  solarNoon: {
    time: string;
    formatted: string;
  };
  dayLength: string;
  goldenHour: {
    morning: string;
    evening: string;
  };
  blueHour: {
    morning: string;
    evening: string;
  };
  lastUpdated: string;
}

// Traffic data types
export interface TrafficData {
  routes: Array<{
    name: string;
    from: string;
    to: string;
    normalTime: number;
    currentTime: number;
    delay: number;
    status: 'clear' | 'moderate' | 'heavy' | 'severe';
    incidents: Array<{
      type: 'accident' | 'construction' | 'event' | 'weather';
      description: string;
      location: string;
    }>;
  }>;
  alerts: Array<{
    type: 'closure' | 'warning' | 'info';
    title: string;
    description: string;
    roads: string[];
  }>;
  zipperLane: {
    active: boolean;
    direction: string;
    hours: string;
  };
  lastUpdated: string;
}
