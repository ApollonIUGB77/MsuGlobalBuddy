import { motion } from 'motion/react';
import { Bell, MessageCircle, Users, Calendar, BookOpen, Heart, User, GraduationCap, Award } from 'lucide-react';
import { Button } from './ui/button';

interface HomeScreenProps {
  userName?: string;
  isFirstLogin?: boolean;
  userConversations: any[];
  userMatchedBuddies: string[];
  unreadNotificationsCount?: number;
  onFindBuddy: () => void;
  onViewEvents: () => void;
  onOpenResources: () => void;
  onOpenMatches: () => void;
  onOpenMessages: () => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onTabChange: (tab: 'home' | 'profile' | 'chat' | 'university' | 'achievements') => void;
  activeTab?: 'home' | 'profile' | 'chat' | 'university' | 'achievements';
}

export function HomeScreen({ 
  userName = 'Student', 
  isFirstLogin = false,
  userConversations,
  userMatchedBuddies,
  unreadNotificationsCount = 0,
  onFindBuddy, 
  onViewEvents, 
  onOpenResources,
  onOpenMatches,
  onOpenMessages,
  onOpenChat,
  onOpenNotifications,
  onTabChange,
  activeTab = 'home'
}: HomeScreenProps) {
  const tabs = [
    { id: 'home' as const, icon: Users, label: 'Home' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
    { id: 'chat' as const, icon: MessageCircle, label: 'Chat' },
    { id: 'university' as const, icon: GraduationCap, label: 'University' },
    { id: 'achievements' as const, icon: Award, label: 'Rewards' },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 pt-12 pb-8 px-6 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-2xl mb-1"
            >
              {isFirstLogin ? `Welcome, ${userName}! 👋` : `Welcome back, ${userName}! 👋`}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-red-100"
            >
              {isFirstLogin ? 'Let\'s get started on your journey!' : 'Ready to connect today?'}
            </motion.p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={onOpenChat}
              className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={onOpenNotifications}
              className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all relative"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadNotificationsCount > 0 && (
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-red-600" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-white text-xl mb-1">{userMatchedBuddies.length}</div>
              <div className="text-red-100 text-sm">Buddies</div>
            </div>
            <div>
              <div className="text-white text-xl mb-1">0</div>
              <div className="text-red-100 text-sm">Events</div>
            </div>
            <div>
              <div className="text-white text-xl mb-1">{userMatchedBuddies.length > 0 ? '92%' : '--'}</div>
              <div className="text-red-100 text-sm">Match Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Notifications - Only show if has matches or conversations */}
        {userMatchedBuddies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 mb-6"
          >
            <button
              onClick={onOpenMatches}
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center space-x-4 text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-gray-900 mb-0.5">You have {userMatchedBuddies.length} {userMatchedBuddies.length === 1 ? 'match' : 'matches'}!</div>
                <div className="text-gray-500 text-sm">Check out your compatible buddies</div>
              </div>
              <div className="text-red-600">→</div>
            </button>

            {userConversations.length > 0 && (
              <button
                onClick={onOpenMessages}
                className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center space-x-4 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 mb-0.5">{userConversations.length} {userConversations.length === 1 ? 'conversation' : 'conversations'}</div>
                  <div className="text-gray-500 text-sm">Start chatting with your buddies!</div>
                </div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              </button>
            )}
          </motion.div>
        )}

        {/* Welcome message for first-time users */}
        {isFirstLogin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100"
          >
            <div className="text-4xl mb-3 text-center">🎉</div>
            <h3 className="text-gray-900 mb-2 text-center">Welcome to MSU Global Buddy+!</h3>
            <p className="text-gray-600 text-center mb-4">
              Start by finding your first buddy match! Our smart algorithm will pair you with students who share your interests and goals.
            </p>
            <Button
              onClick={onFindBuddy}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12"
            >
              Find My First Buddy
            </Button>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onFindBuddy}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-gray-900 mb-1">Find My Buddy</div>
              <div className="text-gray-500 text-sm">Get matched instantly</div>
            </button>

            <button
              onClick={onViewEvents}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-gray-900 mb-1">View Events</div>
              <div className="text-gray-500 text-sm">Upcoming activities</div>
            </button>

            <button
              onClick={onOpenResources}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-gray-900 mb-1">Resources</div>
              <div className="text-gray-500 text-sm">Guides & tutorials</div>
            </button>

            <button
              onClick={onOpenMatches}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-gray-900 mb-1">My Matches</div>
              <div className="text-gray-500 text-sm">View all buddies</div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-red-50 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-red-600' : 'text-gray-400'
                    }`}
                  />
                </div>
                <span
                  className={`relative z-10 text-xs transition-colors ${
                    isActive ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}