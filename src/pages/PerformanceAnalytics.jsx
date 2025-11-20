import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Brain, Flame, Clock, Award, BookOpen, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import api from '../services/api';

const PerformanceAnalytics = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student-performance/my-performance');
      setPerformance(response.data);
    } catch (err) {
      console.error('Error fetching performance:', err);
      setError(err.response?.data?.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchPerformance}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Data Yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start taking quizzes to see your performance analytics!
          </p>
        </div>
      </div>
    );
  }

  const stats = performance.overallStats || {};
  const weakAreas = performance.weakAreas || [];
  const strongAreas = performance.strongAreas || [];
  const topicPerformance = performance.topicPerformance || [];

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Performance Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered insights into your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Quizzes */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 opacity-80" />
              <Zap className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-sm opacity-90 mb-1">Quizzes Taken</p>
            <p className="text-4xl font-bold">{stats.totalQuizzesTaken || 0}</p>
          </div>

          {/* Average Score */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
              <Award className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-sm opacity-90 mb-1">Average Score</p>
            <p className="text-4xl font-bold">{stats.averageQuizScore || 0}%</p>
          </div>

          {/* Study Time */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <Brain className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-sm opacity-90 mb-1">Study Time</p>
            <p className="text-4xl font-bold">{stats.totalStudyTime || 0}<span className="text-xl ml-1">min</span></p>
          </div>

          {/* Current Streak */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 opacity-80" />
              <CheckCircle className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-sm opacity-90 mb-1">Current Streak</p>
            <p className="text-4xl font-bold">{stats.currentStreak || 0}<span className="text-xl ml-1">days</span></p>
          </div>
        </div>

        {/* Weak & Strong Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weak Areas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Areas to Improve</h2>
            </div>
            {weakAreas.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No weak areas! Keep up the great work! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weakAreas.slice(0, 5).map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{area.topic}</p>
                      {area.subject?.name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{area.subject.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(area.averageScore)}`}>
                        {area.averageScore}%
                      </p>
                      {area.needsReview && (
                        <span className="text-xs text-red-600 dark:text-red-400">Needs Review</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strong Areas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Strong Areas</h2>
            </div>
            {strongAreas.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Keep studying to build your strengths!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {strongAreas.slice(0, 5).map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{area.topic}</p>
                      {area.subject?.name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{area.subject.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(area.averageScore)}`}>
                        {area.averageScore}%
                      </p>
                      <span className="text-xs text-green-600 dark:text-green-400">Mastered!</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Topic Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Topic Performance</h2>
          </div>
          {topicPerformance.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">No topic data yet. Start taking quizzes!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Topic</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Attempts</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Score</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Trend</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Last Attempt</th>
                  </tr>
                </thead>
                <tbody>
                  {topicPerformance.map((topic, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{topic.topic}</p>
                        {topic.subject?.name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{topic.subject.name}</p>
                        )}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-900 dark:text-white">{topic.attemptsCount}</td>
                      <td className="text-center py-3 px-4">
                        <span className={`text-lg font-bold ${getScoreColor(topic.averageScore)}`}>
                          {topic.averageScore}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {getTrendIcon(topic.trend)}
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{topic.trend}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {topic.lastAttempt ? new Date(topic.lastAttempt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;

