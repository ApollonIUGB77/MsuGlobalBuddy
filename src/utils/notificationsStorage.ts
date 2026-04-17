interface Notification {
  id: string;
  type: 'match' | 'message' | 'event' | 'achievement';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  userId: string;
  data?: any;
}

const STORAGE_KEY = 'msu_notifications';

export function getNotifications(userId: string): Notification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const allNotifications = JSON.parse(data);
    return allNotifications.filter((n: Notification) => n.userId === userId);
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const allNotifications = data ? JSON.parse(data) : [];
    
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };
    
    allNotifications.push(newNotification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifications));
  } catch (error) {
    console.error('Error adding notification:', error);
  }
}

export function markNotificationAsRead(userId: string, notificationId: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    
    const allNotifications = JSON.parse(data);
    const updated = allNotifications.map((n: Notification) =>
      n.id === notificationId && n.userId === userId
        ? { ...n, read: true }
        : n
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    
    const allNotifications = JSON.parse(data);
    const updated = allNotifications.map((n: Notification) =>
      n.userId === userId ? { ...n, read: true } : n
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
}

export function deleteNotification(userId: string, notificationId: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    
    const allNotifications = JSON.parse(data);
    const filtered = allNotifications.filter(
      (n: Notification) => !(n.id === notificationId && n.userId === userId)
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
}

export function getUnreadCount(userId: string): number {
  const notifications = getNotifications(userId);
  return notifications.filter(n => !n.read).length;
}

// Helper function to create common notification types
export function createMatchNotification(userId: string, buddyName: string, buddyData?: any): void {
  addNotification({
    userId,
    type: 'match',
    title: 'New Buddy Match! 🎉',
    message: `You've been matched with ${buddyName}! Start a conversation now.`,
    data: buddyData,
  });
}

export function createMessageNotification(userId: string, senderName: string, preview: string): void {
  addNotification({
    userId,
    type: 'message',
    title: `New message from ${senderName}`,
    message: preview.length > 50 ? preview.substring(0, 50) + '...' : preview,
  });
}

export function createEventNotification(userId: string, eventTitle: string, eventDate: string): void {
  addNotification({
    userId,
    type: 'event',
    title: 'Upcoming Event',
    message: `${eventTitle} is happening ${eventDate}. Don't miss out!`,
  });
}

export function createAchievementNotification(userId: string, achievementTitle: string): void {
  addNotification({
    userId,
    type: 'achievement',
    title: 'Achievement Unlocked! 🏆',
    message: `You've earned the "${achievementTitle}" badge!`,
  });
}
