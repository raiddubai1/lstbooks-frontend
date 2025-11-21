import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  Search,
  Clock,
  Star,
  Users,
  CheckCircle,
  BookOpen,
  GraduationCap,
  Target,
  TrendingUp,
  Plus,
  Play,
  Award
} from 'lucide-react';
import { getUserRole } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StudyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'enrolled'
  const userRole = getUserRole();

  const years = ['Foundation Year', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'All Years'];
  const categories = [
    { value: 'exam-prep', label: 'Exam Preparation', icon: Target },
    { value: 'subject-mastery', label: 'Subject Mastery', icon: BookOpen },
    { value: 'quick-review', label: 'Quick Review', icon: Clock },
    { value: 'comprehensive', label: 'Comprehensive', icon: Award },
    { value: 'osce-prep', label: 'OSCE Preparation', icon: Users }
  ];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchSubjects();
    fetchPlans();
  }, [selectedSubject, selectedYear, selectedCategory, selectedDifficulty, searchTerm, sortBy, activeTab]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'enrolled') {
        const token = localStorage.getItem('token');
        if (!token) {
          setPlans([]);
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_URL}/api/study-plans/user/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlans(response.data);
      } else {
        const params = new URLSearchParams();
        if (selectedSubject) params.append('subject', selectedSubject);
        if (selectedYear) params.append('year', selectedYear);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
        if (searchTerm) params.append('search', searchTerm);
        params.append('sort', sortBy);

        const response = await axios.get(`${API_URL}/api/study-plans?${params}`);
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error fetching study plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Calendar;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📅 Study Plans</h1>
              <p className="text-indigo-100 text-lg">
                Structured learning paths to master dental subjects
              </p>
            </div>
            {(userRole === 'teacher' || userRole === 'admin') && (
              <Link
                to="/study-plans/create"
                className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Plan
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{plans.length}</div>
              <div className="text-indigo-100 text-sm">Total Plans</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{subjects.length}</div>
              <div className="text-indigo-100 text-sm">Subjects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">
                {plans.reduce((sum, plan) => sum + plan.duration, 0)}
              </div>
              <div className="text-indigo-100 text-sm">Total Days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">
                {plans.reduce((sum, plan) => sum + plan.totalEnrollments, 0)}
              </div>
              <div className="text-indigo-100 text-sm">Enrollments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            All Plans
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'enrolled'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            My Plans
          </button>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'all' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search study plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-averageRating">Highest Rated</option>
                <option value="-totalEnrollments">Most Popular</option>
                <option value="duration">Shortest First</option>
                <option value="-duration">Longest First</option>
              </select>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading study plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeTab === 'enrolled' ? 'No enrolled plans' : 'No study plans found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'enrolled'
                ? 'Start learning by enrolling in a study plan'
                : 'Try adjusting your filters or search term'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => {
              const CategoryIcon = getCategoryIcon(plan.category);
              const enrollment = plan.userEnrollment;

              return (
                <Link
                  key={plan._id}
                  to={`/study-plans/${plan._id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {plan.category.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(plan.difficulty)}`}>
                        {plan.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {plan.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {plan.description}
                    </p>

                    {/* Progress Bar (if enrolled) */}
                    {enrollment && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {Math.round(enrollment.progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Day {enrollment.currentDay} of {plan.duration}
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {plan.duration} days
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {plan.totalEnrollments}
                      </div>
                      {plan.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {plan.averageRating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {plan.year}
                        </span>
                      </div>
                      {plan.subject && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {plan.subject.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Enrollment Status */}
                    {enrollment && (
                      <div className="mt-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          enrollment.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : enrollment.status === 'active'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {enrollment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {enrollment.status === 'active' && <Play className="w-3 h-3" />}
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlans;

