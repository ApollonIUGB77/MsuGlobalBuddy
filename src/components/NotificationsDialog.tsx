import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, Calendar, Award, CheckCheck, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'match' | 'message' | 'event' | 'achievement';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

interface NotificationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationsDialog({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNotificationClick,
}: NotificationsDialogProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredNotifications = selectedTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-x-4 top-20 max-w-md mx-auto bg-white rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white text-xl mb-1">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-red-100 text-sm">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 pt-4">
              <button
                onClick={() => setSelectedTab('all')}
                className={`flex-1 pb-3 text-center transition-colors relative ${
                  selectedTab === 'all' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                All
                {selectedTab === 'all' && (
                  <motion.div
                    layoutId="notificationTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                  />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('unread')}
                className={`flex-1 pb-3 text-center transition-colors relative ${
                  selectedTab === 'unread' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
                {selectedTab === 'unread' && (
                  <motion.div
                    layoutId="notificationTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                  />
                )}
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="px-6 py-3 border-b border-gray-100">
                <button
                  onClick={onMarkAllAsRead}
                  className="text-red-600 text-sm flex items-center gap-2 hover:text-red-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCheck className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-900 mb-2">All caught up!</p>
                  <p className="text-gray-500 text-sm">
                    {selectedTab === 'unread' 
                      ? 'No unread notifications' 
                      : 'You have no notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'match' ? 'bg-pink-100' :
                          notification.type === 'message' ? 'bg-blue-100' :
                          notification.type === 'event' ? 'bg-purple-100' :
                          'bg-yellow-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-400">{formatTimestamp(notification.timestamp)}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
