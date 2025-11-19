import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Clock, Award, ChevronDown } from 'lucide-react';
import QuizAnalytics from '../components/QuizAnalytics';
import StudyTimeChart from '../components/StudyTimeChart';

const Analytics = () => {
  const [progressData, setProgressData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/my-progress`);
      setProgressData(response.data);
      if (response.data.length > 0) {
        setSelectedSubject(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
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
            Learning Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights into your study performance and progress
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quizzes'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Quiz Performance
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'time'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Clock className="w-5 h-5 inline mr-2" />
              Study Time
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg p-6 text-white">
                  <BarChart3 className="w-8 h-8 mb-2" />
                  <p className="text-sm opacity-90">Total Subjects</p>
                  <p className="text-3xl font-bold">{progressData.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg p-6 text-white">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <p className="text-sm opacity-90">Avg Progress</p>
                  <p className="text-3xl font-bold">
                    {progressData.length > 0
                      ? Math.round(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / progressData.length)
                      : 0}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                  <Award className="w-8 h-8 mb-2" />
                  <p className="text-sm opacity-90">Total Milestones</p>
                  <p className="text-3xl font-bold">
                    {progressData.reduce((sum, p) => sum + (p.milestones?.length || 0), 0)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StudyTimeChart progressData={progressData} />
              </div>
            </div>
          )}

          {/* Quiz Performance Tab */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              {/* Subject Selector */}
              {progressData.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Subject
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSubject?._id || ''}
                      onChange={(e) => {
                        const subject = progressData.find(p => p._id === e.target.value);
                        setSelectedSubject(subject);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                    >
                      {progressData.map((progress) => (
                        <option key={progress._id} value={progress._id}>
                          {progress.subject?.name || 'Unknown Subject'}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Quiz Analytics Component */}
              {selectedSubject ? (
                <QuizAnalytics progress={selectedSubject} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No subject selected</p>
                </div>
              )}
            </div>
          )}

          {/* Study Time Tab */}
          {activeTab === 'time' && (
            <StudyTimeChart progressData={progressData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

