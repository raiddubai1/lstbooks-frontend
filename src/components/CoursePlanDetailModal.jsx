import { X, Edit, Trash2, Calendar, Clock, BookOpen, CheckCircle, Copy } from 'lucide-react';

const CoursePlanDetailModal = ({ plan, onClose, onEdit, onDelete }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.title}
              </h2>
              {plan.isTemplate && (
                <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                  Template
                </span>
              )}
            </div>
            {plan.description && (
              <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Year</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Year {plan.year}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Semester</p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${getSemesterBadge(plan.semester)}`}>
                {plan.semester === '1' ? 'Fall' : plan.semester === '2' ? 'Spring' : plan.semester}
              </span>
            </div>
            {plan.academicYear && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Academic Year</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{plan.academicYear}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{plan.totalWeeks} weeks</p>
            </div>
          </div>

          {/* Dates */}
          {plan.startDate && plan.endDate && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {plan.completedWeeks}/{plan.totalWeeks} weeks completed
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getProgressColor(plan.progressPercentage || 0)}`}
                style={{ width: `${plan.progressPercentage || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {plan.progressPercentage || 0}% complete
            </p>
          </div>

          {/* Subject */}
          {plan.subject && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subject</h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">{plan.subject.name}</span>
              </div>
            </div>
          )}

          {/* Weeks */}
          {plan.weeks && plan.weeks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Weekly Schedule</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {plan.weeks.map((week, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      week.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          Week {week.weekNumber}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{week.title}</span>
                      </div>
                      {week.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    {week.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{week.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {plan.tags && plan.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {plan.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onEdit(plan)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={() => onDelete(plan._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlanDetailModal;

