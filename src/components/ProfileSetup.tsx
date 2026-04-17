import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ProfileSetupProps {
  userData: any;
  onComplete: (data: any) => void;
}

export function ProfileSetup({ userData, onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const interestOptions = [
    'Sports',
    'Music',
    'Art',
    'Technology',
    'Travel',
    'Food',
    'Reading',
    'Gaming',
    'Photography',
    'Movies',
    'Fitness',
    'Cooking',
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Arabic',
    'Portuguese',
    'Russian',
    'Italian',
  ];

  const toggleSelection = (item: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleComplete = () => {
    onComplete({
      ...userData,
      bio,
      interests,
      languages,
      profileComplete: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full flex flex-col bg-white"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 pt-12 pb-8 px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <span className="text-white">Step {step}/3</span>
        </div>
        <h1 className="text-white text-2xl">Complete Your Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pt-8">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-4xl">
                    {userData?.firstName?.[0] || 'U'}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-700">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-gray-900 mt-4 mb-2">Add Profile Photo</h3>
              <p className="text-gray-600">Help others recognize you</p>
            </div>

            <div>
              <label className="text-gray-700 mb-2 block">About Me</label>
              <Textarea
                placeholder="Tell us about yourself... Your hobbies, what you study, what you're passionate about..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-32 rounded-xl border-gray-200"
              />
              <p className="text-gray-500 mt-2">{bio.length}/500 characters</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-gray-900 mb-2">Select Your Interests</h3>
              <p className="text-gray-600 mb-4">Choose at least 3 interests to help us find your perfect buddy</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleSelection(interest, interests, setInterests)}
                  className={`h-12 rounded-xl border-2 transition-all ${
                    interests.includes(interest)
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {interests.includes(interest) && <Check className="w-4 h-4" />}
                    <span>{interest}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-gray-900 mb-2">Languages You Speak</h3>
              <p className="text-gray-600 mb-4">Select all languages you can communicate in</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {languageOptions.map((language) => (
                <button
                  key={language}
                  onClick={() => toggleSelection(language, languages, setLanguages)}
                  className={`h-12 rounded-xl border-2 transition-all ${
                    languages.includes(language)
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {languages.includes(language) && <Check className="w-4 h-4" />}
                    <span>{language}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-8 pb-8 pt-4 space-y-3">
        {step < 3 ? (
          <>
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && bio.length < 10}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl"
            >
              Continue
            </Button>
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="w-full h-14 rounded-2xl border-gray-200"
              >
                Back
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={languages.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl"
          >
            Complete Setup
          </Button>
        )}
      </div>
    </motion.div>
  );
}
