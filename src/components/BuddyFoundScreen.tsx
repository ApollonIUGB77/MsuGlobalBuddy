import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, Calendar, Heart, MapPin, GraduationCap, Languages, Sparkles, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ReportUserDialog } from './ReportUserDialog';

interface BuddyFoundScreenProps {
  onBack: () => void;
  onSendMessage: () => void;
  onPlanMeetup: () => void;
  buddyData: {
    name: string;
    program: string;
    level: string;
    languages: string[];
    interests: string[];
    photo?: string;
    country?: string;
    bio?: string;
    matchScore?: number;
  };
  currentUserId?: string;
}

export function BuddyFoundScreen({ onBack, onSendMessage, onPlanMeetup, buddyData, currentUserId }: BuddyFoundScreenProps) {
  const matchScore = buddyData.matchScore || 92;
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-white relative">
      {/* Fixed Header Banner with Match Score */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-br from-red-600 to-pink-600 pt-6 pb-4 px-4 rounded-b-[2rem] overflow-hidden max-w-[448px] mx-auto">
        {/* Animated Background */}
        <motion.div
          className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 hover:bg-white/30"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </motion.button>

        {/* Banner content with Match Score on the right */}
        <div className="relative flex items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3, bounce: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300 mb-1" />
            </motion.div>
            <h1 className="text-white mb-0.5 truncate">Perfect Match!</h1>
            <p className="text-white/90 text-xs truncate">You found an amazing buddy</p>
          </motion.div>

          {/* Match Score - Positioned Right + Center-Y */}
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="flex-shrink-0"
          >
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#fee2e2"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#ffffff"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 176" }}
                  animate={{ strokeDasharray: `${(matchScore / 100) * 176} 176` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white">{matchScore}%</span>
                <span className="text-white/80 text-[10px]">Match</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content with Top Padding */}
      <div className="flex-1 overflow-y-auto pt-[140px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="bg-white rounded-3xl shadow-2xl p-5 mb-6 max-w-md mx-auto"
        >
          {/* Avatar & Basic Info */}
          <div className="flex items-start space-x-4 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', bounce: 0.6 }}
              className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl"
            >
              {buddyData.name.split(' ').map(n => n[0]).join('')}
            </motion.div>
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-900 text-2xl mb-1"
              >
                {buddyData.name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-gray-600 flex items-center"
              >
                <MapPin className="w-4 h-4 mr-1" />
                {buddyData.country || 'International Student'}
              </motion.p>
            </div>
          </div>

          {/* Program Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center text-red-700 mb-2">
              <GraduationCap className="w-5 h-5 mr-2" />
              <span className="text-sm">Academic Program</span>
            </div>
            <p className="text-gray-900 mb-1">{buddyData.program}</p>
            <p className="text-gray-600 text-sm">{buddyData.level}</p>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-6"
          >
            <div className="flex items-center text-gray-700 mb-3">
              <Languages className="w-5 h-5 mr-2" />
              <span>Languages</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {buddyData.languages.map((lang, index) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                    {lang}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Common Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-6"
          >
            <div className="flex items-center text-gray-700 mb-3">
              <Heart className="w-5 h-5 mr-2" />
              <span>Common Interests</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {buddyData.interests.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
                    {interest}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          {buddyData.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-gray-50 rounded-2xl p-4"
            >
              <p className="text-gray-700 text-sm leading-relaxed">{buddyData.bio}</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="p-6 bg-white border-t border-gray-100"
      >
        <div className="flex space-x-3 mb-3">
          <Button
            onClick={onSendMessage}
            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-2xl h-14 shadow-lg shadow-red-500/30"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Send Message
          </Button>
          <Button
            onClick={onPlanMeetup}
            variant="outline"
            className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-2xl h-14"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Plan Meetup
          </Button>
        </div>
        
        {/* Report User Button */}
        {currentUserId && (
          <button
            onClick={() => setShowReportDialog(true)}
            className="w-full text-gray-500 hover:text-red-600 py-2 text-sm transition-colors"
          >
            <Flag className="w-4 h-4 inline mr-1" />
            Report or Block User
          </button>
        )}
      </motion.div>

      {/* Report User Dialog */}
      {currentUserId && (
        <ReportUserDialog
          isOpen={showReportDialog}
          onClose={() => setShowReportDialog(false)}
          reportedUserId={buddyData.name}
          reportedUserName={buddyData.name}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}