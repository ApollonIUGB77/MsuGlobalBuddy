import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Smile, Paperclip, MoreVertical, Phone, Video, Flag, Shield } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { moderateContent, getModerationMessage, shouldBlockMessage } from '../utils/contentModeration';
import { ReportUserDialog } from './ReportUserDialog';
import { blockUser } from '../utils/safetyStorage';

interface ChatScreenProps {
  onBack: () => void;
  buddyName: string;
  currentUserId?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'buddy';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

// ── Helpers for message persistence ──────────────────────────────────────────
const getChatKey = (userId: string | undefined, buddy: string) =>
  `chat_${userId ?? 'guest'}_${buddy.replace(/\s+/g, '_').toLowerCase()}`;

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Hey! I saw we got matched. I'm really excited to meet you! 😊", sender: 'buddy', timestamp: '10:30 AM', status: 'read' },
  { id: 2, text: "Hi! Yes, I'm excited too! I saw we have a lot in common.", sender: 'me', timestamp: '10:32 AM', status: 'read' },
  { id: 3, text: "Absolutely! I noticed you're interested in coding. What languages do you work with?", sender: 'buddy', timestamp: '10:33 AM', status: 'read' },
  { id: 4, text: "I mainly work with JavaScript and Python. Also learning React right now. What about you?", sender: 'me', timestamp: '10:35 AM', status: 'read' },
  { id: 5, text: "Nice! I'm into Python and Java. We should work on a project together sometime!", sender: 'buddy', timestamp: '10:36 AM', status: 'read' },
  { id: 6, text: "That would be awesome! Are you free this weekend to meet up?", sender: 'me', timestamp: '10:38 AM', status: 'read' },
  { id: 7, text: "Yeah! How about Saturday afternoon? We could grab coffee on campus.", sender: 'buddy', timestamp: '10:40 AM', status: 'read' },
];

export function ChatScreen({ onBack, buddyName, currentUserId }: ChatScreenProps) {
  const chatKey = getChatKey(currentUserId, buddyName);

  const [message, setMessage] = useState('');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ── Load messages from localStorage (falls back to initial messages) ──────
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(chatKey);
      return saved ? (JSON.parse(saved) as Message[]) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Persist messages to localStorage whenever they change ────────────────
  useEffect(() => {
    try {
      localStorage.setItem(chatKey, JSON.stringify(messages));
    } catch {
      // localStorage quota exceeded — silently ignore
    }
  }, [messages, chatKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Moderate content before sending
      const moderationResult = moderateContent(message);
      
      // Block message if it contains inappropriate content
      if (shouldBlockMessage(message)) {
        toast.error(getModerationMessage(moderationResult));
        return;
      }
      
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate buddy typing
      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      // Simulate buddy response
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "That sounds great! I'm looking forward to it! 🎉",
          "Awesome! Let me know when you're free.",
          "Perfect! Can't wait!",
          "I'm down! That works for me.",
          "Sounds like a plan! See you then! 👍",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const buddyMessage: Message = {
          id: messages.length + 2,
          text: randomResponse,
          sender: 'buddy',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };
        setMessages(prev => [...prev, buddyMessage]);
      }, 3000);

      // Update message status
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
          )
        );
      }, 500);

      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
          )
        );
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBlockUser = () => {
    if (!currentUserId) return;
    
    blockUser(currentUserId, buddyName, 'Blocked from chat');
    setShowMenu(false);
    toast.success(`${buddyName} has been blocked successfully`);
    
    // Optionally redirect back after blocking
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-red-600 to-pink-600 pt-12 pb-4 px-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                  {buddyName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-red-600" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-white">{buddyName}</h2>
                <p className="text-red-100 text-sm">Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30">
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30">
              <Video className="w-5 h-5 text-white" />
            </button>
            <button
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-2xl px-4 py-3 ${
                    msg.sender === 'me'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </motion.div>
                <div className={`flex items-center mt-1 space-x-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <p className="text-xs text-gray-500">{msg.timestamp}</p>
                  {msg.sender === 'me' && msg.status && (
                    <span className="text-xs text-gray-500">
                      {msg.status === 'sent' && '✓'}
                      {msg.status === 'delivered' && '✓✓'}
                      {msg.status === 'read' && <span className="text-blue-500">✓✓</span>}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex items-end space-x-3">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 mb-1">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="h-12 rounded-2xl pr-12 border-gray-200 focus:border-red-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              message.trim()
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30'
                : 'bg-gray-200 text-gray-400'
            } transition-all`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Menu */}
      {showMenu && (
        <div className="absolute right-10 top-20 bg-white shadow-lg rounded-lg z-50">
          <button
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => setShowReportDialog(true)}
          >
            <Flag className="w-5 h-5 mr-2 inline-block" />
            Report User
          </button>
          <button
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={handleBlockUser}
          >
            <Shield className="w-5 h-5 mr-2 inline-block" />
            Block User
          </button>
        </div>
      )}

      {/* Report User Dialog */}
      {currentUserId && (
        <ReportUserDialog
          isOpen={showReportDialog}
          onClose={() => setShowReportDialog(false)}
          reportedUserId={buddyName}
          reportedUserName={buddyName}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}