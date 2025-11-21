import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getDashboardStats, getUserProgress } from '../services/api';
import { getUser, getUserRole } from '../utils/auth';
import SectionHeader from '../components/SectionHeader';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import {
  TrendingUp,
  Brain,
  Clock,
  Award,
  BookOpen,
  Target,
  Sparkles,
  FileText,
  Image,
  Calendar,
  Stethoscope,
  FolderOpen,
  Zap,
  GraduationCap,
  ArrowRight,
  Play,
  BookMarked,
  Users
} from 'lucide-react';
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

      {/* AI-Powered Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold dark:text-white">AI-Powered Tools</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/ai-quiz-generator"
            className="group bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">AI Quiz Generator</h3>
            </div>
            <p className="text-purple-100 text-sm mb-3">Generate custom quizzes on any topic instantly</p>
            <div className="flex items-center gap-1 text-sm font-medium">
              Try Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ai-flashcard-generator"
            className="group bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">AI Flashcard Generator</h3>
            </div>
            <p className="text-blue-100 text-sm mb-3">Create flashcards from your notes or PDFs</p>
            <div className="flex items-center gap-1 text-sm font-medium">
              Try Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ai-study-assistant"
            className="group bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">AI Study Assistant</h3>
            </div>
            <p className="text-green-100 text-sm mb-3">Get instant answers to your dental questions</p>
            <div className="flex items-center gap-1 text-sm font-medium">
              Try Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Study Resources */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold dark:text-white">Study Resources</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/books"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold dark:text-white">Books</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1000+ textbooks</p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              Browse <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/past-papers"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold dark:text-white">Past Papers</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">500+ exam papers</p>
            <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
              Browse <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/photos"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-bold dark:text-white">Photo Library</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">5000+ clinical photos</p>
            <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm font-medium">
              Browse <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/resource-center"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold dark:text-white">Resources</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Study materials</p>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              Browse <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Learning Tools */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-xl font-bold dark:text-white">Learning Tools</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/quizzes"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold dark:text-white">Quizzes</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Test your knowledge</p>
            <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
              Start <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/spaced-repetition"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold dark:text-white">Flashcards</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Spaced repetition</p>
            <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-medium">
              Study <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/course-planner"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold dark:text-white">Course Planner</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Plan your studies</p>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              Plan <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/treatment-protocols"
            className="card hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-bold dark:text-white">Protocols</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Clinical procedures</p>
            <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium">
              View <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold dark:text-white">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium dark:text-white">Completed a quiz</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium dark:text-white">Studied Oral Pathology</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium dark:text-white">Reviewed {stats?.totalFlashcardsReviewed || 0} flashcards</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>

            <Link
              to="/analytics"
              className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mt-4"
            >
              View All Activity →
            </Link>
          </div>
        </div>

        {/* Achievements */}
        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-xl font-bold dark:text-white">Achievements</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
              <div className="text-3xl">🏆</div>
              <div className="flex-1">
                <h3 className="font-semibold dark:text-white">Quiz Master</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed {stats?.totalQuizzes || 0} quizzes</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
                <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{Math.min(100, (stats?.totalQuizzes || 0) * 10)}%</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
              <div className="text-3xl">📚</div>
              <div className="flex-1">
                <h3 className="font-semibold dark:text-white">Dedicated Learner</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stats?.totalStudyTime || 0} hours studied</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.min(100, (stats?.totalStudyTime || 0) * 4)}%</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
              <div className="text-3xl">⭐</div>
              <div className="flex-1">
                <h3 className="font-semibold dark:text-white">High Achiever</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stats?.averageScore?.toFixed(0) || 0}% average score</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                <div className="text-sm font-bold text-green-600 dark:text-green-400">{stats?.averageScore?.toFixed(0) || 0}%</div>
              </div>
            </div>

            <Link
              to="/achievements"
              className="block text-center text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium mt-4"
            >
              View All Achievements →
            </Link>
          </div>
        </div>
      </div>

      {/* Get Started CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Continue Learning?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Choose from our AI-powered tools or browse thousands of study resources
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/ai-quiz-generator"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 justify-center"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Quiz
          </Link>
          <Link
            to="/books"
            className="bg-blue-500/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-500/30 transition-all inline-flex items-center gap-2 justify-center"
          >
            <BookOpen className="w-5 h-5" />
            Browse Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

