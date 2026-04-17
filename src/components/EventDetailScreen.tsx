import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Share2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { addRSVPEvent, hasRSVPed } from '../utils/eventsStorage';
import { toast } from 'sonner@2.0.3';
import type { StoredUser } from '../utils/userStorage';

interface EventDetailScreenProps {
  event: {
    id: string | number;
    title: string;
    date: string;
    time: string;
    location: string;
    attendees?: number;
    category?: string;
    description?: string;
    organizer?: string;
  };
  currentUser: StoredUser | null;
  onBack: () => void;
  onRegisterSuccess?: () => void;
}

export function EventDetailScreen({ event, currentUser, onBack, onRegisterSuccess }: EventDetailScreenProps) {
  const isRegistered = currentUser ? hasRSVPed(currentUser.id, event.id.toString()) : false;

  const handleRegister = () => {
    if (!currentUser) {
      toast.error('Please log in to register for events.');
      return;
    }

    if (isRegistered) {
      toast.error('You have already registered for this event.');
      return;
    }

    addRSVPEvent(currentUser.id, {
      id: event.id.toString(),
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
    });
    
    toast.success('✓ Successfully registered for this event!');
    if (onRegisterSuccess) {
      onRegisterSuccess();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 px-6 pt-12 pb-8 rounded-b-[3rem]">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 hover:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          {event.category && (
            <Badge className="bg-white/20 text-white border-0 mb-3">
              {event.category}
            </Badge>
          )}
          <h1 className="text-2xl mb-2">{event.title}</h1>
          <div className="flex items-center space-x-4 text-red-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{event.time}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Event Stats */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="text-gray-900">{event.location}</p>
                </div>
              </div>
              {event.attendees && (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Attendees</p>
                    <p className="text-gray-900">{event.attendees}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-gray-900 mb-3">About this Event</h2>
            <p className="text-gray-600 leading-relaxed">
              {event.description || 
                `Join us for ${event.title}! This is a great opportunity to connect with fellow students and participate in campus activities. Don't miss out on this exciting event!`}
            </p>
          </div>

          {/* Organizer */}
          {event.organizer && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-gray-900 mb-2">Organized By</h2>
              <p className="text-gray-600">{event.organizer}</p>
            </div>
          )}

          {/* What to Bring */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-gray-900 mb-3">What to Bring</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3"></span>
                <span>Your student ID</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3"></span>
                <span>A positive attitude</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3"></span>
                <span>Your friends (optional)</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex space-x-3">
          <Button
            onClick={handleRegister}
            disabled={isRegistered}
            className={`flex-1 ${
              isRegistered
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } text-white rounded-2xl h-14 shadow-lg`}
          >
            {isRegistered ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Registered
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Register Now
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-14 h-14 border-2 border-gray-200 rounded-2xl"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
