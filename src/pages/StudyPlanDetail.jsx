import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Users,
  CheckCircle,
  Circle,
  Play,
  Pause,
  BookOpen,
  Brain,
  Video,
  FileText,
  Target
} from 'lucide-react';
import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StudyPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const token = getToken();

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/study-plans/${id}`);
      setPlan(response.data);
    } catch (error) {
      console.error('Error fetching study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!token) {
      alert('Please login to enroll in this study plan');
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await axios.post(
        `${API_URL}/api/study-plans/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Successfully enrolled in study plan!');
      fetchPlan();
    } catch (error) {
      console.error('Error enrolling:', error);
      alert(error.response?.data?.error || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDayComplete = async (day) => {
    if (!token) return;

    try {
      await axios.post(
        `${API_URL}/api/study-plans/${id}/progress`,
        { day },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPlan();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'read': return BookOpen;
      case 'quiz': return Brain;
      case 'flashcard': return FileText;
      case 'video': return Video;
      case 'practice': return Target;
      default: return Circle;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading study plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Study plan not found
          </h2>
          <Link
            to="/study-plans"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Back to Study Plans
          </Link>
        </div>
      </div>
    );
  }

  const userEnrollment = plan.enrollments?.find(e => e.user === token);
  const isEnrolled = !!userEnrollment;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/study-plans"
            className="inline-flex items-center gap-2 text-indigo-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Study Plans
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{plan.name}</h1>
              <p className="text-xl text-indigo-100 mb-4">{plan.description}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-indigo-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {plan.duration} days
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {plan.totalEnrollments} enrolled
                </div>
                {plan.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    {plan.averageRating.toFixed(1)} ({plan.ratings.length} ratings)
                  </div>
                )}
              </div>
            </div>

            {/* Enroll Button */}
            {!isEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="ml-4 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 disabled:opacity-50 transition-colors"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>

          {/* Progress Bar (if enrolled) */}
          {isEnrolled && userEnrollment && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Your Progress</span>
                <span className="font-semibold">{Math.round(userEnrollment.progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ width: `${userEnrollment.progress}%` }}
                />
              </div>
              <div className="text-sm mt-2">
                Day {userEnrollment.currentDay} of {plan.duration} • {userEnrollment.completedDays.length} days completed
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goals */}
        {plan.goals && plan.goals.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" />
              Learning Goals
            </h2>
            <ul className="space-y-2">
              {plan.goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Daily Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Daily Schedule ({plan.duration} Days)
          </h2>

          <div className="space-y-4">
            {plan.dailyTasks && plan.dailyTasks.map((dayTask) => {
              const isCompleted = userEnrollment?.completedDays.includes(dayTask.day);
              const isCurrent = userEnrollment?.currentDay === dayTask.day;

              return (
                <div
                  key={dayTask.day}
                  className={`border rounded-lg p-4 ${
                    isCompleted
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : isCurrent
                      ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Day {dayTask.day}: {dayTask.title}
                        </h3>
                        {dayTask.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {dayTask.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {isEnrolled && !isCompleted && (
                      <button
                        onClick={() => handleDayComplete(dayTask.day)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>

                  {/* Tasks */}
                  {dayTask.tasks && dayTask.tasks.length > 0 && (
                    <div className="ml-9 space-y-2">
                      {dayTask.tasks.map((task, taskIndex) => {
                        const TaskIcon = getTaskIcon(task.type);
                        return (
                          <div
                            key={taskIndex}
                            className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <TaskIcon className="w-4 h-4 text-gray-400" />
                            <span>{task.title}</span>
                            {task.duration && (
                              <span className="text-gray-500 dark:text-gray-400">
                                ({task.duration} min)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Estimated Time */}
                  {dayTask.estimatedTime && (
                    <div className="ml-9 mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      Estimated time: {dayTask.estimatedTime} minutes
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanDetail;

