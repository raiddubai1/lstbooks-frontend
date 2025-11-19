import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('points');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/gamification/leaderboard?type=${sortBy}&limit=100`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-2 border-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 border-2 border-orange-400';
    return 'bg-white dark:bg-gray-800';
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            See how you rank against other students!
          </p>
        </div>

        {/* Sort Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('points')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'points'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Star className="w-4 h-4 inline mr-2" />
                Points
              </button>
              <button
                onClick={() => setSortBy('level')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'level'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Level
              </button>
              <button
                onClick={() => setSortBy('badges')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'badges'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Award className="w-4 h-4 inline mr-2" />
                Badges
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-full w-20 h-20 flex items-center justify-center mb-3">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">{leaderboard[1].user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sortBy === 'points' && `${leaderboard[1].totalPoints.toLocaleString()} pts`}
                  {sortBy === 'level' && `Level ${leaderboard[1].level}`}
                  {sortBy === 'badges' && `${leaderboard[1].badges.length} badges`}
                </p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <Crown className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full w-24 h-24 flex items-center justify-center mb-3 shadow-lg">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-gray-900 dark:text-white">{leaderboard[0].user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sortBy === 'points' && `${leaderboard[0].totalPoints.toLocaleString()} pts`}
                  {sortBy === 'level' && `Level ${leaderboard[0].level}`}
                  {sortBy === 'badges' && `${leaderboard[0].badges.length} badges`}
                </p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">{leaderboard[2].user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sortBy === 'points' && `${leaderboard[2].totalPoints.toLocaleString()} pts`}
                  {sortBy === 'level' && `Level ${leaderboard[2].level}`}
                  {sortBy === 'badges' && `${leaderboard[2].badges.length} badges`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Badges
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((entry) => (
                  <tr
                    key={entry._id}
                    className={`${getRankColor(entry.rank)} ${
                      entry.user?._id === currentUser?._id ? 'ring-2 ring-blue-500' : ''
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {entry.user?.name}
                            {entry.user?._id === currentUser?._id && (
                              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.level}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.totalPoints.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.badges.length}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No leaderboard data available yet. Start learning to appear on the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

