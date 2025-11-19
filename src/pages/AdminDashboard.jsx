import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Award,
  Shield,
  TrendingUp,
  Activity,
  Settings,
  UserPlus,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalContent: 0,
    recentUsers: []
  });
  const user = getUser();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // TODO: Implement API call to get admin stats
      // For now, using mock data
      setStats({
        totalUsers: 152,
        totalStudents: 145,
        totalTeachers: 6,
        totalContent: 243,
        recentUsers: [
          { name: 'John Doe', email: 'john@example.com', role: 'student', date: '2 hours ago' },
          { name: 'Dr. Sarah Smith', email: 'sarah@example.com', role: 'teacher', date: '5 hours ago' },
          { name: 'Mike Johnson', email: 'mike@example.com', role: 'student', date: '1 day ago' }
        ]
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <SectionHeader
        title={`Admin Dashboard`}
        subtitle="Manage users, content, and platform settings"
      />

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalUsers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalStudents}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalTeachers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teachers</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{stats.totalContent}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Content Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="card hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Add Teacher</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create teacher account</p>
              </div>
            </div>
          </button>

          <Link
            to="/subjects"
            className="card hover:shadow-lg transition-all hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Manage Content</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">View all content</p>
              </div>
            </div>
          </Link>

          <button
            className="card hover:shadow-lg transition-all hover:border-green-300 dark:hover:border-green-600 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">View Analytics</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Platform statistics</p>
              </div>
            </div>
          </button>

          <Link
            to="/settings"
            className="card hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-600 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Settings</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Platform settings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Users</h2>
        <div className="card">
          {stats.recentUsers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No recent users</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold dark:text-white">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold dark:text-white">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold dark:text-white">Joined</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((user, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <td className="py-3 px-4 text-sm dark:text-gray-300">{user.name}</td>
                      <td className="py-3 px-4 text-sm dark:text-gray-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          user.role === 'teacher'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                            : user.role === 'admin'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{user.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Platform Overview */}
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">Platform Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">User Growth</h3>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">This Month</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">+24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Last Month</span>
                <span className="text-sm font-semibold dark:text-gray-300">+18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Growth Rate</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">+33%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Content Stats</h3>
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Subjects</span>
                <span className="text-sm font-semibold dark:text-white">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Quizzes</span>
                <span className="text-sm font-semibold dark:text-white">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Flashcards</span>
                <span className="text-sm font-semibold dark:text-white">190</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Activity</h3>
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Active Today</span>
                <span className="text-sm font-semibold dark:text-white">67</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Quizzes Taken</span>
                <span className="text-sm font-semibold dark:text-white">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Avg. Session</span>
                <span className="text-sm font-semibold dark:text-white">24 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

