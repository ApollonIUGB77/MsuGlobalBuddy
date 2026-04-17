import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Users, MessageCircle, Award, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingScreensProps {
  onComplete: () => void;
}

export function OnboardingScreens({ onComplete }: OnboardingScreensProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = [
    {
      icon: Users,
      title: 'Connect at MSU',
      description: 'Meet and connect with fellow Montclair State University students and build lasting friendships on campus.',
      gradient: 'from-blue-500 to-blue-600',
      illustration: '🎓',
    },
    {
      icon: MessageCircle,
      title: 'Chat Instantly',
      description: 'Stay connected with real-time messaging, group chats, and share your campus experiences.',
      gradient: 'from-green-500 to-green-600',
      illustration: '💬',
    },
    {
      icon: Award,
      title: 'Earn Achievements',
      description: 'Complete challenges, attend events, and climb the leaderboard while making new friends.',
      gradient: 'from-purple-500 to-purple-600',
      illustration: '🏆',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && currentSlide > 0) {
      handlePrevious();
    } else if (info.offset.x < -swipeThreshold && currentSlide < slides.length - 1) {
      handleNext();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end px-6 pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg"
        >
          Skip
        </motion.button>
      </div>

      {/* Slides Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center text-center w-full cursor-grab active:cursor-grabbing"
          >
            {/* Icon/Illustration */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div
                className={`w-48 h-48 bg-gradient-to-br ${currentSlideData.gradient} rounded-[3rem] flex items-center justify-center shadow-2xl relative`}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-8xl"
                >
                  {currentSlideData.illustration}
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-4 -right-4 w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl"
                >
                  <Icon className="w-12 h-12 text-gray-800" />
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-gray-900 text-3xl">{currentSlideData.title}</h2>
              <p className="text-gray-600 leading-relaxed max-w-sm">
                {currentSlideData.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mb-8">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className="transition-all"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{
                width: currentSlide === index ? 32 : 8,
                backgroundColor:
                  currentSlide === index
                    ? 'rgb(220, 38, 38)'
                    : 'rgb(229, 231, 235)',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          </motion.button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="px-8 pb-8">
        <div className="flex items-center space-x-3">
          {currentSlide > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="w-full h-14 rounded-2xl border-gray-200"
              >
                Previous
              </Button>
            </motion.div>
          )}
          <motion.div
            className={currentSlide === 0 ? 'w-full' : 'flex-1'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleNext}
              className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
            >
              {currentSlide === slides.length - 1 ? (
                'Get Started'
              ) : (
                <span className="flex items-center justify-center">
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Swipe Hint */}
      {currentSlide === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-gray-400 pointer-events-none"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              ←
            </motion.div>
            <span>Swipe to explore</span>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}