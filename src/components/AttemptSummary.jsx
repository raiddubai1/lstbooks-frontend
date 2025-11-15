import { CheckCircle, XCircle, Clock, Award, AlertTriangle } from 'lucide-react';

const AttemptSummary = ({ attempt, onRetry, onBackToList }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percent) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 70) return 'text-blue-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percent) => {
    if (percent >= 90) return 'bg-green-50 border-green-200';
    if (percent >= 70) return 'bg-blue-50 border-blue-200';
    if (percent >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const passed = attempt.percent >= 70;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <div className={`border-2 rounded-lg p-8 mb-6 ${getScoreBgColor(attempt.percent)}`}>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-white shadow-lg">
            {passed ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {passed 
              ? 'You passed the quiz! Great job!' 
              : 'You need more practice. Review the material and try again.'}
          </p>

          {/* Score Display */}
          <div className="bg-white rounded-lg p-6 shadow-sm inline-block">
            <p className={`text-6xl font-bold mb-2 ${getScoreColor(attempt.percent)}`}>
              {attempt.percent.toFixed(1)}%
            </p>
            <p className="text-gray-600">
              {attempt.totalScore} / {attempt.maxScore} points
            </p>
          </div>

          {attempt.isTimedOut && (
            <div className="mt-4 flex items-center justify-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Auto-submitted due to time limit</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempt.correctAnswers} / {attempt.totalQuestions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Taken</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(attempt.durationSec)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempt.totalScore}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onBackToList}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back to Quizzes
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Retry Quiz
        </button>
      </div>
    </div>
  );
};

export default AttemptSummary;

