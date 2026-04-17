import { motion } from 'motion/react';
import { useState } from 'react';
import { Calendar, MapPin, Users, BookOpen, Bell, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getUserRSVPEvents, addRSVPEvent, hasRSVPed } from '../utils/eventsStorage';
import { toast } from 'sonner@2.0.3';
import type { StoredUser } from '../utils/userStorage';
import { EventDetailScreen } from './EventDetailScreen';

interface UniversityPageProps {
  currentUser: StoredUser | null;
}

export function UniversityPage({ currentUser }: UniversityPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const allEvents = [
    {
      id: 1,
      title: 'International Student Mixer',
      date: 'Nov 18, 2025',
      time: '6:00 PM',
      location: 'Student Center, Room 301',
      attendees: 45,
      category: 'Social',
      description: 'Meet fellow international students and make new friends! This mixer will feature music, food from around the world, and fun activities.',
      organizer: 'International Student Services',
    },
    {
      id: 2,
      title: 'Career Fair 2025',
      date: 'Nov 20, 2025',
      time: '10:00 AM',
      location: 'University Arena',
      attendees: 230,
      category: 'Career',
      description: 'Connect with top employers and explore career opportunities. Bring your resume and dress professionally!',
      organizer: 'Career Services',
    },
    {
      id: 3,
      title: 'Study Abroad Info Session',
      date: 'Nov 22, 2025',
      time: '3:00 PM',
      location: 'Admin Building, Hall A',
      attendees: 67,
      category: 'Academic',
      description: 'Learn about study abroad opportunities and scholarships. Hear from students who have studied abroad.',
      organizer: 'Global Education Center',
    },
    {
      id: 4,
      title: 'Cultural Night Festival',
      date: 'Nov 25, 2025',
      time: '7:00 PM',
      location: 'Student Center Ballroom',
      attendees: 180,
      category: 'Social',
      description: 'Celebrate diversity with performances, food, and cultural exhibitions from around the world.',
      organizer: 'Student Activities',
    },
    {
      id: 5,
      title: 'Resume Workshop',
      date: 'Nov 27, 2025',
      time: '2:00 PM',
      location: 'Career Services Office',
      attendees: 35,
      category: 'Career',
      description: 'Get expert feedback on your resume and learn how to make it stand out to employers.',
      organizer: 'Career Services',
    },
  ];

  const displayedEvents = showAllEvents ? allEvents : allEvents.slice(0, 3);

  const announcements = [
    {
      id: 1,
      title: 'Fall Semester Registration Open',
      date: 'Nov 15, 2025',
      category: 'Important',
    },
    {
      id: 2,
      title: 'New MSU Mobile App Available',
      date: 'Nov 14, 2025',
      category: 'Update',
    },
    {
      id: 3,
      title: 'Campus Wi-Fi Maintenance',
      date: 'Nov 12, 2025',
      category: 'Notice',
    },
  ];

  const quickLinks = [
    { 
      label: 'Academic Calendar', 
      icon: Calendar,
      url: 'https://www.montclair.edu/academics/academic-calendar/'
    },
    { 
      label: 'Campus Map', 
      icon: MapPin,
      url: 'https://www.montclair.edu/campus-map/'
    },
    { 
      label: 'Course Catalog', 
      icon: BookOpen,
      url: 'https://www.montclair.edu/academics/'
    },
    { 
      label: 'Student Services', 
      icon: Users,
      url: 'https://www.montclair.edu/dean-of-students/'
    },
  ];

  const rsvpedEvents = currentUser ? getUserRSVPEvents(currentUser.id) : [];

  // If an event is selected, show the detail screen
  if (selectedEvent) {
    return (
      <EventDetailScreen
        event={selectedEvent}
        currentUser={currentUser}
        onBack={() => {
          setSelectedEvent(null);
          setRefreshKey(prev => prev + 1);
        }}
        onRegisterSuccess={() => {
          setRefreshKey(prev => prev + 1);
        }}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 px-6 pt-12 pb-8 rounded-b-[3rem]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl mb-2">MSU Campus</h1>
            <p className="text-red-100">Montclair State University</p>
          </div>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-white text-xl mb-1">4.2K</div>
            <div className="text-red-100 text-xs">Students</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-white text-xl mb-1">{rsvpedEvents.length}</div>
            <div className="text-red-100 text-xs">Registered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-white text-xl mb-1">150+</div>
            <div className="text-red-100 text-xs">Clubs</div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* My Registered Events */}
        {rsvpedEvents.length > 0 && (
          <div className="mb-6">
            <h2 className="text-gray-900 mb-3">My Registered Events</h2>
            <div className="space-y-3">
              {rsvpedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    const fullEvent = allEvents.find(e => e.id.toString() === event.id);
                    if (fullEvent) setSelectedEvent(fullEvent);
                  }}
                  className="cursor-pointer"
                >
                  <Card className="p-4 shadow-sm border-l-4 border-l-green-500 bg-green-50/30 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-green-600 text-white border-0">
                            <Check className="w-3 h-3 mr-1" />
                            Registered
                          </Badge>
                        </div>
                        <h3 className="text-gray-900 mb-2">{event.title}</h3>
                        <div className="space-y-1 text-gray-600 text-sm">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-3">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-gray-900 text-left">{link.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900">Upcoming Events</h2>
            <button 
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowAllEvents(!showAllEvents)}
            >
              {showAllEvents ? 'View Less' : 'View All'}
            </button>
          </div>
          <div className="space-y-3">
            {displayedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-gray-100"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          className={`${
                            event.category === 'Social'
                              ? 'bg-blue-50 text-blue-600'
                              : event.category === 'Career'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-purple-50 text-purple-600'
                          } border-0`}
                        >
                          {event.category}
                        </Badge>
                      </div>
                      <h3 className="text-gray-900 mb-2">{event.title}</h3>
                      <div className="space-y-1 text-gray-600 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {event.date} at {event.time}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900">Announcements</h2>
            <button className="text-red-600 hover:text-red-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {announcements.map((announcement, index) => (
              <motion.button
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge
                      variant="outline"
                      className={`mb-2 ${
                        announcement.category === 'Important'
                          ? 'border-red-200 text-red-600'
                          : announcement.category === 'Update'
                          ? 'border-blue-200 text-blue-600'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {announcement.category}
                    </Badge>
                    <h3 className="text-gray-900 mb-1">{announcement.title}</h3>
                    <p className="text-gray-500 text-sm">{announcement.date}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
