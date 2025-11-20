import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, TrendingUp, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

const PerformanceWidget = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student-performance/my-performance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const stats = performance?.overallStats || {};
  const weakAreas = performance?.weakAreas || [];
  const strongAreas = performance?.strongAreas || [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-blue-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Performance Insights</h2>
        </div>
        <Link
          to="/performance"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quizzes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalQuizzesTaken || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(stats.averageQuizScore || 0)}`}>
            {stats.averageQuizScore || 0}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Time</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalStudyTime || 0}m
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Streak</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.currentStreak || 0}🔥
          </p>
        </div>
      </div>

      {/* Weak Areas Alert */}
      {weakAreas.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                Areas Needing Focus
              </h3>
              <div className="space-y-2">
                {weakAreas.slice(0, 3).map((area, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-red-800 dark:text-red-300">{area.topic}</span>
                    <span className={`text-sm font-semibold ${getScoreColor(area.averageScore)}`}>
                      {area.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
              {weakAreas.length > 3 && (
                <Link
                  to="/performance"
                  className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2 inline-block"
                >
                  View all {weakAreas.length} areas →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Strong Areas */}
      {strongAreas.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                Your Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {strongAreas.slice(0, 4).map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                  >
                    {area.topic} ({area.averageScore}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">AI Recommendation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {weakAreas.length > 0
                ? `Focus on ${weakAreas[0].topic} to improve your score. Try taking practice quizzes and reviewing flashcards.`
                : strongAreas.length > 0
                ? `Great job on ${strongAreas[0].topic}! Keep up the momentum and explore new topics.`
                : 'Start taking quizzes to get personalized AI recommendations!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceWidget;
