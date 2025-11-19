import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Award, TrendingUp, Flame, Star, Target, Zap, Crown } from 'lucide-react';

const Gamification = () => {
  const [progress, setProgress] = useState(null);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProgress();
    fetchAvailableBadges();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/gamification/progress`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBadges = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/gamification/badges/available`);
      setAvailableBadges(response.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">No progress data available</p>
      </div>
    );
  }

  const levelProgress = ((progress.totalPoints % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Your Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your achievements, earn badges, and climb the leaderboard!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Crown className="w-8 h-8" />
              <span className="text-3xl font-bold">Lv {progress.level}</span>
            </div>
            <p className="text-sm opacity-90 mb-2">Current Level</p>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-75">
              {progress.pointsToNextLevel} points to next level
            </p>
          </div>

          {/* Points Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8" />
              <span className="text-3xl font-bold">{progress.totalPoints.toLocaleString()}</span>
            </div>
            <p className="text-sm opacity-90">Total Points</p>
          </div>

          {/* Badges Card */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8" />
              <span className="text-3xl font-bold">{progress.badges.length}</span>
            </div>
            <p className="text-sm opacity-90">Badges Earned</p>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {progress.streaks.find(s => s.type === 'daily-login')?.currentStreak || 0}
              </span>
            </div>
            <p className="text-sm opacity-90">Day Streak</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-yellow-600 text-yellow-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'badges'
                    ? 'border-b-2 border-yellow-600 text-yellow-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Badges
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'border-b-2 border-yellow-600 text-yellow-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Statistics
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab progress={progress} />
            )}
            {activeTab === 'badges' && (
              <BadgesTab earnedBadges={progress.badges} availableBadges={availableBadges} />
            )}
            {activeTab === 'stats' && (
              <StatsTab stats={progress.stats} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ progress }) => {
  const recentPoints = progress.pointHistory.slice(-10).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-600" />
          Recent Activity
        </h3>
        {recentPoints.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recent activity. Start learning to earn points!
          </p>
        ) : (
          <div className="space-y-2">
            {recentPoints.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{entry.action}</p>
                  {entry.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{entry.description}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-lg font-bold text-yellow-600">+{entry.points}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BadgesTab = ({ earnedBadges, availableBadges }) => {
  const earnedBadgeIds = earnedBadges.map(b => b.badgeId);

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Earned Badges ({earnedBadges.length})
        </h3>
        {earnedBadges.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No badges earned yet. Keep learning to unlock achievements!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => (
              <BadgeCard key={index} badge={badge} earned={true} />
            ))}
          </div>
        )}
      </div>

      {/* Available Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableBadges
            .filter(badge => !earnedBadgeIds.includes(badge.badgeId))
            .map((badge, index) => (
              <BadgeCard key={index} badge={badge} earned={false} />
            ))}
        </div>
      </div>
    </div>
  );
};

const BadgeCard = ({ badge, earned }) => (
  <div
    className={`p-4 rounded-lg text-center transition-all ${
      earned
        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400'
        : 'bg-gray-100 dark:bg-gray-700 opacity-60'
    }`}
  >
    <div className="text-4xl mb-2">{badge.icon}</div>
    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{badge.name}</h4>
    <p className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</p>
    {earned && badge.earnedAt && (
      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
        Earned {new Date(badge.earnedAt).toLocaleDateString()}
      </p>
    )}
  </div>
);

const StatsTab = ({ stats }) => {
  const statItems = [
    { label: 'Quizzes Completed', value: stats.quizzesCompleted, icon: Target },
    { label: 'Flashcards Reviewed', value: stats.flashcardsReviewed, icon: Award },
    { label: 'Discussions Created', value: stats.discussionsCreated, icon: Trophy },
    { label: 'Comments Posted', value: stats.commentsPosted, icon: Star },
    { label: 'Study Groups Joined', value: stats.studyGroupsJoined, icon: Crown },
    { label: 'Peer Reviews Given', value: stats.peerReviewsGiven, icon: Award },
    { label: 'Resources Shared', value: stats.resourcesShared, icon: Trophy },
    { label: 'AI Chats Started', value: stats.aiChatsStarted, icon: Zap },
    { label: 'Total Study Time (min)', value: stats.totalStudyTime, icon: Flame },
    { label: 'Days Active', value: stats.daysActive, icon: TrendingUp }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center"
          >
            <Icon className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Gamification;

