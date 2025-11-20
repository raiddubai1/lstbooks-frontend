import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Calendar, Users, Trophy, Clock, CheckCircle, TrendingUp, Flame } from 'lucide-react';

const Challenges = () => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const [activeRes, myRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/challenges/active`),
        axios.get(`${import.meta.env.VITE_API_URL}/challenges/my-challenges`)
      ]);
      setActiveChallenges(activeRes.data);
      setMyChallenges(myRes.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/challenges/${challengeId}/join`);
      alert('Successfully joined challenge!');
      fetchChallenges();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to join challenge');
    }
  };

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
            <Target className="w-8 h-8 text-yellow-600" />
            Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join challenges to compete with others and earn rewards!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <span className="text-3xl font-bold">{myChallenges.length}</span>
            </div>
            <p className="text-sm opacity-90">Active Challenges</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {myChallenges.filter(c => c.userProgress?.completed).length}
              </span>
            </div>
            <p className="text-sm opacity-90">Completed</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {myChallenges.reduce((sum, c) => sum + (c.userProgress?.pointsEarned || 0), 0)}
              </span>
            </div>
            <p className="text-sm opacity-90">Points Earned</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'border-b-2 border-yellow-600 text-yellow-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Available Challenges
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'my'
                    ? 'border-b-2 border-yellow-600 text-yellow-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                My Challenges
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'active' && (
              <div className="space-y-4">
                {activeChallenges.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No active challenges available at the moment.
                  </p>
                ) : (
                  activeChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge._id}
                      challenge={challenge}
                      onJoin={joinChallenge}
                      showJoinButton={!myChallenges.some(c => c._id === challenge._id)}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'my' && (
              <div className="space-y-4">
                {myChallenges.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    You haven't joined any challenges yet. Check out the available challenges!
                  </p>
                ) : (
                  myChallenges.map((challenge) => (
                    <MyChallengeCard
                      key={challenge._id}
                      challenge={challenge}
                      onRefresh={fetchChallenges}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChallengeCard = ({ challenge, onJoin, showJoinButton }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      case 'special': return '⭐';
      case 'community': return '👥';
      default: return '🎯';
    }
  };

  const daysLeft = Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getTypeIcon(challenge.type)}</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {challenge.type.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Target className="w-4 h-4" />
              <span>{challenge.goal.target} {challenge.goal.unit}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Trophy className="w-4 h-4" />
              <span>{challenge.rewards.points} points</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{challenge.participantCount} participants</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{daysLeft} days left</span>
            </div>
          </div>
        </div>

        {showJoinButton && (
          <button
            onClick={() => onJoin(challenge._id)}
            className="ml-4 bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
};

const MyChallengeCard = ({ challenge, onRefresh }) => {
  const progress = challenge.userProgress?.progress || 0;
  const target = challenge.goal.target;
  const progressPercentage = Math.min((progress / target) * 100, 100);
  const completed = challenge.userProgress?.completed || false;

  return (
    <div className={`rounded-lg p-6 ${completed ? 'bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 border-2 border-green-400' : 'bg-gray-50 dark:bg-gray-700'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
            {completed && <CheckCircle className="w-6 h-6 text-green-600" />}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress: {progress} / {target} {challenge.goal.unit}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${completed ? 'bg-green-600' : 'bg-yellow-600'}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {completed && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">
                Earned {challenge.userProgress.pointsEarned} points!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;

