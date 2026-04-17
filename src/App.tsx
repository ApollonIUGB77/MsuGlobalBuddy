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

    setTimeout(() => {
      // ── Extended diverse buddy profiles pool ──────────────────────────────
      const staticProfiles = [
        { name: 'Sarah Johnson',      program: 'Computer Science',        level: 'Graduate Student',    country: 'Canada',        languages: ['English', 'French'],              interests: ['Coding', 'Gaming', 'Music', 'Technology'],           bio: "CS grad student passionate about web dev & AI. Always up for coffee chats about tech!" },
        { name: 'Miguel Rodriguez',   program: 'Business Administration', level: 'Undergraduate',       country: 'Spain',         languages: ['Spanish', 'English', 'French'],    interests: ['Sports', 'Travel', 'Photography', 'Music'],           bio: "International student from Madrid. Love soccer, exploring and meeting people from all cultures!" },
        { name: 'Yuki Tanaka',        program: 'Engineering',             level: 'Graduate Student',    country: 'Japan',         languages: ['Japanese', 'English'],             interests: ['Technology', 'Gaming', 'Cooking', 'Music'],           bio: "Engineering student who loves building things. Happy to help with tech or grab ramen!" },
        { name: 'Emma Wilson',        program: 'Psychology',              level: 'Undergraduate',       country: 'United Kingdom', languages: ['English', 'German'],              interests: ['Reading', 'Music', 'Travel', 'Fitness'],              bio: "Psych major with a love for books and coffee. Looking forward to making friends on campus!" },
        { name: 'Ahmed Hassan',       program: 'Data Science',            level: 'Graduate Student',    country: 'Egypt',         languages: ['Arabic', 'English', 'French'],    interests: ['Technology', 'Sports', 'Music', 'Coding'],            bio: "Data science enthusiast working on AI projects. Also into basketball — let's connect!" },
        { name: 'Amara Diallo',       program: 'Public Health',           level: 'Graduate Student',    country: 'Senegal',       languages: ['French', 'English', 'Wolof'],     interests: ['Sports', 'Travel', 'Cooking', 'Reading'],             bio: "Public health student from Dakar. Passionate about global health and African culture!" },
        { name: 'Lin Wei',            program: 'Computer Science',        level: 'Graduate Student',    country: 'China',         languages: ['Chinese', 'English'],             interests: ['Coding', 'Technology', 'Gaming', 'Photography'],      bio: "CS student specializing in machine learning. Love photography and board games on weekends!" },
        { name: 'Fatima Al-Rashidi',  program: 'Cybersecurity',           level: 'Graduate Student',    country: 'Saudi Arabia',  languages: ['Arabic', 'English'],             interests: ['Technology', 'Coding', 'Reading', 'Travel'],          bio: "Cybersecurity student passionate about ethical hacking and network defense. Tea > coffee!" },
        { name: 'Carlos Mendoza',     program: 'Electrical Engineering',  level: 'Undergraduate',       country: 'Mexico',        languages: ['Spanish', 'English'],             interests: ['Technology', 'Music', 'Sports', 'Cooking'],           bio: "EE student from Guadalajara. Play guitar, love hiking and always happy to help with circuits!" },
        { name: 'Priya Patel',        program: 'Information Technology',  level: 'Graduate Student',    country: 'India',         languages: ['Hindi', 'English'],               interests: ['Coding', 'Technology', 'Cooking', 'Fitness'],         bio: "IT grad student interested in cloud computing. Big foodie — love cooking Indian dishes!" },
        { name: 'Kofi Asante',        program: 'Business Administration', level: 'Graduate Student',    country: 'Ghana',         languages: ['English', 'Twi', 'French'],       interests: ['Sports', 'Music', 'Travel', 'Photography'],           bio: "MBA student from Accra. Passionate about entrepreneurship in Africa. Football & Afrobeats!" },
        { name: 'Mei-Ling Chen',      program: 'Data Science',            level: 'Undergraduate',       country: 'Taiwan',        languages: ['Chinese', 'English', 'Japanese'], interests: ['Technology', 'Reading', 'Photography', 'Music'],       bio: "Data science undergrad passionate about visualization and statistics. Love bubble tea!" },
        { name: 'Ivan Petrov',        program: 'Mathematics',             level: 'Graduate Student',    country: 'Russia',        languages: ['Russian', 'English'],             interests: ['Reading', 'Gaming', 'Coding', 'Fitness'],             bio: "Math PhD student who loves chess, algorithms, and long runs. Always up for intellectual talks!" },
        { name: 'Aisha Mwangi',       program: 'Public Policy',           level: 'Graduate Student',    country: 'Kenya',         languages: ['Swahili', 'English', 'French'],   interests: ['Travel', 'Reading', 'Music', 'Sports'],               bio: "Policy student from Nairobi focused on sustainable development. Love hiking and African lit!" },
        { name: 'Diego Ferreira',     program: 'Computer Science',        level: 'Graduate Student',    country: 'Brazil',        languages: ['Portuguese', 'English', 'Spanish'],interests: ['Coding', 'Sports', 'Music', 'Gaming'],               bio: "CS student from São Paulo into full-stack development. Passionate about football and samba!" },
        { name: 'Hana Kim',           program: 'Psychology',              level: 'Undergraduate',       country: 'South Korea',   languages: ['Korean', 'English'],             interests: ['Music', 'Fitness', 'Reading', 'Photography'],         bio: "Psych undergrad from Seoul. K-pop enthusiast, yoga lover, and always down for a good book!" },
        { name: 'Tariq Benali',       program: 'Engineering',             level: 'Graduate Student',    country: 'Morocco',       languages: ['Arabic', 'French', 'English'],    interests: ['Technology', 'Sports', 'Travel', 'Cooking'],          bio: "Mechanical engineer from Casablanca. Football crazy, love couscous and learning new cultures!" },
        { name: 'Anastasia Volkova',  program: 'Cybersecurity',           level: 'Graduate Student',    country: 'Ukraine',       languages: ['Ukrainian', 'Russian', 'English'], interests: ['Coding', 'Technology', 'Reading', 'Fitness'],         bio: "Cybersecurity student focused on malware analysis. Love running, sci-fi books and CTF challenges!" },
        { name: 'Ravi Subramaniam',   program: 'Data Science',            level: 'Graduate Student',    country: 'India',         languages: ['Tamil', 'English', 'Hindi'],      interests: ['Technology', 'Coding', 'Music', 'Travel'],            bio: "Data scientist in training. Classical music lover, cricket fan, always exploring new datasets!" },
        { name: 'Sophie Lefebvre',    program: 'Business Administration', level: 'Undergraduate',       country: 'France',        languages: ['French', 'English', 'Spanish'],   interests: ['Travel', 'Photography', 'Music', 'Cooking'],          bio: "Business student from Lyon. Passionate about sustainable fashion and exploring new cuisines!" },
      ];

      // ── Pull real registered users into the pool ─────────────────────────
      const { getAllUsers } = require('./utils/userStorage');
      const realUsers = (getAllUsers() as any[])
        .filter((u: any) => u.id !== currentUser.id)
        .map((u: any) => ({
          name: `${u.firstName} ${u.lastName}`,
          program: u.major || 'General Studies',
          level: u.year || 'Student',
          country: u.country || 'International',
          languages: u.languages || ['English'],
          interests: u.interests || [],
          bio: `${u.major || 'Student'} at Montclair State University. ${u.country ? `From ${u.country}.` : ''}`,
          isRealUser: true,
        }));

      const allProfiles = [...staticProfiles, ...realUsers];

      // ── Scoring algorithm ────────────────────────────────────────────────
      const userLanguages = currentUser.languages || [];
      const userInterests = currentUser.interests || [];
      const userMajor     = (currentUser as any).major || '';
      const alreadyMatched = getUserMatchedBuddies(currentUser.id);

      const scored = allProfiles
        .filter(b => !alreadyMatched.includes(b.name))
        .map(buddy => {
          const commonLanguages = buddy.languages.filter((l: string) => userLanguages.includes(l));
          const commonInterests = buddy.interests.filter((i: string) => userInterests.includes(i));

          const langScore     = userLanguages.length > 0
            ? (commonLanguages.length / Math.max(userLanguages.length, buddy.languages.length)) * 100
            : 30; // default if no languages set

          const interestScore = userInterests.length > 0
            ? (commonInterests.length / Math.max(userInterests.length, buddy.interests.length)) * 100
            : 20;

          const majorScore = userMajor && buddy.program
            ? (buddy.program.toLowerCase().includes(userMajor.toLowerCase()) ||
               userMajor.toLowerCase().includes(buddy.program.toLowerCase()) ? 100 : 0)
            : 0;

          // Weights: interests 45%, languages 35%, major 20%
          const matchScore = Math.round(0.35 * langScore + 0.45 * interestScore + 0.20 * majorScore);

          return { ...buddy, matchScore, commonLanguages, commonInterests };
        });

      // Sort by score, take best matches (threshold lowered to 25% for richer pool)
      const validMatches = scored
        .filter(b => b.matchScore >= 25)
        .sort((a, b) => b.matchScore - a.matchScore);

      if (validMatches.length === 0) {
        // If still nothing, pick any unmatched profile
        const fallback = scored.sort((a, b) => b.matchScore - a.matchScore)[0];
        if (!fallback) { setCurrentScreen('noMatch'); return; }
        addMatchedBuddy(currentUser.id, fallback.name);
        createMatchNotification(currentUser.id, fallback.name, fallback);
        setCurrentBuddy(fallback);
        setCurrentScreen('buddyFound');
        return;
      }

      const selectedBuddy = validMatches[0];
      addMatchedBuddy(currentUser.id, selectedBuddy.name);
      createMatchNotification(currentUser.id, selectedBuddy.name, selectedBuddy);
      if (isFirstLogin) setIsFirstLogin(false);
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