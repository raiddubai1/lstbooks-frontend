import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import AddCoursePlanModal from '../components/AddCoursePlanModal';
import EditCoursePlanModal from '../components/EditCoursePlanModal';
import CoursePlanDetailModal from '../components/CoursePlanDetailModal';
import {
  Calendar,
  Plus,
  BookOpen,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Copy,
  Eye
} from 'lucide-react';

const CoursePlanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coursePlans, setCoursePlans] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    templates: 0,
    avgProgress: 0
  });

  useEffect(() => {
    fetchCoursePlans();
  }, []);

  const fetchCoursePlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/course-plans');
      setCoursePlans(response.data.coursePlans);

      // Calculate stats
      const all = response.data.coursePlans;
      const now = new Date();
      const active = all.filter(cp => {
        const start = new Date(cp.startDate);
        const end = new Date(cp.endDate);
        return start <= now && end >= now;
      });
      const templates = all.filter(cp => cp.isTemplate);
      const avgProgress = all.length > 0
        ? Math.round(all.reduce((sum, cp) => sum + (cp.progressPercentage || 0), 0) / all.length)
        : 0;

      setStats({
        total: all.length,
        active: active.length,
        templates: templates.length,
        avgProgress
      });
    } catch (error) {
      console.error('Error fetching course plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course plan?')) return;

    try {
      await api.delete(`/course-plans/${id}`);
      fetchCoursePlans();
    } catch (error) {
      console.error('Error deleting course plan:', error);
      alert('Failed to delete course plan');
    }
  };

  const getSemesterBadge = (semester) => {
    const colors = {
      '1': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      '2': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'Summer': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      'Full Year': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    };
    return colors[semester] || colors['Full Year'];
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 50) return 'bg-blue-600';
    if (percentage >= 25) return 'bg-orange-600';
    return 'bg-gray-400';
  };

  return (
    <div>
      <SectionHeader
        title="Course Planner"
        subtitle="Create and manage course schedules, assign weekly topics, and track curriculum coverage"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Plans</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-300 font-medium">Active Courses</p>
              <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">{stats.active}</p>
            </div>
            <Clock className="w-10 h-10 text-green-600 dark:text-green-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Templates</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">{stats.templates}</p>
            </div>
            <Copy className="w-10 h-10 text-purple-600 dark:text-purple-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Avg Progress</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-white mt-1">{stats.avgProgress}%</p>
            </div>
            <CheckCircle className="w-10 h-10 text-orange-600 dark:text-orange-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Course Plans</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Course Plan
          </button>
        </div>
      </div>

      {/* Course Plans List */}
      {loading ? (
        <Loading />
      ) : coursePlans.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Course Plans Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first course plan to organize your curriculum
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Create First Course Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {coursePlans.map((plan) => (
            <div key={plan._id} className="card hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {plan.title}
                    </h3>
                    {plan.isTemplate && (
                      <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        Template
                      </span>
                    )}
                  </div>
                  {plan.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {plan.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Year</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Year {plan.year}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Semester</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${getSemesterBadge(plan.semester)}`}>
                    {plan.semester === '1' ? 'Fall' : plan.semester === '2' ? 'Spring' : plan.semester}
                  </span>
                </div>
                {plan.subject && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Subject</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.subject.name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {plan.totalWeeks} weeks
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.completedWeeks}/{plan.totalWeeks} weeks
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(plan.progressPercentage || 0)}`}
                    style={{ width: `${plan.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Dates */}
              {plan.startDate && plan.endDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  View
                </button>
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="btn-secondary text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddCoursePlanModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCoursePlans();
          }}
        />
      )}

      {selectedPlan && (
        <CoursePlanDetailModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onEdit={(plan) => {
            setSelectedPlan(null);
            setEditingPlan(plan);
          }}
          onDelete={(planId) => {
            setSelectedPlan(null);
            handleDelete(planId);
          }}
          onUpdate={fetchCoursePlans}
        />
      )}

      {editingPlan && (
        <EditCoursePlanModal
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSuccess={() => {
            setEditingPlan(null);
            fetchCoursePlans();
          }}
        />
      )}
    </div>
  );
};

export default CoursePlanner;
