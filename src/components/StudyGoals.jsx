import { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle, Trash2, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

const StudyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'quizzes',
    target: '',
    deadline: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/student-performance/my-performance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/student-performance/set-goal`,
        newGoal,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNewGoal({ type: 'quizzes', target: '', deadline: '', description: '' });
      setShowAddGoal(false);
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const getGoalProgress = (goal) => {
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  };

  const getGoalIcon = (type) => {
    switch (type) {
      case 'quizzes': return '📝';
      case 'score': return '🎯';
      case 'studyTime': return '⏰';
      case 'streak': return '🔥';
      default: return '📌';
    }
  };

  const getGoalTypeLabel = (type) => {
    switch (type) {
      case 'quizzes': return 'Quizzes';
      case 'score': return 'Average Score';
      case 'studyTime': return 'Study Hours';
      case 'streak': return 'Day Streak';
      default: return 'Custom';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Study Goals</h2>
        </div>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <form onSubmit={handleAddGoal} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Goal Type
              </label>
              <select
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="quizzes">Complete Quizzes</option>
                <option value="score">Achieve Average Score</option>
                <option value="studyTime">Study Hours</option>
                <option value="streak">Maintain Streak</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target
              </label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="e.g., 10"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., Master Periodontology"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Goal
            </button>
            <button
              type="button"
              onClick={() => setShowAddGoal(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">No goals yet. Set your first goal to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                goal.achieved
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getGoalIcon(goal.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {goal.description || `${getGoalTypeLabel(goal.type)} Goal`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Target: {goal.target} {getGoalTypeLabel(goal.type).toLowerCase()}
                    </p>
                  </div>
                </div>
                {goal.achieved && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {goal.current} / {goal.target} ({getGoalProgress(goal)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      goal.achieved ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${getGoalProgress(goal)}%` }}
                  ></div>
                </div>
              </div>

              {/* Deadline */}
              {goal.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyGoals;

