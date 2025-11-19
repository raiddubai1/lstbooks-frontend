import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

const QuizAnalytics = ({ progress }) => {
  if (!progress || !progress.quizAttempts || progress.quizAttempts.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No quiz attempts yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Take some quizzes to see your analytics!
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const quizAttempts = progress.quizAttempts.slice(-10).map((attempt, index) => ({
    name: `Attempt ${index + 1}`,
    score: attempt.score,
    time: Math.round(attempt.timeSpent / 60), // Convert to minutes
    date: new Date(attempt.completedAt).toLocaleDateString()
  }));

  // Score distribution data
  const scoreRanges = [
    { range: '0-20%', count: 0, color: '#EF4444' },
    { range: '21-40%', count: 0, color: '#F97316' },
    { range: '41-60%', count: 0, color: '#F59E0B' },
    { range: '61-80%', count: 0, color: '#84CC16' },
    { range: '81-100%', count: 0, color: '#10B981' }
  ];

  progress.quizAttempts.forEach(attempt => {
    if (attempt.score <= 20) scoreRanges[0].count++;
    else if (attempt.score <= 40) scoreRanges[1].count++;
    else if (attempt.score <= 60) scoreRanges[2].count++;
    else if (attempt.score <= 80) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  });

  const stats = progress.quizStats || {
    totalAttempts: progress.quizAttempts.length,
    averageScore: Math.round(progress.quizAttempts.reduce((sum, a) => sum + a.score, 0) / progress.quizAttempts.length),
    bestScore: Math.max(...progress.quizAttempts.map(a => a.score)),
    totalTimeSpent: Math.round(progress.quizAttempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / 60)
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.totalAttempts}</span>
          </div>
          <p className="text-sm opacity-90">Total Attempts</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.averageScore}%</span>
          </div>
          <p className="text-sm opacity-90">Average Score</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.bestScore}%</span>
          </div>
          <p className="text-sm opacity-90">Best Score</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.totalTimeSpent}m</span>
          </div>
          <p className="text-sm opacity-90">Total Time</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Score Trend (Last 10 Attempts)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quizAttempts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Score (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scoreRanges}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {scoreRanges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;

