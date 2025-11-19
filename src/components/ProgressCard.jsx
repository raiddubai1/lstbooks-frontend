import { TrendingUp, Clock, Award, Target } from 'lucide-react';

const ProgressCard = ({ progress }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const formatStudyTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Subject Name */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {progress.subject?.name || 'Unknown Subject'}
        </h3>
        <div className={`text-2xl font-bold ${getProgressColor(progress.overallProgress)}`}>
          {progress.overallProgress}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressBgColor(progress.overallProgress)}`}
            style={{ width: `${progress.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Quiz Stats */}
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quizzes</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {progress.quizStats?.totalAttempts || 0} attempts
            </p>
          </div>
        </div>

        {/* Average Score */}
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Score</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {progress.quizStats?.averageScore || 0}%
            </p>
          </div>
        </div>

        {/* Study Time */}
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Study Time</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatStudyTime(progress.studyTime || 0)}
            </p>
          </div>
        </div>

        {/* Milestones */}
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Milestones</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {progress.milestones?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Flashcard Progress */}
      {progress.flashcardStats && progress.flashcardStats.total > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Flashcard Mastery</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-600 dark:text-green-400">
                  Mastered: {progress.flashcardStats.mastered}
                </span>
                <span className="text-yellow-600 dark:text-yellow-400">
                  Reviewing: {progress.flashcardStats.reviewing}
                </span>
                <span className="text-blue-600 dark:text-blue-400">
                  Learning: {progress.flashcardStats.learning}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 flex overflow-hidden">
                <div
                  className="bg-green-600 h-2"
                  style={{ width: `${(progress.flashcardStats.mastered / progress.flashcardStats.total) * 100}%` }}
                />
                <div
                  className="bg-yellow-600 h-2"
                  style={{ width: `${(progress.flashcardStats.reviewing / progress.flashcardStats.total) * 100}%` }}
                />
                <div
                  className="bg-blue-600 h-2"
                  style={{ width: `${(progress.flashcardStats.learning / progress.flashcardStats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Milestones */}
      {progress.milestones && progress.milestones.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent Achievements</p>
          <div className="space-y-1">
            {progress.milestones.slice(-2).reverse().map((milestone, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <Award className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-700 dark:text-gray-300">{milestone.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;

