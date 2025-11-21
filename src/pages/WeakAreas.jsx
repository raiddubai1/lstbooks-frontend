import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AlertTriangle,
  TrendingDown,
  Target,
  BookOpen,
  Brain,
  BarChart3,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WeakAreas = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAnalysis();
  }, [token]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/weak-areas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching weak areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to load analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please try again later
          </p>
          <Link
            to="/dashboard"
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { weakSubjects, weakTopics, recommendations, statistics } = analysis;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10" />
            <h1 className="text-4xl font-bold">⚠️ Weak Areas Analysis</h1>
          </div>
          <p className="text-red-100 text-lg">
            Identify and improve your weak areas with AI-powered insights
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{statistics.overallAverage}%</div>
              <div className="text-red-100 text-sm">Overall Average</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{statistics.totalQuizAttempts}</div>
              <div className="text-red-100 text-sm">Quiz Attempts</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{weakSubjects.length}</div>
              <div className="text-red-100 text-sm">Weak Subjects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{weakTopics.length}</div>
              <div className="text-red-100 text-sm">Weak Topics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* No Weak Areas */}
        {weakSubjects.length === 0 && weakTopics.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Great Job! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any weak areas. Your performance is excellent across all subjects!
            </p>
            <Link
              to="/quizzes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Take More Quizzes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  Recommended Actions
                </h2>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        {rec.message}
                      </p>
                      {rec.recommendedQuizzes && rec.recommendedQuizzes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {rec.recommendedQuizzes.map(quiz => (
                            <Link
                              key={quiz._id}
                              to={`/quizzes/${quiz._id}`}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              <Brain className="w-4 h-4" />
                              {quiz.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Subjects */}
            {weakSubjects.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                  Weak Subjects ({weakSubjects.length})
                </h2>
                <div className="space-y-3">
                  {weakSubjects.map((subject, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getScoreBgColor(subject.averageScore)}`}>
                            <span className={`text-lg font-bold ${getScoreColor(subject.averageScore)}`}>
                              {subject.averageScore.toFixed(0)}%
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {subject.subjectName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subject.totalAttempts} attempts • {subject.quizzesTaken} quizzes
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/subjects/${subject.subjectId}`}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                          Improve
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            subject.averageScore >= 80
                              ? 'bg-green-600'
                              : subject.averageScore >= 60
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${subject.averageScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Topics */}
            {weakTopics.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-600" />
                  Weak Topics ({weakTopics.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weakTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {topic.topic}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {topic.subject}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(topic.averageScore)} ${getScoreColor(topic.averageScore)}`}>
                          {topic.averageScore.toFixed(0)}%
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
                        <div className="flex items-center gap-1">
                          <Brain className="w-4 h-4" />
                          {topic.quizCount} quizzes
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {topic.totalAttempts} attempts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        {(weakSubjects.length > 0 || weakTopics.length > 0) && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to Improve?</h2>
            <p className="text-indigo-100 mb-6">
              Take targeted quizzes and study materials to strengthen your weak areas
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/quizzes"
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Practice Quizzes
              </Link>
              <Link
                to="/revision-notes"
                className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
              >
                Study Revision Notes
              </Link>
              <Link
                to="/study-plans"
                className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
              >
                Follow Study Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeakAreas;

