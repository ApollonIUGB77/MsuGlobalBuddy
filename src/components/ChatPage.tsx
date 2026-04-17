import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, MoreVertical, Clock } from 'lucide-react';
import { Input } from './ui/input';
import { type Conversation } from '../utils/userStorage';

interface ChatPageProps {
  conversations: Conversation[];
  onOpenChat?: (chat: Conversation) => void;
}

export function ChatPage({ conversations, onOpenChat }: ChatPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Generate avatar colors and initials
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-red-500 to-pink-600',
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredChats = conversations.filter(chat =>
    chat.buddyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-gray-900 text-2xl">Messages</h1>
          <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl border-gray-200 bg-gray-50"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onOpenChat && onOpenChat(chat)}
            className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  chat.isGroup
                    ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                    : getAvatarColor(chat.buddyName)
                } text-white`}
              >
                <span>{getAvatarInitials(chat.buddyName)}</span>
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-900 truncate">{chat.buddyName}</h3>
                <span className="text-gray-500 flex-shrink-0 ml-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {chat.time || new Date(chat.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-600 truncate">{chat.message || chat.lastMessage}</p>
            </div>

            {/* Unread Badge */}
            <div className="flex-shrink-0 flex flex-col items-end space-y-2">
              {chat.unread > 0 && (
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white">{chat.unread}</span>
                </div>
              )}
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-3">
          <button className="h-12 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 flex items-center justify-center">
            All
          </button>
          <button className="h-12 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 flex items-center justify-center">
            Unread
          </button>
          <button className="h-12 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 flex items-center justify-center">
            Groups
          </button>
        </div>
      </div>
    </div>
  );
}