import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, Award, Target, BookOpen, Zap } from 'lucide-react';
import ProgressCard from '../components/ProgressCard';

const Progress = () => {
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [progressRes, statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/progress/my-progress`),
        axios.get(`${import.meta.env.VITE_API_URL}/progress/my-stats`)
      ]);
      
      setProgressData(progressRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatStudyTime = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey across all subjects
          </p>
        </div>

        {/* Overall Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Study Time */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8" />
                <span className="text-3xl font-bold">{Math.floor(stats.totalStudyTime / 60)}h</span>
              </div>
              <p className="text-sm opacity-90">Total Study Time</p>
              <p className="text-xs opacity-75 mt-1">{formatStudyTime(stats.totalStudyTime)}</p>
            </div>

            {/* Average Score */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" />
                <span className="text-3xl font-bold">{stats.averageScore}%</span>
              </div>
              <p className="text-sm opacity-90">Average Quiz Score</p>
              <p className="text-xs opacity-75 mt-1">{stats.totalQuizzes} quizzes completed</p>
            </div>

            {/* Average Progress */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8" />
                <span className="text-3xl font-bold">{stats.averageProgress}%</span>
              </div>
              <p className="text-sm opacity-90">Overall Progress</p>
              <p className="text-xs opacity-75 mt-1">Across all subjects</p>
            </div>

            {/* Milestones */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" />
                <span className="text-3xl font-bold">{stats.totalMilestones}</span>
              </div>
              <p className="text-sm opacity-90">Milestones Earned</p>
              <p className="text-xs opacity-75 mt-1">Keep up the great work!</p>
            </div>
          </div>
        )}

        {/* Additional Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFlashcardsReviewed}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Flashcards Reviewed</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedLabs}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Labs Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedOSCE}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">OSCE Stations</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedSkills}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Skills Mastered</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Progress Cards */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Subject Progress
          </h2>
        </div>

        {progressData.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No progress data yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Start learning to track your progress!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressData.map((progress) => (
              <ProgressCard key={progress._id} progress={progress} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;

