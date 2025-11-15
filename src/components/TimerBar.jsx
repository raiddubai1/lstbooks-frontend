import { Clock, AlertTriangle } from 'lucide-react';

const TimerBar = ({ timeLeft, totalTime, onTimeout }) => {
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage remaining
  const percentRemaining = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;

  // Determine color based on time remaining
  const getColor = () => {
    if (percentRemaining > 50) return 'bg-green-600';
    if (percentRemaining > 20) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getTextColor = () => {
    if (percentRemaining > 50) return 'text-green-600';
    if (percentRemaining > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Auto-submit when time runs out
  if (timeLeft === 0 && onTimeout) {
    onTimeout();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {percentRemaining <= 20 ? (
            <AlertTriangle className={`w-5 h-5 ${getTextColor()} animate-pulse`} />
          ) : (
            <Clock className={`w-5 h-5 ${getTextColor()}`} />
          )}
          <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        </div>
        <span className={`text-2xl font-mono font-bold ${getTextColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${getColor()}`}
          style={{ width: `${percentRemaining}%` }}
        />
      </div>
      
      {percentRemaining <= 20 && (
        <p className="text-xs text-red-600 mt-2 font-medium">
          ⚠️ Time is running out! Submit soon to avoid auto-submission.
        </p>
      )}
    </div>
  );
};

export default TimerBar;

