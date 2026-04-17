// © 2026 Aboubacar Sidick Meite (ApollonIUGB77) — All Rights Reserved
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreens } from './components/OnboardingScreens';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { HomeScreen } from './components/HomeScreen';
import { FindingBuddyScreen } from './components/FindingBuddyScreen';
import { BuddyFoundScreen } from './components/BuddyFoundScreen';
import { NoMatchScreen } from './components/NoMatchScreen';
import { ChatScreen } from './components/ChatScreen';
import { EventsScreen } from './components/EventsScreen';
import { ResourcesScreen } from './components/ResourcesScreen';
import { MatchesScreen } from './components/MatchesScreen';
import { MessagesListScreen } from './components/MessagesListScreen';
import { ProfilePage } from './components/ProfilePage';
import { ChatPage } from './components/ChatPage';
import { UniversityPage } from './components/UniversityPage';
import { AchievementsPage } from './components/AchievementsPage';
import { NotificationsDialog } from './components/NotificationsDialog';
import { 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  registerUser as registerUserStorage,
  setCurrentUser,
  getUserConversations,
  addConversation,
  getUserMatchedBuddies,
  addMatchedBuddy,
  type StoredUser
} from './utils/userStorage';
import { getUserRSVPEvents } from './utils/eventsStorage';
import { initializeTestAccounts } from './utils/initTestAccounts';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
  createMatchNotification,
} from './utils/notificationsStorage';

type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'login'
  | 'register'
  | 'home' 
  | 'findBuddy'
  | 'buddyFound'
  | 'noMatch'
  | 'chat' 
  | 'events'
  | 'resources'
  | 'matches'
  | 'messagesList'
  | 'profile'
  | 'chatPage'
  | 'university'
  | 'achievements';

type ActiveTab = 'home' | 'profile' | 'chat' | 'university' | 'achievements';

interface BuddyData {
  name: string;
  program: string;
  level: string;
  languages: string[];
  interests: string[];
  photo?: string;
  bio?: string;
  matchScore?: number;
  country?: string;
  commonLanguages?: string[];
  commonInterests?: string[];
}

interface ChatData {
  buddyName: string;
}

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
  studentId: string;
  country: string;
  major: string;
  year?: string;
  languages?: string[];
  interests?: string[];
  goals?: string[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentUser, setCurrentUserState] = useState<StoredUser | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [currentBuddy, setCurrentBuddy] = useState<BuddyData | null>(null);
  const [currentChat, setCurrentChat] = useState<ChatData | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refresh notifications when user changes or screen changes
  useEffect(() => {
    if (currentUser) {
      refreshNotifications();
    }
  }, [currentUser, currentScreen]);

  const refreshNotifications = () => {
    if (currentUser) {
      const userNotifications = getNotifications(currentUser.id);
      setNotifications(userNotifications);
      setUnreadCount(getUnreadCount(currentUser.id));
    }
  };

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
  };

  const handleCloseNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    if (currentUser) {
      markNotificationAsRead(currentUser.id, notificationId);
      refreshNotifications();
    }
  };

  const handleMarkAllAsRead = () => {
    if (currentUser) {
      markAllNotificationsAsRead(currentUser.id);
      refreshNotifications();
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (currentUser) {
      deleteNotification(currentUser.id, notificationId);
      refreshNotifications();
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Navigate based on notification type
    if (notification.type === 'match') {
      setIsNotificationsOpen(false);
      setCurrentScreen('matches');
    } else if (notification.type === 'message') {
      setIsNotificationsOpen(false);
      setCurrentScreen('chatPage');
    } else if (notification.type === 'event') {
      setIsNotificationsOpen(false);
      setCurrentScreen('events');
    } else if (notification.type === 'achievement') {
      setIsNotificationsOpen(false);
      setCurrentScreen('achievements');
    }
  };

  useEffect(() => {
    // Initialize test accounts on first load
    initializeTestAccounts();
    
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      // Check if user is already logged in
      const user = getCurrentUser();
      if (user) {
        setCurrentUserState(user);
        setIsFirstLogin(false);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('onboarding');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = loginUser(email, password);
    if (user) {
      setCurrentUser(user);
      setCurrentUserState(user);
      setIsFirstLogin(false);
      setCurrentScreen('home');
      setActiveTab('home');
    } else {
      alert('Invalid email or password');
    }
  };

  const handleRegister = (data: RegistrationData) => {
    try {
      const newUser = registerUserStorage({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        university: data.university,
        studentId: data.studentId,
        country: data.country,
        major: data.major,
        year: data.year || '',
        languages: data.languages || [],
        interests: data.interests || [],
        goals: data.goals || [],
      });
      
      setCurrentUser(newUser);
      setCurrentUserState(newUser);
      setIsFirstLogin(true);
      setCurrentScreen('home');
      setActiveTab('home');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      alert(errorMessage);
    }
  };

  const handleFindBuddy = () => {
    if (!currentUser) return;
    
    setCurrentScreen('findBuddy');
    
    // Simulate finding a buddy based on user preferences
    setTimeout(() => {
      // Array of diverse buddy profiles
      const buddyProfiles = [
        {
          name: 'Sarah Johnson',
          program: 'Computer Science',
          level: 'Graduate Student',
          country: 'Canada',
          languages: ['English', 'French'],
          interests: ['Coding', 'Gaming', 'Music', 'Technology'],
          bio: "Hey! I'm a CS grad student passionate about web development and AI. Love gaming in my free time and always up for coffee chats about tech!",
        },
        {
          name: 'Miguel Rodriguez',
          program: 'Business Administration',
          level: 'Undergraduate',
          country: 'Spain',
          languages: ['Spanish', 'English', 'French'],
          interests: ['Sports', 'Travel', 'Photography', 'Music'],
          bio: "International student from Madrid! Love exploring new places, playing soccer, and meeting people from different cultures. Let's connect!",
        },
        {
          name: 'Yuki Tanaka',
          program: 'Engineering',
          level: 'Graduate Student',
          country: 'Japan',
          languages: ['Japanese', 'English'],
          interests: ['Technology', 'Gaming', 'Anime', 'Cooking'],
          bio: "Engineering student who loves building things and playing video games. Always happy to help with tech stuff or grab ramen together!",
        },
        {
          name: 'Emma Wilson',
          program: 'Psychology',
          level: 'Undergraduate',
          country: 'United Kingdom',
          languages: ['English', 'German'],
          interests: ['Reading', 'Music', 'Travel', 'Fitness'],
          bio: "Psychology major with a love for books and good coffee. New to the area and looking forward to making friends and exploring campus!",
        },
        {
          name: 'Ahmed Hassan',
          program: 'Data Science',
          level: 'Graduate Student',
          country: 'Egypt',
          languages: ['Arabic', 'English', 'French'],
          interests: ['Technology', 'Sports', 'Music', 'Coding'],
          bio: "Data science enthusiast who loves working on AI projects. Also into basketball and Middle Eastern cuisine. Let's connect!",
        },
      ];

      // Calculate match scores based on user's languages and interests
      const userLanguages = currentUser.languages || [];
      const userInterests = currentUser.interests || [];
      
      // Get already matched buddies to avoid duplicates
      const alreadyMatched = getUserMatchedBuddies(currentUser.id);
      
      const matchedBuddies = buddyProfiles.map(buddy => {
        // Find common languages
        const commonLanguages = buddy.languages.filter(lang => 
          userLanguages.includes(lang)
        );
        
        // Find common interests
        const commonInterests = buddy.interests.filter(interest => 
          userInterests.includes(interest)
        );
        
        // Calculate match score (0-100)
        const languageWeight = 0.4;
        const interestWeight = 0.6;
        
        const languageScore = userLanguages.length > 0 && buddy.languages.length > 0
          ? (commonLanguages.length / Math.max(userLanguages.length, buddy.languages.length)) * 100 
          : 0;
          
        const interestScore = userInterests.length > 0 && buddy.interests.length > 0
          ? (commonInterests.length / Math.max(userInterests.length, buddy.interests.length)) * 100
          : 0;
        
        const matchScore = Math.round(
          languageWeight * languageScore + interestWeight * interestScore
        );
        
        return {
          ...buddy,
          matchScore,
          commonLanguages,
          commonInterests
        };
      });

      // Filter out already matched buddies
      const availableBuddies = matchedBuddies.filter(buddy => 
        !alreadyMatched.includes(buddy.name)
      );
      
      // Filter buddies with match score >= 50% and sort by match score
      let validMatches = availableBuddies
        .filter(buddy => buddy.matchScore >= 50)
        .sort((a, b) => b.matchScore - a.matchScore);
      
      // Check if we have valid matches
      if (validMatches.length === 0) {
        // No match found (either all buddies matched or score < 50%)
        setCurrentScreen('noMatch');
        return;
      }
      
      // Select the best match
      const selectedBuddy = validMatches[0];
      
      // Add to matched buddies
      addMatchedBuddy(currentUser.id, selectedBuddy.name);
      
      // Create notification for the new match
      createMatchNotification(currentUser.id, selectedBuddy.name, selectedBuddy);
      
      // Mark that user is no longer first login after finding first buddy
      if (isFirstLogin) {
        setIsFirstLogin(false);
      }
      
      setCurrentBuddy(selectedBuddy);
      setCurrentScreen('buddyFound');
    }, 3000);
  };

  const handleSendMessage = () => {
    if (currentBuddy && currentUser) {
      // Add conversation to user's session
      addConversation(currentUser.id, currentBuddy.name);
      setCurrentScreen('chat');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setCurrentBuddy(null);
    setIsFirstLogin(false);
    setCurrentScreen('login');
    setActiveTab('home');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'profile') {
      setCurrentScreen('profile');
    } else if (tab === 'chat') {
      setCurrentScreen('chatPage');
    } else if (tab === 'university') {
      setCurrentScreen('university');
    } else if (tab === 'achievements') {
      setCurrentScreen('achievements');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      
      case 'onboarding':
        return <OnboardingScreens onComplete={() => setCurrentScreen('login')} />;
      
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSignUp={() => setCurrentScreen('register')}
          />
        );
      
      case 'register':
        return (
          <RegisterScreen
            onRegister={handleRegister}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      
      case 'home':
        return (
          <HomeScreen
            userName={currentUser?.firstName}
            isFirstLogin={isFirstLogin}
            userConversations={currentUser ? getUserConversations(currentUser.id) : []}
            userMatchedBuddies={currentUser ? getUserMatchedBuddies(currentUser.id) : []}
            unreadNotificationsCount={unreadCount}
            onFindBuddy={handleFindBuddy}
            onViewEvents={() => setCurrentScreen('events')}
            onOpenResources={() => setCurrentScreen('resources')}
            onOpenMatches={() => setCurrentScreen('matches')}
            onOpenMessages={() => setCurrentScreen('messagesList')}
            onOpenChat={() => setCurrentScreen('chatPage')}
            onOpenNotifications={handleOpenNotifications}
            onTabChange={handleTabChange}
            activeTab={activeTab}
          />
        );
      
      case 'findBuddy':
        return <FindingBuddyScreen />;
      
      case 'buddyFound':
        return currentBuddy ? (
          <BuddyFoundScreen
            onBack={handleBackToHome}
            onSendMessage={handleSendMessage}
            onPlanMeetup={() => setCurrentScreen('events')}
            buddyData={currentBuddy}
            currentUserId={currentUser?.id}
          />
        ) : null;
      
      case 'noMatch':
        return <NoMatchScreen onBack={handleBackToHome} onTryAgain={handleFindBuddy} />;
      
      case 'chat':
        return (
          <ChatScreen
            onBack={() => {
              setCurrentChat(null);
              setCurrentScreen('chatPage');
            }}
            buddyName={currentChat?.buddyName || currentBuddy?.name || 'Buddy'}
            currentUserId={currentUser?.id}
          />
        );
      
      case 'events':
        return (
          <EventsScreen
            onBack={handleBackToHome}
            currentUser={currentUser}
          />
        );
      
      case 'resources':
        return (
          <ResourcesScreen
            onBack={handleBackToHome}
          />
        );
      
      case 'matches':
        return currentUser ? (
          <MatchesScreen
            userLanguages={currentUser.languages}
            userInterests={currentUser.interests}
            matchedBuddies={getUserMatchedBuddies(currentUser.id)}
            onBack={handleBackToHome}
            onViewMatch={(match) => {
              setCurrentBuddy(match);
              setCurrentChat(null);
              setCurrentScreen('buddyFound');
            }}
            onMessage={(match) => {
              setCurrentChat({ buddyName: match.name });
              setCurrentBuddy(match);
              if (currentUser) {
                addConversation(currentUser.id, match.name);
              }
              setCurrentScreen('chat');
            }}
          />
        ) : null;
      
      case 'messagesList':
        return currentUser ? (
          <MessagesListScreen
            conversations={getUserConversations(currentUser.id)}
            onBack={handleBackToHome}
            onOpenChat={(conversation) => {
              setCurrentChat(conversation);
              setCurrentScreen('chat');
            }}
          />
        ) : null;
      
      case 'profile':
        return currentUser ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ProfilePage 
                userData={{
                  id: currentUser.id,
                  firstName: currentUser.firstName,
                  lastName: currentUser.lastName,
                  email: currentUser.email,
                  phone: currentUser.phone,
                  university: currentUser.university,
                  studentId: currentUser.studentId,
                  country: currentUser.country,
                  major: currentUser.major,
                  year: currentUser.year,
                  languages: currentUser.languages,
                  interests: currentUser.interests,
                }}
                userMatchedBuddies={getUserMatchedBuddies(currentUser.id).length}
                userEventsAttended={getUserRSVPEvents(currentUser.id).length}
                onLogout={handleLogout}
              />
            </div>
            {/* Bottom Navigation */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-around">
                {renderBottomNav()}
              </div>
            </div>
          </div>
        ) : null;
      
      case 'chatPage':
        return currentUser ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ChatPage 
                conversations={getUserConversations(currentUser.id)}
                onOpenChat={(chat) => {
                  setCurrentChat(chat);
                  setCurrentScreen('chat');
                }} 
              />
            </div>
            {/* Bottom Navigation */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-around">
                {renderBottomNav()}
              </div>
            </div>
          </div>
        ) : null;
      
      case 'university':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <UniversityPage currentUser={currentUser} />
            </div>
            {/* Bottom Navigation */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-around">
                {renderBottomNav()}
              </div>
            </div>
          </div>
        );
      
      case 'achievements':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <AchievementsPage currentUser={currentUser} />
            </div>
            {/* Bottom Navigation */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-around">
                {renderBottomNav()}
              </div>
            </div>
          </div>
        );
      
      default:
        return <SplashScreen />;
    }
  };

  const renderBottomNav = () => {
    const tabs = [
      { id: 'home' as ActiveTab, icon: '🏠', label: 'Home' },
      { id: 'profile' as ActiveTab, icon: '👤', label: 'Profile' },
      { id: 'chat' as ActiveTab, icon: '💬', label: 'Chat' },
      { id: 'university' as ActiveTab, icon: '🎓', label: 'University' },
      { id: 'achievements' as ActiveTab, icon: '🏆', label: 'Rewards' },
    ];

    return tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className="flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all relative"
        >
          {isActive && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-red-50 rounded-xl"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <div className="relative z-10">
            <span className="text-2xl">{tab.icon}</span>
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
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-center" expand={false} richColors />
      <div className="w-full max-w-md h-[844px] bg-white shadow-2xl rounded-3xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
        
        {/* Notifications Dialog */}
        <NotificationsDialog
          isOpen={isNotificationsOpen}
          onClose={handleCloseNotifications}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteNotification={handleDeleteNotification}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </div>
  );
}