import React, { useState } from 'react';
import { ChevronDown, Car, Sun, Film, Calendar, Clock, ChevronRight, MapPin, Camera, Compass, Navigation, AlertTriangle, Coffee, ShoppingBag, Waves, Mountain, Utensils, Phone, Wifi, DollarSign, Star, Heart, Truck, Music, TreePine } from 'lucide-react';
import { TrafficCard } from './TrafficCard';
import { SunCard } from './SunCard';
import { MoviesCard } from './MoviesCard';
import { EventsCard } from './EventsCard';
import { cn } from '@/lib/utils';

interface ExpandableSectionProps {
  title: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  accentColor?: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  icon,
  preview,
  children,
  defaultExpanded = false,
  accentColor = 'from-[#407B9E] to-[#214263]'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="tropical-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-0 bg-transparent border-none"
      >
        <div className="flex items-center justify-between p-6 hover:bg-[rgba(0,0,0,0.02)] transition-colors">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br ${accentColor}`}>
                <div className="text-white relative z-10">
                  {icon}
                </div>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-h2 font-display text-emphasis-high">{title}</h3>
              {!isExpanded && (
                <div className="text-small text-emphasis-medium mt-1">
                  {preview}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isExpanded && (
              <span className="text-xs text-muted hidden sm:block">Tap to expand</span>
            )}
            <ChevronDown className={cn(
              "w-6 h-6 text-[#407B9E] transition-transform duration-300",
              isExpanded && "rotate-180"
            )} />
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "opacity-100" : "opacity-0 max-h-0"
      )}>
        <div className={cn(
          "px-6 pb-6 transition-all duration-300",
          isExpanded ? "max-h-[3000px]" : "max-h-0"
        )}>
          <div className="border-t border-[rgba(0,0,0,0.06)] pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExpandableSections: React.FC = () => {
  // Quick preview components for collapsed state
  const TrafficPreview = () => (
    <div className="flex items-center space-x-4">
      <span className="text-sm">H-1 Eastbound</span>
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-700">
        25 min delay
      </span>
    </div>
  );

  const SunPreview = () => (
    <div className="flex items-center space-x-4">
      <span className="text-sm">Sunrise 6:42 AM</span>
      <span className="text-sm text-muted">•</span>
      <span className="text-sm">Sunset 7:15 PM</span>
    </div>
  );

  const MoviesPreview = () => (
    <div className="flex items-center space-x-4">
      <span className="text-sm">4 movies showing</span>
      <span className="text-sm text-muted">•</span>
      <span className="text-sm">Next: 7:30 PM</span>
    </div>
  );

  const EventsPreview = () => (
    <div className="flex items-center space-x-4">
      <span className="text-sm">3 events this weekend</span>
      <span className="text-sm text-muted">•</span>
      <span className="text-sm">Art show tonight</span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Island Life Section - Enhanced with comprehensive island information */}
      <ExpandableSection
        title="Island Life"
        icon={<Car className="w-6 h-6" />}
        preview={<TrafficPreview />}
        accentColor="from-[#DC2626] to-[#F59E0B]"
      >
        <div className="space-y-6">
          {/* Traffic */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Car className="w-4 h-4 mr-2" />
              Current Traffic
            </h4>
            <TrafficCard />
          </div>
          
          {/* Sun Times */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Sun className="w-4 h-4 mr-2" />
              Photography Times
            </h4>
            <SunCard />
          </div>

          {/* Popular Spots - Enhanced with more details */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Popular Spots Today
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                    <span className="text-lg">🏖️</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary">Lanikai Beach</h5>
                    <p className="text-xs text-muted">Perfect conditions • 2-3ft surf</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">Excellent</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">30 min drive</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
                    <span className="text-lg">🥾</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary">Diamond Head</h5>
                    <p className="text-xs text-muted">Great for sunrise • Clear views</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full">Moderate</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">15 min drive</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
                    <span className="text-lg">🛍️</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary">Ala Moana Center</h5>
                    <p className="text-xs text-muted">Shopping & dining • AC comfort</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-[#3B82F6]/20 text-[#3B82F6] px-2 py-0.5 rounded-full">Indoor</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">10 min drive</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
                    <span className="text-lg">🌺</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary">Lyon Arboretum</h5>
                    <p className="text-xs text-muted">Cool & shaded • Easy walk</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-0.5 rounded-full">Peaceful</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">25 min drive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Local Tips - Enhanced with more practical advice */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Compass className="w-4 h-4 mr-2" />
              Local Tips
            </h4>
            <div className="space-y-3">
              <div className="glass rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-primary">Morning Coffee Run</h5>
                    <p className="text-xs text-muted mt-1">
                      Beat the crowds at Leonard's Bakery (6:30 AM) for fresh malasadas, 
                      then grab coffee at Morning Glass Coffee + Cafe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-primary">Parking Alert</h5>
                    <p className="text-xs text-muted mt-1">
                      Ala Moana Beach Park gets crowded after 10 AM on weekends. 
                      Arrive early or consider the paid lot at Magic Island.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-primary">Photo Spot</h5>
                    <p className="text-xs text-muted mt-1">
                      Golden hour at Tantalus Lookout offers incredible city and ocean views. 
                      Arrive 30 minutes before sunset for the best shots.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Surf & Ocean Conditions - New comprehensive section */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Waves className="w-4 h-4 mr-2" />
              Surf & Ocean Conditions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-3 flex items-center">
                  <span className="text-lg mr-2">🏄‍♂️</span>
                  South Shore
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Waikiki</span>
                    <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">2-3ft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Ala Moana Bowls</span>
                    <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full">3-5ft</span>
                  </div>
                  <div className="text-xs text-muted mt-2">
                    <p>Best: 2 hours before high tide</p>
                    <p>Crowd: Moderate (weekday)</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-3 flex items-center">
                  <span className="text-lg mr-2">🌊</span>
                  North Shore
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Pipeline</span>
                    <span className="text-xs bg-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full">8-10ft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Sunset Beach</span>
                    <span className="text-xs bg-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full">6-8ft</span>
                  </div>
                  <div className="text-xs text-muted mt-2">
                    <p>⚠️ Expert surfers only</p>
                    <p>Strong currents present</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Essential Services - New section */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Essential Services
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3">
                <h5 className="text-xs font-medium text-primary mb-2">Medical</h5>
                <div className="space-y-1 text-xs text-muted">
                  <p>Queen's Medical Center: (808) 538-9011</p>
                  <p>Urgent Care Waikiki: Open until 11 PM</p>
                  <p>CVS MinuteClinic: Walk-ins welcome</p>
                </div>
              </div>
              <div className="glass rounded-xl p-3">
                <h5 className="text-xs font-medium text-primary mb-2">Transportation</h5>
                <div className="space-y-1 text-xs text-muted">
                  <p>Uber/Lyft: 5-10 min wait</p>
                  <p>TheBus: Download DaBus2 app</p>
                  <p>Biki Bikes: $4.50/30 min</p>
                </div>
              </div>
              <div className="glass rounded-xl p-3">
                <h5 className="text-xs font-medium text-primary mb-2">24-Hour Services</h5>
                <div className="space-y-1 text-xs text-muted">
                  <p>Foodland Ala Moana: 24/7 grocery</p>
                  <p>7-Eleven: Multiple locations</p>
                  <p>Zippy's: 24-hour local food</p>
                </div>
              </div>
              <div className="glass rounded-xl p-3">
                <h5 className="text-xs font-medium text-primary mb-2">Emergency</h5>
                <div className="space-y-1 text-xs text-muted">
                  <p>Police/Fire/Medical: 911</p>
                  <p>Beach Safety: (808) 922-3888</p>
                  <p>Tourist Hotline: (808) 923-1811</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* This Weekend Section - Comprehensive weekend planning */}
      <ExpandableSection
        title="This Weekend"
        icon={<Calendar className="w-6 h-6" />}
        preview={<EventsPreview />}
        accentColor="from-[#8B5CF6] to-[#7C3AED]"
      >
        <div className="space-y-6">
          {/* Movies */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Film className="w-4 h-4 mr-2" />
              Movies Now Showing
            </h4>
            <MoviesCard />
          </div>

          {/* Events */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming Events
            </h4>
            <EventsCard />
          </div>

          {/* Dining Guide - New comprehensive section */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Utensils className="w-4 h-4 mr-2" />
              Dining Guide
            </h4>
            <div className="space-y-4">
              {/* Breakfast */}
              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-3">🌅 Breakfast (6 AM - 11 AM)</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Eggs 'n Things</p>
                      <p className="text-xs text-muted">Famous pancakes • 1-hour wait weekends</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$15-25</p>
                      <p className="text-xs text-muted">Waikiki</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Koko Head Cafe</p>
                      <p className="text-xs text-muted">Local fusion • No reservations</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$12-18</p>
                      <p className="text-xs text-muted">Kaimuki</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Rainbow Drive-In</p>
                      <p className="text-xs text-muted">Loco moco • Quick service</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$8-12</p>
                      <p className="text-xs text-muted">Kapahulu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lunch */}
              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-3">☀️ Lunch (11 AM - 3 PM)</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Marukame Udon</p>
                      <p className="text-xs text-muted">Fresh udon • 30-min line typical</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$8-15</p>
                      <p className="text-xs text-muted">Waikiki</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Helena's Hawaiian Food</p>
                      <p className="text-xs text-muted">Traditional • Closes 7:30 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$10-20</p>
                      <p className="text-xs text-muted">Kalihi</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Ono Seafood</p>
                      <p className="text-xs text-muted">Best poke • Closes when sold out</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$12-18</p>
                      <p className="text-xs text-muted">Kapahulu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dinner */}
              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-3">🌙 Dinner (5 PM - 10 PM)</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Alan Wong's</p>
                      <p className="text-xs text-muted">Fine dining • Reservations essential</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$50-80</p>
                      <p className="text-xs text-muted">King St</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">The Pig and the Lady</p>
                      <p className="text-xs text-muted">Vietnamese fusion • Book ahead</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$25-40</p>
                      <p className="text-xs text-muted">Chinatown</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Duke's Waikiki</p>
                      <p className="text-xs text-muted">Beach view • Live music 4-6 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$20-35</p>
                      <p className="text-xs text-muted">Waikiki</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Late Night */}
              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-3">🌃 Late Night (10 PM - 2 AM)</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Ramen Nakamura</p>
                      <p className="text-xs text-muted">Open until 3 AM • Cash only</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$12-18</p>
                      <p className="text-xs text-muted">Waikiki</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Mac 24/7</p>
                      <p className="text-xs text-muted">24 hours • Huge portions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">$15-25</p>
                      <p className="text-xs text-muted">Waikiki</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activities - Water */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Waves className="w-4 h-4 mr-2" />
              Water Activities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">🏄 Surf Lessons</h5>
                  <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">Beginner</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 Waikiki Beach</p>
                  <p>💵 $80-120 (2 hours, includes board)</p>
                  <p>⏰ Best: 7-10 AM (less crowded)</p>
                  <p>📞 Book: Hans Hedemann Surf</p>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">🤿 Snorkeling</h5>
                  <span className="text-xs bg-[#3B82F6]/20 text-[#3B82F6] px-2 py-0.5 rounded-full">All levels</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 Hanauma Bay</p>
                  <p>💵 $25 entry + $20 gear rental</p>
                  <p>⏰ Arrive by 6:30 AM (parking fills)</p>
                  <p>📝 Reserve online 48hrs ahead</p>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">⛵ Sunset Sail</h5>
                  <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full">Romantic</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 Ala Wai Harbor</p>
                  <p>💵 $60-90 per person</p>
                  <p>⏰ Departs 5:30 PM</p>
                  <p>🍹 Includes drinks & pupus</p>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">🐢 Turtle Tour</h5>
                  <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">Family</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 North Shore</p>
                  <p>💵 $120 (includes transport)</p>
                  <p>⏰ 8 AM pickup</p>
                  <p>🌟 95% turtle sighting rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activities - Land */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Mountain className="w-4 h-4 mr-2" />
              Land Adventures
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">🚁 Helicopter Tour</h5>
                  <span className="text-xs bg-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full">Splurge</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 Honolulu Airport area</p>
                  <p>💵 $350-500 per person</p>
                  <p>⏰ 45-60 minute flights</p>
                  <p>📸 Doors-off option available</p>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">🥾 Manoa Falls</h5>
                  <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">Easy</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 Manoa Valley</p>
                  <p>💵 $5 parking</p>
                  <p>⏰ 1.6 miles round trip</p>
                  <p>☔ Bring rain gear (always wet)</p>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">🚴 Bike Tour</h5>
                  <span className="text-xs bg-[#3B82F6]/20 text-[#3B82F6] px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 Kailua Beach area</p>
                  <p>💵 $45 half-day rental</p>
                  <p>⏰ 20 min to Lanikai</p>
                  <p>🏖️ Beach cruiser recommended</p>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-primary">🌋 Volcano Day Trip</h5>
                  <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full">Full day</span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p>📍 Big Island (fly over)</p>
                  <p>💵 $400-600 all inclusive</p>
                  <p>⏰ 5 AM start, return 10 PM</p>
                  <p>✈️ Includes inter-island flight</p>
                </div>
              </div>
            </div>
          </div>

          {/* Arts & Culture */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Arts & Culture
            </h4>
            <div className="space-y-3">
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary">Bishop Museum</h5>
                    <p className="text-xs text-muted mt-1">Hawaiian history & culture</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs">📍 Kalihi</span>
                      <span className="text-xs">💵 $27.95</span>
                      <span className="text-xs">⏰ 9 AM - 5 PM</span>
                    </div>
                  </div>
                  <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">Must see</span>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary">Honolulu Museum of Art</h5>
                    <p className="text-xs text-muted mt-1">Asian & Pacific collections</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs">📍 Downtown</span>
                      <span className="text-xs">💵 $20</span>
                      <span className="text-xs">⏰ Free first Wed</span>
                    </div>
                  </div>
                  <span className="text-xs bg-[#3B82F6]/20 text-[#3B82F6] px-2 py-0.5 rounded-full">Art lovers</span>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary">Pearl Harbor</h5>
                    <p className="text-xs text-muted mt-1">USS Arizona Memorial</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs">📍 Pearl Harbor</span>
                      <span className="text-xs">💵 Free (reserve)</span>
                      <span className="text-xs">⏰ 7 AM start</span>
                    </div>
                  </div>
                  <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-0.5 rounded-full">History</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Gems */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Hidden Gems
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-2">🌸 Foster Botanical Garden</h5>
                <p className="text-xs text-muted">
                  14-acre tropical oasis in downtown. Home to prehistoric 
                  plants and the largest Baobab tree in the US. Perfect 
                  escape from city hustle.
                </p>
                <p className="text-xs text-[#407B9E] mt-2">💵 $5 • 📍 Downtown • ⏰ 9 AM - 4 PM</p>
              </div>

              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-2">🏖️ Cromwell's Beach</h5>
                <p className="text-xs text-muted">
                  Secret beach below Koko Head. Requires short hike down 
                  unmarked trail. Crystal clear water, often empty. 
                  Locals' favorite for peaceful swim.
                </p>
                <p className="text-xs text-[#407B9E] mt-2">💵 Free • 📍 Hawaii Kai • ⚠️ No facilities</p>
              </div>

              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-2">☕ The Curb Kaimuki</h5>
                <p className="text-xs text-muted">
                  Local coffee shop with excellent breakfast. Try the 
                  lemon ricotta pancakes. Free WiFi, local art on walls. 
                  Zero tourist crowds.
                </p>
                <p className="text-xs text-[#407B9E] mt-2">💵 $10-15 • 📍 Kaimuki • ⏰ 7 AM - 2 PM</p>
              </div>

              <div className="glass rounded-xl p-4">
                <h5 className="text-sm font-medium text-primary mb-2">🌅 Makapuu Tide Pools</h5>
                <p className="text-xs text-muted">
                  Natural pools beyond lighthouse trail. Best at low tide. 
                  Bring water shoes. Instagram paradise but respect the 
                  ocean - can be dangerous.
                </p>
                <p className="text-xs text-[#407B9E] mt-2">💵 Free • 📍 East side • 🌊 Check tides</p>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};