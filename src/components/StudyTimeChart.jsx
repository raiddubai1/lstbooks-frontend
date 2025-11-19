import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, BookOpen, Brain, FlaskConical, Stethoscope, Target } from 'lucide-react';

const StudyTimeChart = ({ progressData }) => {
  if (!progressData || progressData.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No study time data yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Start studying to track your time!
        </p>
      </div>
    );
  }

  // Prepare data for subject-wise study time
  const subjectTimeData = progressData
    .filter(p => p.studyTime > 0)
    .map(p => ({
      subject: p.subject?.name || 'Unknown',
      time: p.studyTime,
      hours: Math.round(p.studyTime / 60 * 10) / 10
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 10);

  // Calculate total study time
  const totalMinutes = progressData.reduce((sum, p) => sum + (p.studyTime || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  // Activity type breakdown (if available)
  const activityColors = [
    { name: 'Quizzes', color: '#3B82F6', icon: Brain },
    { name: 'Flashcards', color: '#10B981', icon: BookOpen },
    { name: 'Labs', color: '#F59E0B', icon: FlaskConical },
    { name: 'OSCE', color: '#8B5CF6', icon: Stethoscope },
    { name: 'Skills', color: '#EF4444', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Total Study Time Card */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Total Study Time</h3>
            <p className="text-4xl font-bold">
              {totalHours}h {totalMins}m
            </p>
            <p className="text-sm opacity-90 mt-2">
              Across {progressData.length} subjects
            </p>
          </div>
          <Clock className="w-24 h-24 opacity-50" />
        </div>
      </div>

      {/* Study Time by Subject */}
      {subjectTimeData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Study Time by Subject
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={subjectTimeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" label={{ value: 'Hours', position: 'insideBottom', offset: -5 }} />
              <YAxis type="category" dataKey="subject" stroke="#9CA3AF" width={150} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [`${value} hours`, 'Study Time']}
              />
              <Bar dataKey="hours" fill="#3B82F6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Study Time Breakdown by Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectTimeData.slice(0, 6).map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {item.subject}
              </h4>
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {item.hours}h
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {item.time} minutes total
            </p>
          </div>
        ))}
      </div>

      {/* Study Streak & Consistency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Study Consistency
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Subjects</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {progressData.filter(p => p.studyTime > 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Time per Subject</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(totalMinutes / progressData.length)}m
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Most Studied</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[150px]">
                {subjectTimeData[0]?.subject || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Study Goals
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Weekly Goal: 10 hours</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {Math.min(100, Math.round((totalHours / 10) * 100))}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalHours / 10) * 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep up the great work! You're making excellent progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimeChart;

