import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import { 
  ArrowLeft,
  Award,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Calendar,
  Target
} from 'lucide-react';

const StudentDetail = () => {
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teacher-analytics/student/${studentId}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!data) return <div className="text-center py-8">Student not found</div>;

  const { student, performance, quizAttempts } = data;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link to="/student-analytics" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Analytics
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{student.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {student.year && `Year ${student.year} • `}
              {student.university || 'No university specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Quizzes Taken</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-white mt-1">
                {performance.overallStats.totalQuizzesTaken}
              </p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-600 dark:text-blue-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-300 font-medium">Average Score</p>
              <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">
                {performance.overallStats.averageQuizScore.toFixed(1)}%
              </p>
            </div>
            <Award className="w-10 h-10 text-green-600 dark:text-green-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Study Time</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">
                {performance.overallStats.totalStudyTime} min
              </p>
            </div>
            <Clock className="w-10 h-10 text-purple-600 dark:text-purple-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Current Streak</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-white mt-1">
                🔥 {performance.overallStats.currentStreak} days
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-600 dark:text-orange-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Weak and Strong Areas */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Weak Areas */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weak Areas</h2>
          </div>
          {performance.weakAreas.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No weak areas identified yet</p>
          ) : (
            <div className="space-y-3">
              {performance.weakAreas.map((area, index) => (
                <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{area.topic}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {area.subject?.name || 'General'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {area.averageScore}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Needs review</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strong Areas */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Strong Areas</h2>
          </div>
          {performance.strongAreas.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No strong areas identified yet</p>
          ) : (
            <div className="space-y-3">
              {performance.strongAreas.map((area, index) => (
                <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{area.topic}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {area.subject?.name || 'General'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {area.averageScore}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Mastered</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Topic Performance */}
      {performance.topicPerformance.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Topic Performance</h2>
          <div className="space-y-3">
            {performance.topicPerformance.map((topic, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{topic.topic}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {topic.averageScore}% • {topic.attemptsCount} attempts
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        topic.averageScore >= 80 ? 'bg-green-600' :
                        topic.averageScore >= 60 ? 'bg-blue-600' :
                        'bg-orange-600'
                      }`}
                      style={{ width: `${topic.averageScore}%` }}
                    ></div>
                  </div>
                </div>
                {topic.trend === 'improving' && (
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {topic.trend === 'declining' && (
                  <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Quiz Attempts */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Quiz Attempts</h2>
        {quizAttempts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">No quiz attempts yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Quiz</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((attempt) => (
                  <tr key={attempt._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {attempt.quizId?.title || 'Unknown Quiz'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        attempt.percent >= 80 ? 'text-green-600 dark:text-green-400' :
                        attempt.percent >= 60 ? 'text-blue-600 dark:text-blue-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`}>
                        {attempt.percent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-900 dark:text-white">
                      {Math.floor(attempt.durationSec / 60)}:{(attempt.durationSec % 60).toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;

