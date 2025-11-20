import { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Trophy, Star, Lock, CheckCircle, Sparkles } from 'lucide-react';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/achievements`);
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/achievements/check`);
      if (response.data.newlyUnlocked.length > 0) {
        alert(`🎉 Unlocked ${response.data.newlyUnlocked.length} new achievement(s)!`);
        fetchAchievements();
      } else {
        alert('No new achievements unlocked. Keep going!');
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return achievement.category === filter;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Achievements
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unlock achievements by completing various tasks and milestones!
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                {unlockedCount} / {totalCount}
              </h2>
              <p className="text-sm opacity-90">Achievements Unlocked</p>
            </div>
            <button
              onClick={checkAchievements}
              className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Check Progress
            </button>
          </div>
          <div className="w-full bg-white/30 rounded-full h-4">
            <div
              className="bg-white rounded-full h-4 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm mt-2 opacity-75">{completionPercentage.toFixed(1)}% Complete</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
              All
            </FilterButton>
            <FilterButton active={filter === 'unlocked'} onClick={() => setFilter('unlocked')}>
              Unlocked
            </FilterButton>
            <FilterButton active={filter === 'locked'} onClick={() => setFilter('locked')}>
              Locked
            </FilterButton>
            <FilterButton active={filter === 'learning'} onClick={() => setFilter('learning')}>
              Learning
            </FilterButton>
            <FilterButton active={filter === 'social'} onClick={() => setFilter('social')}>
              Social
            </FilterButton>
            <FilterButton active={filter === 'streak'} onClick={() => setFilter('streak')}>
              Streak
            </FilterButton>
            <FilterButton active={filter === 'milestone'} onClick={() => setFilter('milestone')}>
              Milestone
            </FilterButton>
            <FilterButton active={filter === 'special'} onClick={() => setFilter('special')}>
              Special
            </FilterButton>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement._id} achievement={achievement} />
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No achievements found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-yellow-600 text-white'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {children}
  </button>
);

const AchievementCard = ({ achievement }) => {
  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze': return 'from-orange-700 to-orange-900';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-blue-400 to-blue-600';
      case 'diamond': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierBadge = (tier) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      silver: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      platinum: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      diamond: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[tier] || colors.bronze;
  };

  return (
    <div
      className={`rounded-lg p-6 transition-all ${
        achievement.unlocked
          ? `bg-gradient-to-br ${getTierColor(achievement.tier)} text-white shadow-lg`
          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{achievement.icon}</div>
        {achievement.unlocked ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <Lock className="w-6 h-6 text-gray-400" />
        )}
      </div>
      
      <h3 className={`text-lg font-bold mb-2 ${!achievement.unlocked && 'text-gray-900 dark:text-white'}`}>
        {achievement.name}
      </h3>
      
      <p className={`text-sm mb-4 ${achievement.unlocked ? 'opacity-90' : 'text-gray-600 dark:text-gray-400'}`}>
        {achievement.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTierBadge(achievement.tier)}`}>
          {achievement.tier.toUpperCase()}
        </span>
        {achievement.points > 0 && (
          <div className={`flex items-center gap-1 ${!achievement.unlocked && 'text-yellow-600'}`}>
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold">+{achievement.points}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;

