// User storage management using localStorage

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
  studentId: string;
  country: string;
  major: string;
  year: string;
  languages: string[];
  interests: string[];
  goals: string[];
  createdAt: number;
}

export interface Conversation {
  id: string;
  buddyName: string;
  lastMessage: string;
  timestamp: number;
  unread: number;
  // Optional UI properties
  isGroup?: boolean;
  online?: boolean;
  message?: string;
  time?: string;
}

export interface UserSession {
  userId: string;
  conversations: Conversation[];
  matchedBuddies: string[];
}

const USERS_KEY = 'msu_buddy_users';
const CURRENT_USER_KEY = 'msu_buddy_current_user';
const USER_SESSIONS_KEY = 'msu_buddy_sessions';

// Get all users
export function getAllUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Save all users
function saveAllUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register a new user
export function registerUser(userData: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const users = getAllUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    throw new Error('Email already exists');
  }
  
  const newUser: StoredUser = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  
  users.push(newUser);
  saveAllUsers(users);
  
  // Initialize empty session for new user
  const sessions = getUserSessions();
  sessions[newUser.id] = {
    userId: newUser.id,
    conversations: [],
    matchedBuddies: [],
  };
  saveUserSessions(sessions);
  
  return newUser;
}

// Login user
export function loginUser(email: string, password: string): StoredUser | null {
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}

// Set current user
export function setCurrentUser(user: StoredUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Get current user
export function getCurrentUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// Logout current user
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Get all user sessions
function getUserSessions(): Record<string, UserSession> {
  if (typeof window === 'undefined') return {};
  const sessionsJson = localStorage.getItem(USER_SESSIONS_KEY);
  return sessionsJson ? JSON.parse(sessionsJson) : {};
}

// Save all user sessions
function saveUserSessions(sessions: Record<string, UserSession>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_SESSIONS_KEY, JSON.stringify(sessions));
}

// Get session for specific user
export function getUserSession(userId: string): UserSession {
  const sessions = getUserSessions();
  if (!sessions[userId]) {
    sessions[userId] = {
      userId,
      conversations: [],
      matchedBuddies: [],
    };
    saveUserSessions(sessions);
  }
  return sessions[userId];
}

// Add conversation for user
export function addConversation(userId: string, buddyName: string): void {
  const sessions = getUserSessions();
  const session = sessions[userId] || {
    userId,
    conversations: [],
    matchedBuddies: [],
  };
  
  // Check if conversation already exists
  if (!session.conversations.find(c => c.buddyName === buddyName)) {
    // Generate unique ID with timestamp and random string
    const uniqueId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    session.conversations.push({
      id: uniqueId,
      buddyName,
      lastMessage: 'Start your conversation!',
      timestamp: Date.now(),
      unread: 0,
    });
    sessions[userId] = session;
    saveUserSessions(sessions);
  }
}

// Add matched buddy for user
export function addMatchedBuddy(userId: string, buddyName: string): void {
  const sessions = getUserSessions();
  const session = sessions[userId] || {
    userId,
    conversations: [],
    matchedBuddies: [],
  };
  
  if (!session.matchedBuddies.includes(buddyName)) {
    session.matchedBuddies.push(buddyName);
    sessions[userId] = session;
    saveUserSessions(sessions);
  }
}

// Get user conversations
export function getUserConversations(userId: string): Conversation[] {
  const session = getUserSession(userId);
  
  // Fix duplicate IDs if any exist
  const conversations = session.conversations;
  const seenIds = new Set<string>();
  let counter = 0;
  
  const fixedConversations = conversations.map((conv) => {
    // If ID is already seen or doesn't have proper format, regenerate it
    if (seenIds.has(conv.id) || !conv.id.includes('_')) {
      counter++;
      const newId = `conv_${Date.now()}_${counter}_${Math.random().toString(36).substring(2, 11)}`;
      seenIds.add(newId);
      return { ...conv, id: newId };
    }
    seenIds.add(conv.id);
    return conv;
  });
  
  // Save fixed conversations if any were changed
  if (JSON.stringify(conversations) !== JSON.stringify(fixedConversations)) {
    const sessions = getUserSessions();
    if (sessions[userId]) {
      sessions[userId].conversations = fixedConversations;
      saveUserSessions(sessions);
    }
  }
  
  return fixedConversations;
}

// Get user matched buddies
export function getUserMatchedBuddies(userId: string): string[] {
  const session = getUserSession(userId);
  return session.matchedBuddies;
}

// Reset all matched buddies for all users (for testing purposes)
export function resetAllMatches(): void {
  if (typeof window === 'undefined') return;
  const sessions = getUserSessions();
  
  // Reset matchedBuddies array for all users
  Object.keys(sessions).forEach(userId => {
    sessions[userId].matchedBuddies = [];
  });
  
  saveUserSessions(sessions);
}