import { motion } from 'motion/react';
import { Trophy, Star, Award, Target, Zap, Heart, MessageCircle, Users, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { StoredUser } from '../utils/userStorage';
import { getUserMatchedBuddies } from '../utils/userStorage';
import { getRSVPCount } from '../utils/eventsStorage';

interface AchievementsPageProps {
  currentUser: StoredUser | null;
}

export function AchievementsPage({ currentUser }: AchievementsPageProps) {
  // Calculate real user stats
  const buddiesCount = currentUser ? getUserMatchedBuddies(currentUser.id).length : 0;
  const eventsCount = currentUser ? getRSVPCount(currentUser.id) : 0;
  const totalPoints = buddiesCount * 50 + eventsCount * 25;
  
  const achievements = [
    {
      id: 1,
      title: 'First Connection',
      description: 'Made your first buddy connection',
      icon: Users,
      earned: buddiesCount >= 1,
      date: buddiesCount >= 1 ? 'Earned!' : null,
      points: 50,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      title: 'Social Starter',
      description: 'Connected with 3 buddies',
      icon: Heart,
      earned: buddiesCount >= 3,
      progress: Math.min(buddiesCount, 3),
      total: 3,
      date: buddiesCount >= 3 ? 'Earned!' : null,
      points: 100,
      color: 'from-pink-400 to-pink-600',
    },
    {
      id: 3,
      title: 'Buddy Master',
      description: 'Connected with 5 buddies',
      icon: MessageCircle,
      earned: buddiesCount >= 5,
      progress: Math.min(buddiesCount, 5),
      total: 5,
      date: buddiesCount >= 5 ? 'Earned!' : null,
      points: 150,
      color: 'from-green-400 to-green-600',
    },
    {
      id: 4,
      title: 'Event Explorer',
      description: 'Register for your first event',
      icon: Calendar,
      earned: eventsCount >= 1,
      date: eventsCount >= 1 ? 'Earned!' : null,
      points: 25,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      id: 5,
      title: 'Event Enthusiast',
      description: 'Register for 5 campus events',
      icon: Star,
      earned: eventsCount >= 5,
      progress: Math.min(eventsCount, 5),
      total: 5,
      date: eventsCount >= 5 ? 'Earned!' : null,
      points: 75,
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 6,
      title: 'Campus Champion',
      description: 'Register for 10 campus events',
      icon: Trophy,
      earned: eventsCount >= 10,
      progress: Math.min(eventsCount, 10),
      total: 10,
      date: eventsCount >= 10 ? 'Earned!' : null,
      points: 200,
      color: 'from-red-400 to-red-600',
    },
  ];

  const stats = [
    { label: 'Total Points', value: totalPoints.toLocaleString(), icon: Trophy },
    { label: 'Buddies', value: buddiesCount.toString(), icon: Users },
    { label: 'Events', value: eventsCount.toString(), icon: Calendar },
  ];

  const earnedAchievements = achievements.filter((a) => a.earned);
  const lockedAchievements = achievements.filter((a) => !a.earned);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 px-6 pt-12 pb-8 rounded-b-[3rem]">
        <h1 className="text-white text-2xl mb-6">Achievements</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
              >
                <Icon className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white text-xl mb-1">{stat.value}</div>
                <div className="text-red-100">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Earned Achievements */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">Unlocked Achievements</h2>
          <div className="space-y-3">
            {earnedAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full -mr-16 -mt-16" />
                  <div className="flex items-start space-x-4 relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-gray-900">{achievement.title}</h3>
                        <Badge className="bg-yellow-50 text-yellow-600 border-0">
                          +{achievement.points}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Earned on {achievement.date}</span>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Locked Achievements */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">In Progress</h2>
          <div className="space-y-3">
            {lockedAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const progress = achievement.progress
                ? (achievement.progress / achievement.total!) * 100
                : 0;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center flex-shrink-0 opacity-30`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-gray-900">{achievement.title}</h3>
                        <Badge variant="outline" className="border-gray-200 text-gray-600">
                          +{achievement.points}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{achievement.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">
                            {achievement.progress} / {achievement.total}
                          </span>
                          <span className="text-gray-900">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Leaderboard</h2>
            <button className="text-red-600 hover:text-red-700">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Sarah Johnson', points: 5420, avatar: 'SJ' },
              { rank: 2, name: 'Michael Chen', points: 4890, avatar: 'MC' },
              { rank: 3, name: 'Emma Davis', points: 4650, avatar: 'ED' },
              { rank: 127, name: 'You', points: 2450, avatar: 'D', isCurrentUser: true },
            ].map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  user.isCurrentUser ? 'bg-red-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.rank === 1
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                        : user.rank === 2
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                        : user.rank === 3
                        ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                        : user.isCurrentUser
                        ? 'bg-gradient-to-br from-red-400 to-red-600'
                        : 'bg-gray-400'
                    } text-white`}
                  >
                    <span>{user.rank <= 3 ? '🏆' : user.avatar[0]}</span>
                  </div>
                  <div>
                    <div
                      className={`${
                        user.isCurrentUser ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {user.name}
                    </div>
                    <div className="text-gray-500">#{user.rank}</div>
                  </div>
                </div>
                <div
                  className={`${
                    user.isCurrentUser ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {user.points.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}