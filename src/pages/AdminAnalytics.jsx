import { useState, useEffect } from 'react';
import axios from 'axios';
import SectionHeader from '../components/SectionHeader';
import { 
  Users, BookOpen, MessageSquare, TrendingUp, 
  Activity, BarChart3, PieChart, Calendar 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [contentAnalytics, setContentAnalytics] = useState(null);
  const [engagementAnalytics, setEngagementAnalytics] = useState(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, userRes, contentRes, engagementRes] = await Promise.all([
        axios.get('/api/admin/analytics/overview'),
        axios.get(`/api/admin/analytics/users?period=${period}`),
        axios.get('/api/admin/analytics/content'),
        axios.get(`/api/admin/analytics/engagement?period=${period}`)
      ]);

      setOverview(overviewRes.data);
      setUserAnalytics(userRes.data);
      setContentAnalytics(contentRes.data);
      setEngagementAnalytics(engagementRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Admin Analytics"
        subtitle="Platform insights and performance metrics"
      />

      {/* Period Selector */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setPeriod('7d')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === '7d'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => setPeriod('30d')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === '30d'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          30 Days
        </button>
        <button
          onClick={() => setPeriod('90d')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === '90d'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          90 Days
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Total Users</span>
          </div>
          <div className="text-3xl font-bold mb-2">{overview?.users.total || 0}</div>
          <div className="text-sm opacity-80">
            {overview?.users.activeToday || 0} active today
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Content Items</span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {(overview?.content.quizzes || 0) + (overview?.content.flashcards || 0)}
          </div>
          <div className="text-sm opacity-80">
            {overview?.content.quizzes || 0} quizzes, {overview?.content.flashcards || 0} flashcards
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Discussions</span>
          </div>
          <div className="text-3xl font-bold mb-2">{overview?.content.discussions || 0}</div>
          <div className="text-sm opacity-80">
            {overview?.content.studyGroups || 0} study groups
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">AI Sessions</span>
          </div>
          <div className="text-3xl font-bold mb-2">{overview?.content.aiChatSessions || 0}</div>
          <div className="text-sm opacity-80">
            Total AI chat sessions
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Users Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            New Users Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userAnalytics?.newUsers || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Role */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
            Users by Role
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={userAnalytics?.usersByRole || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(userAnalytics?.usersByRole || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Content by Subject */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Quizzes by Subject
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentAnalytics?.quizStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subjectName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Quiz Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Engagement Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementAnalytics?.aiChatSessions || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} name="AI Chat Sessions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Active Users */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Top Active Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Points</th>
              </tr>
            </thead>
            <tbody>
              {userAnalytics?.topActiveUsers?.map((item, index) => (
                <tr key={item._id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                    #{index + 1}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.user?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.user?.email || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.user?.role === 'admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : item.user?.role === 'teacher'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {item.user?.role || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {item.totalPoints?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

