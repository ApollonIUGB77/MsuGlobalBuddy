import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Calendar, MapPin, Clock, Users, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { addRSVPEvent, hasRSVPed } from '../utils/eventsStorage';
import type { StoredUser } from '../utils/userStorage';
import { EventDetailScreen } from './EventDetailScreen';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string;
  category: string;
}

interface EventsScreenProps {
  onBack: () => void;
  currentUser: StoredUser | null;
}

export function EventsScreen({ onBack, currentUser }: EventsScreenProps) {
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'International Coffee Hour',
      date: 'Nov 16, 2025',
      time: '3:00 PM - 5:00 PM',
      location: 'Student Center',
      attendees: 24,
      description: 'Join us for coffee and conversation with students from around the world!',
      category: 'Social',
    },
    {
      id: '2',
      title: 'Campus Tour for International Students',
      date: 'Nov 18, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Main Gate',
      attendees: 15,
      description: 'Explore campus and learn about all the resources available.',
      category: 'Academic',
    },
    {
      id: '3',
      title: 'Game Night',
      date: 'Nov 20, 2025',
      time: '7:00 PM - 10:00 PM',
      location: 'Recreation Center',
      attendees: 30,
      description: 'Board games, video games, and fun with new friends!',
      category: 'Social',
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (selectedEvent) {
    return (
      <EventDetailScreen
        event={selectedEvent}
        currentUser={currentUser}
        onBack={() => setSelectedEvent(null)}
      />
    );
  }

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-4">
        <button
          onClick={onBack}
          className="flex items-center text-red-600 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-red-600">Upcoming Events</h1>
      </div>

      {/* Events List */}
      <div className="flex-1 px-8 pb-8 space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedEvent(event)}
            className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-gray-900 flex-1">{event.title}</h3>
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                {event.category}
              </span>
            </div>
            
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}