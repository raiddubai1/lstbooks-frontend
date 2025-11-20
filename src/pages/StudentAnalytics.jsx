import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Clock,
  Search,
  Download,
  BarChart3,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const StudentAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchOverview();
    fetchStudents();
  }, [searchTerm, sortBy]);

  const fetchOverview = async () => {
    try {
      const response = await api.get('/teacher-analytics/overview');
      setOverview(response.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teacher-analytics/students', {
        params: { search: searchTerm, sortBy }
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV data
    const headers = ['Name', 'Email', 'Year', 'Quizzes Taken', 'Average Score', 'Study Time (min)', 'Streak'];
    const rows = students.map(s => [
      s.name,
      s.email,
      s.year || 'N/A',
      s.performance.totalQuizzes,
      s.performance.averageScore.toFixed(1),
      s.performance.studyTime,
      s.performance.streak
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && !overview) return <Loading />;

  return (
    <div>
      <SectionHeader
        title="Student Analytics"
        subtitle="Track student performance and identify areas for improvement"
      />

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{overview.totalStudents}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600 dark:text-blue-300 opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-300 font-medium">Active (7 days)</p>
                <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">{overview.activeStudents}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-300 opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Quiz Attempts</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">{overview.totalQuizAttempts}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-600 dark:text-purple-300 opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Avg Class Score</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-white mt-1">{overview.averageScore.toFixed(1)}%</p>
              </div>
              <Award className="w-10 h-10 text-orange-600 dark:text-orange-300 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Actions */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="performance.averageScore">Sort by Score</option>
              <option value="performance.totalQuizzes">Sort by Quizzes</option>
              <option value="performance.studyTime">Sort by Study Time</option>
            </select>

            <button
              onClick={exportData}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Year</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Quizzes</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Score</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Study Time</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Streak</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <Loading />
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-600 dark:text-gray-400">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {student.year ? `Year ${student.year}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-900 dark:text-white">
                      {student.performance.totalQuizzes}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`font-semibold ${
                          student.performance.averageScore >= 80 ? 'text-green-600 dark:text-green-400' :
                          student.performance.averageScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
                          student.performance.averageScore > 0 ? 'text-orange-600 dark:text-orange-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {student.performance.averageScore > 0 ? student.performance.averageScore.toFixed(1) : '-'}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-900 dark:text-white">
                      {student.performance.studyTime} min
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium">
                        🔥 {student.performance.streak}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {student.performance.averageScore >= 80 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Excellent
                        </span>
                      ) : student.performance.averageScore >= 60 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                          <TrendingUp className="w-3 h-3" />
                          Good
                        </span>
                      ) : student.performance.averageScore > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Needs Help
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-400">No Data</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/student-analytics/${student._id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;

