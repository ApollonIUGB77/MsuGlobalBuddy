import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MessageCircle, GraduationCap, Award } from 'lucide-react';
import { ProfilePage } from './ProfilePage';
import { ChatPage } from './ChatPage';
import { UniversityPage } from './UniversityPage';
import { AchievementsPage } from './AchievementsPage';

interface MainAppProps {
  userData: any;
  onLogout: () => void;
  onBackToHome?: () => void;
}

type Tab = 'profile' | 'chat' | 'university' | 'achievements';

export function MainApp({ userData, onLogout, onBackToHome }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs = [
    { id: 'profile' as Tab, icon: User, label: 'Profile' },
    { id: 'chat' as Tab, icon: MessageCircle, label: 'Chat' },
    { id: 'university' as Tab, icon: GraduationCap, label: 'University' },
    { id: 'achievements' as Tab, icon: Award, label: 'Achievements' },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage userData={userData} onLogout={onLogout} onBackToHome={onBackToHome} />;
      case 'chat':
        return <ChatPage />;
      case 'university':
        return <UniversityPage currentUser={userData} />;
      case 'achievements':
        return <AchievementsPage />;
      default:
        return <ProfilePage userData={userData} onLogout={onLogout} onBackToHome={onBackToHome} />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 safe-bottom">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-all relative"
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
                  className={`relative z-10 transition-colors ${
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