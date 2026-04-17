import { motion } from 'motion/react';
import { ArrowLeft, Users, RefreshCw, Heart } from 'lucide-react';
import { Button } from './ui/button';

interface NoMatchScreenProps {
  onBack: () => void;
  onTryAgain: () => void;
}

export function NoMatchScreen({ onBack, onTryAgain }: NoMatchScreenProps) {
  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-gray-600 to-gray-700 pt-8 pb-20 px-6 rounded-b-[3rem] overflow-hidden">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 hover:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3, bounce: 0.5 }}
          >
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          </motion.div>
          <h1 className="text-white text-2xl mb-1">No Match Yet</h1>
          <p className="text-white/90">Don't worry, we'll find you a great buddy!</p>
        </motion.div>
      </div>

      {/* Content Card */}
      <div className="flex-1 flex items-center justify-center px-6 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', bounce: 0.6 }}
            className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
          >
            <Heart className="w-16 h-16 text-gray-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-gray-900 text-2xl text-center mb-4"
          >
            No compatible match found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-gray-600 text-center mb-8 leading-relaxed"
          >
            We couldn't find a buddy with enough common interests or languages right now. 
            Try again later or update your profile to increase your chances!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-3"
          >
            <Button
              onClick={onTryAgain}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-2xl h-14 text-lg shadow-lg shadow-red-500/30"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl h-14"
            >
              Back to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
