import { motion } from 'motion/react';
import { Users, Sparkles, Heart, Globe } from 'lucide-react';

export function FindingBuddyScreen() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-red-600 via-red-700 to-pink-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-32 right-10 w-32 h-32 bg-white/10 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute top-1/3 right-20 w-16 h-16 bg-white/10 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative"
      >
        {/* Pulsing Ring */}
        <motion.div
          className="absolute inset-0 -m-8"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          <div className="w-full h-full rounded-full border-4 border-white" />
        </motion.div>

        {/* Center Icon */}
        <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Users className="w-16 h-16 text-red-600" />
          </motion.div>
        </div>

        {/* Orbiting Icons */}
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            style={{ originX: 0.5, originY: 0.5 }}
            animate={{
              rotate: [index * 90, index * 90 + 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <motion.div
              className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
              style={{
                x: -90,
                y: -6,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5
              }}
            >
              {index === 0 && <Heart className="w-6 h-6 text-pink-500" />}
              {index === 1 && <Sparkles className="w-6 h-6 text-yellow-500" />}
              {index === 2 && <Globe className="w-6 h-6 text-blue-500" />}
              {index === 3 && <Users className="w-6 h-6 text-purple-500" />}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-20 text-center"
      >
        <motion.h2
          className="text-white text-3xl mb-4"
          animate={{
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Finding Your Buddy...
        </motion.h2>
        <p className="text-white/90 text-lg mb-6">
          Matching based on your interests
        </p>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>

        {/* Status Messages */}
        <motion.div
          className="mt-8 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-white/80"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            ✓ Analyzing your interests...
          </motion.p>
          <motion.p
            className="text-white/80"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            ✓ Searching compatible buddies...
          </motion.p>
          <motion.p
            className="text-white/80"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7 }}
          >
            ✓ Found perfect match!
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
