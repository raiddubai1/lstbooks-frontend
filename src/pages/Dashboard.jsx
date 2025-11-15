import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getUserProgress } from '../services/api';
import { getUser } from '../utils/auth';
import SectionHeader from '../components/SectionHeader';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import { TrendingUp, Brain, Clock, Award, BookOpen, Target } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, progressResponse] = await Promise.all([
        getDashboardStats(user.id),
        getUserProgress(user.id)
      ]);
      setStats(statsResponse.data);
      setProgress(progressResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

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
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalStudyTime || 0}h</p>
              <p className="text-sm text-gray-600">Study Time</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalQuizzes || 0}</p>
              <p className="text-sm text-gray-600">Quizzes Taken</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.averageScore?.toFixed(0) || 0}%</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalFlashcardsReviewed || 0}</p>
              <p className="text-sm text-gray-600">Cards Reviewed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold">Subject Progress</h2>
          </div>
          {progress.length > 0 ? (
            <div className="space-y-4">
              {progress.slice(0, 5).map((item) => (
                <div key={item._id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.subject?.name || 'Unknown'}</span>
                    <span className="text-sm text-gray-600">
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
            <p className="text-gray-500 text-center py-8">No progress yet. Start learning!</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link to="/subjects" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold mb-1">Browse Subjects</h3>
              <p className="text-sm text-gray-600">Explore study materials</p>
            </Link>
            <Link to="/quizzes" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold mb-1">Take a Quiz</h3>
              <p className="text-sm text-gray-600">Test your knowledge</p>
            </Link>
            <Link to="/flashcards" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold mb-1">Review Flashcards</h3>
              <p className="text-sm text-gray-600">Reinforce learning</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card bg-gradient-to-br from-primary-50 to-purple-50 border-primary-100">
        <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold mb-1">Quiz Master</h3>
            <p className="text-sm text-gray-600">Completed {stats?.totalQuizzes || 0} quizzes</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold mb-1">Dedicated Learner</h3>
            <p className="text-sm text-gray-600">{stats?.totalStudyTime || 0} hours studied</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold mb-1">High Achiever</h3>
            <p className="text-sm text-gray-600">{stats?.averageScore?.toFixed(0) || 0}% average score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

