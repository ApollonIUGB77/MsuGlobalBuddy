import { motion } from 'motion/react';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from './ui/input';

interface MessagesListScreenProps {
  conversations: any[];
  onBack: () => void;
  onOpenChat: (conversation: any) => void;
}

export function MessagesListScreen({ conversations, onBack, onOpenChat }: MessagesListScreenProps) {
  // Generate avatar colors based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-red-500 to-pink-600',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 pt-12 pb-6 px-6 rounded-b-[2.5rem]">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 hover:bg-white/30"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl">Messages</h1>
            <p className="text-red-100">{conversations.filter(c => c.unread > 0).length} unread</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search messages..."
            className="pl-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-red-200"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Start a conversation with your buddies!</p>
          </div>
        ) : (
          conversations.map((conversation, index) => (
            <motion.button
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onOpenChat(conversation)}
              className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="relative">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(conversation.buddyName)} rounded-2xl flex items-center justify-center text-white shrink-0`}
                >
                  {getAvatarInitials(conversation.buddyName)}
                </div>
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-900">{conversation.buddyName}</h3>
                  <span className="text-gray-500 text-sm">
                    {new Date(conversation.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${conversation.unread > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs ml-2 shrink-0">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}