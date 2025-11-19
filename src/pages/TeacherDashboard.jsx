import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Award, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3
} from 'lucide-react';

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalQuizzes: 0,
    totalFlashcards: 0,
    totalStudents: 0,
    recentActivity: []
  });
  const user = getUser();

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  const fetchTeacherStats = async () => {
    try {
      // TODO: Implement API call to get teacher stats
      // For now, using mock data
      setStats({
        totalSubjects: 8,
        totalQuizzes: 15,
        totalFlashcards: 120,
        totalStudents: 45,
        recentActivity: [
          { type: 'quiz', title: 'Oral Pathology Quiz 3', students: 12, date: '2 hours ago' },
          { type: 'subject', title: 'Periodontology Updated', date: '1 day ago' },
          { type: 'flashcard', title: '15 new flashcards added', date: '2 days ago' }
        ]
      });
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <SectionHeader
        title={`Welcome, ${user?.name || 'Teacher'}!`}
        subtitle="Manage your content and track student progress"
      />

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalSubjects}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalQuizzes}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalFlashcards}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Flashcards</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalStudents}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/subjects"
            className="card hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Add Subject</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create new subject</p>
              </div>
            </div>
          </Link>

          <Link
            to="/quizzes"
            className="card hover:shadow-lg transition-all hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Add Quiz</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create new quiz</p>
              </div>
            </div>
          </Link>

          <Link
            to="/flashcards"
            className="card hover:shadow-lg transition-all hover:border-green-300 dark:hover:border-green-600 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Add Flashcards</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create flashcards</p>
              </div>
            </div>
          </Link>

          <Link
            to="/labs"
            className="card hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-600 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Add Lab</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create lab manual</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Activity</h2>
        <div className="card">
          {stats.recentActivity.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'quiz'
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : activity.type === 'subject'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {activity.type === 'quiz' && <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    {activity.type === 'subject' && <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'flashcard' && <Award className="w-5 h-5 text-green-600 dark:text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.students && `${activity.students} students attempted • `}
                      {activity.date}
                    </p>
                  </div>
                  {activity.type === 'quiz' && (
                    <div className="text-right">
                      <Link
                        to={`/quizzes`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Results
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Overview */}
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">Content Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">My Subjects</h3>
              <Link to="/subjects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm dark:text-gray-300">Oral Pathology</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">12 quizzes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm dark:text-gray-300">Periodontology</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">8 quizzes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm dark:text-gray-300">Endodontics</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">10 quizzes</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Student Performance</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View Analytics
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm dark:text-gray-300">Average Quiz Score</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">78%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 dark:bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm dark:text-gray-300">Completion Rate</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm dark:text-gray-300">Active Students</span>
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

