# replit.md

## Overview

Kamaʻāina Compass is a React-based web application that provides real-time information about Honolulu, Hawaii. The application displays weather conditions, tide data, movie showtimes, and local events in a modern, mobile-first dashboard interface featuring an enhanced ocean-themed design system. It's built as a full-stack application with Express.js backend and React frontend, optimized for deployment on Replit.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with dark theme and custom Honolulu color palette
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **State Management**: SWR for data fetching and caching, React Query for additional query management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints serving JSON data
- **Data Fetching**: External API integrations for real-time data
- **Error Handling**: Centralized error handling with structured error responses
- **Development**: Hot module replacement with Vite middleware integration

### Data Flow
1. Frontend components make API requests through SWR hooks
2. Express server routes handle requests and call appropriate service functions
3. Service functions fetch data from external APIs (weather, tides, events, movies)
4. Data is processed, cached, and returned to the frontend
5. Frontend displays data with loading states and error handling

## Key Components

### Data Services
- **Weather Service**: Integrates with OpenWeatherMap API for current conditions and forecasts
- **Tides Service**: Uses NOAA API for tide predictions and current water levels
- **Movies Service**: Web scraping for local theater showtimes
- **Events Service**: Eventbrite API integration for local events

### Frontend Components
- **WeatherCard**: Displays current weather and 3-day forecast
- **TideCard**: Shows current tide status and upcoming tide times
- **MoviesCard**: Lists movie showtimes at local theaters
- **EventsCard**: Displays upcoming local events with pricing

### UI Features
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark Theme**: Custom Honolulu-inspired color palette
- **Real-time Updates**: Automatic data refreshing with configurable intervals
- **Offline Support**: Cached data display when network is unavailable
- **Error Boundaries**: Graceful error handling and user feedback

## Data Storage Solutions

### Database Configuration
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: User management with extensible design
- **Migrations**: Automated database schema management
- **Environment**: Database URL configuration for Neon/PostgreSQL

### Caching Strategy
- **SWR**: Client-side caching with automatic revalidation
- **Refresh Intervals**: Optimized based on data type (weather: 15min, tides: 30min, movies: 24hr, events: 6hr)
- **Error Recovery**: Fallback to cached data on API failures

## External Dependencies

### Required API Keys
- **OpenWeatherMap**: Weather data (current and forecast)
- **Eventbrite**: Local events data
- **NOAA**: Tide predictions (public API, no key required)

### Core Libraries
- **React Ecosystem**: React, React DOM, React Query, SWR
- **UI Framework**: Radix UI, Tailwind CSS, Lucide React icons
- **Backend**: Express, Axios, Cheerio (web scraping)
- **Database**: Drizzle ORM, Neon Database
- **Development**: Vite, TypeScript, ESLint

### Data Sources
- OpenWeatherMap API for weather data
- NOAA Tides and Currents API for tide information
- Eventbrite API for local events
- Web scraping for movie theater showtimes

## Deployment Strategy

### Build Process
1. **Development**: `npm run dev` - Vite dev server with HMR
2. **Build**: `npm run build` - Vite frontend build + esbuild server bundle
3. **Production**: `npm start` - Serves built application

### Environment Configuration
- **Database**: PostgreSQL via DATABASE_URL environment variable
- **APIs**: API keys configured through environment variables
- **Deployment**: Optimized for Replit with `.replit` configuration

### Production Considerations
- Static asset serving through Express
- Environment-specific error handling
- Database connection pooling
- API rate limiting considerations

## Changelog

```
Changelog:
- June 28, 2025: Initial setup
- June 28, 2025: Implemented comprehensive Kamaʻāina Compass design specification
  - Enhanced glass effect cards with improved opacity (0.85-0.95)
  - Applied new typography hierarchy with emphasis classes
  - Updated branding from "Honolulu Live" to "Kamaʻāina Compass"
  - Improved contrast and accessibility throughout dashboard
  - Added focus states and touch target guidelines
  - Optimized movie poster placeholders to 48x64px specifications
- June 28, 2025: Enhanced contrast and readability improvements
  - Lightened color palette for better visibility
  - Increased card background opacity to 96-98%
  - Added text shadows for AAA accessibility compliance
  - Improved background gradient with lighter ocean tones
  - Reduced pattern overlay opacity for better text readability
  - Enhanced typography with proper contrast ratios (7:1 minimum)
- June 28, 2025: Implemented design specification typography system
  - Added exact type scale (H1: 24px, H2: 20px, H3: 14px, Body: 16px, Small: 12px, Caption: 10px)
  - Applied proper font families (Sora for headers, Outfit for body text)
  - Updated text emphasis classes with correct opacity values (high: 100%, medium: 95%, low: 85%)
  - Standardized font weights and line heights across all components
  - Implemented typography utilities in Tailwind configuration
- June 28, 2025: Implemented exact glass effect and card specifications
  - Updated .glass class with 85% opacity and 12px backdrop blur
  - Added .glass-enhanced class with 90% opacity and 16px backdrop blur
  - Applied exact .tropical-card specification (92-98% opacity, 12px blur)
  - Implemented design token shadow system with proper depth hierarchy
  - Ensured all glass effects match specification opacity guidelines
- June 28, 2025: Updated component dimensions to match design specifications
  - WeatherCard: Temperature display exactly 48px, weather icons 32px
  - TideCard: Progress bar exactly 12px height, tide indicators 20px
  - MoviesCard: Poster placeholders exactly 48x64px, showtime pills 24px height
  - EventsCard: Date boxes exactly 48x48px
  - Applied minimum height requirements for tide items (48px)
- June 28, 2025: Implemented complete animation system from design specification
  - Added all animations: shimmer, ripple, pulse, slide-up, fade-in, bounce
  - Applied exact timing durations (micro: 200ms, short: 300ms, medium: 500ms, long: 1000ms)
  - Implemented bounce timing function: cubic-bezier(0.34, 1.56, 0.64, 1)
  - Added loading states with shimmer effects and skeleton loaders
  - Enhanced button interactions with ripple effects on click
  - Updated card transitions to use design specification timing functions
- June 28, 2025: Fixed and implemented surf data functionality
  - Resolved API route registration issues causing HTML responses instead of JSON
  - Integrated Open-Meteo Marine API for real-time wave height data
  - Converted metric units to feet for Hawaii surf conditions
  - Added surf data to refresh functionality and dashboard display
  - SurfCard now shows live wave heights, swell direction, and wind conditions
- June 28, 2025: Updated color palette to exact design specification
  - Applied exact hex values: Deep green (#191E19), Sage (#435443), Ocean deep (#0F2B3E), Ocean (#214263), Ocean light (#407B9E), Sand (#EADDCA), Volcanic (#8B2323), Stone (#2D2D2B), Mist (#F5F3F0)
  - Updated semantic color mappings: Background (deep green to ocean gradient), Surface (stone 80-98% opacity), Text Primary (mist), Text Secondary (sand), Accent (ocean light), Error (volcanic)
  - Converted Tailwind configuration from HSL to RGB format for proper color system integration
  - Updated background gradient to use design specification colors
- June 28, 2025: Lightened background gradient per user request
  - Changed from dark deep-green→ocean gradient to light mist→sand gradient
  - Background now uses: linear-gradient(180deg, var(--tropical-mist) 0%, var(--tropical-sand) 100%)
  - Creates a lighter aesthetic transitioning from off-white (#F5F3F0) to light tan (#EADDCA)
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```