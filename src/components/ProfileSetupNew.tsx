import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ProfileSetupNewProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export function ProfileSetupNew({ onComplete, onBack }: ProfileSetupNewProps) {
  const [firstName, setFirstName] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [majorProgram, setMajorProgram] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const languages = ['English', 'French', 'Spanish', 'Chinese', 'Hindi', 'Arabic'];
  const interests = ['Sports', 'Music', 'Art', 'Food', 'Reading', 'Gaming'];

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    if (!firstName || !countryOfOrigin || !majorProgram) {
      alert('Please fill in all required fields');
      return;
    }
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language');
      return;
    }
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }
    
    onComplete({
      firstName,
      countryOfOrigin,
      majorProgram,
      languages: selectedLanguages,
      interests: selectedInterests,
    });
  };

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-red-600 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}
        
        <h1 className="text-red-600">Profile Setup</h1>
      </div>

      {/* Form */}
      <div className="flex-1 px-8 pb-8 space-y-6">
        {/* First Name */}
        <div>
          <label className="block text-gray-900 mb-2">First name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full h-12 rounded-2xl border-gray-900"
          />
        </div>

        {/* Country of Origin */}
        <div>
          <label className="block text-gray-900 mb-2">Country of origin</label>
          <Input
            value={countryOfOrigin}
            onChange={(e) => setCountryOfOrigin(e.target.value)}
            className="w-full h-12 rounded-2xl border-gray-900"
          />
        </div>

        {/* Major/Program */}
        <div>
          <label className="block text-gray-900 mb-2">Major/Program</label>
          <Input
            value={majorProgram}
            onChange={(e) => setMajorProgram(e.target.value)}
            className="w-full h-12 rounded-2xl border-gray-900"
          />
        </div>

        {/* Languages Spoken */}
        <div>
          <label className="block text-gray-900 mb-3">Languages Spoken</label>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((language) => (
              <motion.button
                key={language}
                onClick={() => toggleLanguage(language)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl transition-colors ${
                  selectedLanguages.includes(language)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {language}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-gray-900 mb-3">Interests</label>
          <div className="grid grid-cols-3 gap-2">
            {interests.map((interest) => (
              <motion.button
                key={interest}
                onClick={() => toggleInterest(interest)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {interest}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            variant="outline"
            className="w-full h-14 text-red-600 border-red-600 rounded-full hover:bg-red-50"
          >
            Go to Main Home
          </Button>
        </div>
      </div>
    </div>
  );
}