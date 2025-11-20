import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getDashboardStats, getUserProgress } from '../services/api';
import { getUser, getUserRole } from '../utils/auth';
import SectionHeader from '../components/SectionHeader';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import { TrendingUp, Brain, Clock, Award, BookOpen, Target } from 'lucide-react';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import PerformanceWidget from '../components/PerformanceWidget';
import StudyGoals from '../components/StudyGoals';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const userRole = getUserRole();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // If user is logged in, fetch their personal data
      if (user?.id) {
        const [statsResponse, progressResponse] = await Promise.all([
          getDashboardStats(user.id),
          getUserProgress(user.id)
        ]);
        setStats(statsResponse.data);
        setProgress(progressResponse.data);
      } else {
        // If no user, set default empty stats
        setStats({
          totalStudyTime: 0,
          totalQuizzes: 0,
          averageScore: 0,
          totalFlashcardsReviewed: 0
        });
        setProgress([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default stats on error
      setStats({
        totalStudyTime: 0,
        totalQuizzes: 0,
        averageScore: 0,
        totalFlashcardsReviewed: 0
      });
      setProgress([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  // Route to appropriate dashboard based on role
  if (userRole === 'teacher') {
    return <TeacherDashboard />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  // Student Dashboard (default)
  return (
    <div>
      <SectionHeader
        title={`Welcome back, ${user?.name || 'Student'}!`}
        subtitle="Track your learning progress and achievements"
      />

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalStudyTime || 0}h</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalQuizzes || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes Taken</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats?.averageScore?.toFixed(0) || 0}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalFlashcardsReviewed || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cards Reviewed</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Widget */}
      <div className="mb-8">
        <PerformanceWidget />
      </div>

      {/* Study Goals & Subject Progress */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <StudyGoals />

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold dark:text-white">Subject Progress</h2>
          </div>
          {progress.length > 0 ? (
            <div className="space-y-4">
              {progress.slice(0, 5).map((item) => (
                <div key={item._id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium dark:text-white">{item.subject?.name || 'Unknown'}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.completedChapters?.length || 0} chapters
                    </span>
                  </div>
                  <ProgressBar
                    progress={Math.min(100, (item.completedChapters?.length || 0) * 20)}
                    showLabel={false}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No progress yet. Start learning!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold dark:text-white">Quick Actions</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/subjects" className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <h3 className="font-semibold mb-1 dark:text-white">Browse Subjects</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Explore study materials</p>
          </Link>
          <Link to="/quizzes" className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <h3 className="font-semibold mb-1 dark:text-white">Take a Quiz</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Test your knowledge</p>
          </Link>
          <Link to="/flashcards" className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <h3 className="font-semibold mb-1 dark:text-white">Review Flashcards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Reinforce learning</p>
          </Link>
        </div>
      </div>

      {/* Achievements */}
      <div className="card bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-100 dark:border-primary-800">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold mb-1 dark:text-white">Quiz Master</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed {stats?.totalQuizzes || 0} quizzes</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold mb-1 dark:text-white">Dedicated Learner</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats?.totalStudyTime || 0} hours studied</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold mb-1 dark:text-white">High Achiever</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats?.averageScore?.toFixed(0) || 0}% average score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

