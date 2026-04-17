import { motion } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, MapPin, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MatchesScreenProps {
  userLanguages: string[];
  userInterests: string[];
  matchedBuddies: string[];
  onBack: () => void;
  onViewMatch: (match: any) => void;
  onMessage: (match: any) => void;
}

export function MatchesScreen({ userLanguages, userInterests, matchedBuddies, onBack, onViewMatch, onMessage }: MatchesScreenProps) {
  // All available buddy profiles
  const allBuddyProfiles = [
    {
      id: 1,
      name: 'Sarah Johnson',
      program: 'Computer Science',
      level: 'Graduate',
      country: 'Canada',
      languages: ['English', 'French'],
      interests: ['Coding', 'Gaming', 'Music', 'Technology'],
      avatar: 'SJ',
      color: 'from-blue-500 to-indigo-600',
      bio: "Hey! I'm a CS grad student passionate about web development and AI. Love gaming in my free time and always up for coffee chats about tech!",
    },
    {
      id: 2,
      name: 'Miguel Rodriguez',
      program: 'Business Administration',
      level: 'Undergraduate',
      country: 'Spain',
      languages: ['Spanish', 'English', 'French'],
      interests: ['Sports', 'Travel', 'Photography', 'Music'],
      avatar: 'MR',
      color: 'from-red-500 to-pink-600',
      bio: "International student from Madrid! Love exploring new places, playing soccer, and meeting people from different cultures. Let's connect!",
    },
    {
      id: 3,
      name: 'Yuki Tanaka',
      program: 'Engineering',
      level: 'Graduate',
      country: 'Japan',
      languages: ['Japanese', 'English'],
      interests: ['Technology', 'Gaming', 'Anime', 'Cooking'],
      avatar: 'YT',
      color: 'from-green-500 to-teal-600',
      bio: "Engineering student who loves building things and playing video games. Always happy to help with tech stuff or grab ramen together!",
    },
    {
      id: 4,
      name: 'Emma Wilson',
      program: 'Psychology',
      level: 'Undergraduate',
      country: 'United Kingdom',
      languages: ['English', 'German'],
      interests: ['Reading', 'Music', 'Travel', 'Fitness'],
      avatar: 'EW',
      color: 'from-purple-500 to-pink-500',
      bio: "Psychology major with a love for books and good coffee. New to the area and looking forward to making friends and exploring campus!",
    },
    {
      id: 5,
      name: 'Ahmed Hassan',
      program: 'Data Science',
      level: 'Graduate',
      country: 'Egypt',
      languages: ['Arabic', 'English', 'French'],
      interests: ['Technology', 'Sports', 'Music', 'Coding'],
      avatar: 'AH',
      color: 'from-orange-500 to-red-600',
      bio: "Data science enthusiast who loves working on AI projects. Also into basketball and Middle Eastern cuisine. Let's connect!",
    },
  ];

  // Filter to show only matched buddies with real match scores
  const matches = allBuddyProfiles
    .filter(buddy => matchedBuddies.includes(buddy.name))
    .map(buddy => {
      // Calculate match score based on common languages and interests
      const commonLanguages = buddy.languages.filter(lang => userLanguages.includes(lang));
      const commonInterests = buddy.interests.filter(interest => userInterests.includes(interest));
      
      const languageWeight = 0.4;
      const interestWeight = 0.6;
      
      const languageScore = userLanguages.length > 0 && buddy.languages.length > 0
        ? (commonLanguages.length / Math.max(userLanguages.length, buddy.languages.length)) * 100
        : 0;
        
      const interestScore = userInterests.length > 0 && buddy.interests.length > 0
        ? (commonInterests.length / Math.max(userInterests.length, buddy.interests.length)) * 100
        : 0;
      
      const matchRate = Math.round(languageWeight * languageScore + interestWeight * interestScore);
      
      return {
        ...buddy,
        matchRate,
        commonLanguages,
        commonInterests,
      };
    })
    .sort((a, b) => b.matchRate - a.matchRate);

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
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
            <h1 className="text-white text-2xl">My Matches</h1>
            <p className="text-red-100">{matches.length} compatible buddies found</p>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600">Find your first buddy to see your matches here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${match.color} rounded-2xl flex items-center justify-center text-white text-xl shrink-0`}>
                    {match.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-gray-900 text-lg">{match.name}</h3>
                      <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                        <span className="text-green-600 text-sm">{match.matchRate}%</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-1">{match.program}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {match.country}
                    </div>
                  </div>
                </div>

                {/* Common Languages */}
                {match.commonLanguages.length > 0 && (
                  <div className="mb-3">
                    <div className="text-gray-700 text-sm mb-2">Common Languages</div>
                    <div className="flex flex-wrap gap-2">
                      {match.commonLanguages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Interests */}
                {match.commonInterests.length > 0 && (
                  <div className="mb-4">
                    <div className="text-gray-700 text-sm mb-2">Common Interests</div>
                    <div className="flex flex-wrap gap-2">
                      {match.commonInterests.map((interest) => (
                        <Badge key={interest} className="text-xs bg-red-50 text-red-600 border-0">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    onClick={() => onViewMatch(match)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button
                    onClick={() => onMessage(match)}
                    variant="outline"
                    className="flex-1 border-gray-200 rounded-xl h-11"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}