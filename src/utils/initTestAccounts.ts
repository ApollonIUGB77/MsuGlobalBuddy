// Initialize test accounts for demo purposes
import { registerUser, addConversation, addMatchedBuddy, getAllUsers } from './userStorage';

export function initializeTestAccounts() {
  const users = getAllUsers();
  
  // Check if test accounts already exist
  const hasNewAccount = users.find(u => u.email === 'nouveau@msu.edu');
  const hasOldAccount = users.find(u => u.email === 'ancien@msu.edu');
  
  if (hasNewAccount && hasOldAccount) {
    console.log('Test accounts already initialized');
    return;
  }
  
  // Create NEW ACCOUNT (empty state)
  if (!hasNewAccount) {
    try {
      const newUser = registerUser({
        email: 'nouveau@msu.edu',
        password: 'password123',
        firstName: 'Alex',
        lastName: 'Nouveau',
        phone: '+1 (973) 555-0101',
        university: 'Montclair State University',
        studentId: 'MSU001234',
        country: 'United States',
        major: 'Business Administration',
        year: 'Freshman',
        languages: ['English', 'Spanish'],
        interests: ['Sports', 'Music', 'Travel'],
        goals: ['Make new friends', 'Explore campus'],
      });
      console.log('✅ New test account created:', newUser.email);
    } catch (error) {
      console.error('Failed to create new account:', error);
    }
  }
  
  // Create OLD ACCOUNT (with data and activity)
  if (!hasOldAccount) {
    try {
      const oldUser = registerUser({
        email: 'ancien@msu.edu',
        password: 'password123',
        firstName: 'Sophia',
        lastName: 'Martinez',
        phone: '+1 (973) 555-0202',
        university: 'Montclair State University',
        studentId: 'MSU005678',
        country: 'Spain',
        major: 'Computer Science',
        year: 'Junior',
        languages: ['English', 'Spanish', 'French'],
        interests: ['Coding', 'Gaming', 'Music', 'Technology', 'Travel'],
        goals: ['Help international students', 'Learn new technologies', 'Network with peers'],
      });
      
      // Add matched buddies to old account
      addMatchedBuddy(oldUser.id, 'Sarah Johnson');
      addMatchedBuddy(oldUser.id, 'Miguel Rodriguez');
      addMatchedBuddy(oldUser.id, 'Yuki Tanaka');
      addMatchedBuddy(oldUser.id, 'Emma Wilson');
      
      // Add conversations to old account
      addConversation(oldUser.id, 'Sarah Johnson');
      addConversation(oldUser.id, 'Miguel Rodriguez');
      addConversation(oldUser.id, 'Yuki Tanaka');
      
      console.log('✅ Old test account created with data:', oldUser.email);
      console.log('   - 4 matched buddies');
      console.log('   - 3 active conversations');
    } catch (error) {
      console.error('Failed to create old account:', error);
    }
  }
}
