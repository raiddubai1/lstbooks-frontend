import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Plus, Check, Trash2, Clock, AlertCircle, Calendar } from 'lucide-react';
import ReminderModal from '../components/ReminderModal';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [todayReminders, setTodayReminders] = useState([]);
  const [overdueReminders, setOverdueReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReminders();
    fetchTodayReminders();
    fetchOverdueReminders();
  }, [filter]);

  const fetchReminders = async () => {
    try {
      const params = {};
      if (filter === 'pending') params.status = 'pending';
      if (filter === 'completed') params.status = 'completed';
      if (filter === 'upcoming') params.upcoming = 'true';

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reminders/my-reminders`, { params });
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayReminders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reminders/today`);
      setTodayReminders(response.data);
    } catch (error) {
      console.error('Error fetching today reminders:', error);
    }
  };

  const fetchOverdueReminders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reminders/overdue`);
      setOverdueReminders(response.data);
    } catch (error) {
      console.error('Error fetching overdue reminders:', error);
    }
  };

  const handleCreateReminder = () => {
    setEditingReminder(null);
    setIsModalOpen(true);
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleCompleteReminder = async (reminderId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/reminders/${reminderId}/complete`);
      fetchReminders();
      fetchTodayReminders();
      fetchOverdueReminders();
    } catch (error) {
      console.error('Error completing reminder:', error);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/reminders/${reminderId}`);
      fetchReminders();
      fetchTodayReminders();
      fetchOverdueReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleSaveReminder = async (reminderData) => {
    try {
      if (editingReminder) {
        await axios.put(`${import.meta.env.VITE_API_URL}/reminders/${editingReminder._id}`, reminderData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/reminders`, reminderData);
      }
      setIsModalOpen(false);
      fetchReminders();
      fetchTodayReminders();
      fetchOverdueReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Reminders</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {pendingReminders.length} pending • {completedReminders.length} completed
            </p>
          </div>
          <button
            onClick={handleCreateReminder}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Reminder
          </button>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Overdue */}
          {overdueReminders.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-900 dark:text-red-300">Overdue Reminders</h3>
              </div>
              <p className="text-red-700 dark:text-red-400">
                You have {overdueReminders.length} overdue {overdueReminders.length === 1 ? 'reminder' : 'reminders'}
              </p>
            </div>
          )}

          {/* Today */}
          {todayReminders.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Today's Reminders</h3>
              </div>
              <p className="text-blue-700 dark:text-blue-400">
                You have {todayReminders.length} {todayReminders.length === 1 ? 'reminder' : 'reminders'} for today
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Upcoming (7 days)
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No reminders yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Create your first reminder to stay on track!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <ReminderCard
                key={reminder._id}
                reminder={reminder}
                onComplete={handleCompleteReminder}
                onEdit={handleEditReminder}
                onDelete={handleDeleteReminder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {isModalOpen && (
        <ReminderModal
          reminder={editingReminder}
          onSave={handleSaveReminder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const ReminderCard = ({ reminder, onComplete, onEdit, onDelete }) => {
  const isOverdue = !reminder.isCompleted && new Date(reminder.reminderDate) < new Date();
  const isToday = new Date(reminder.reminderDate).toDateString() === new Date().toDateString();

  const priorityColors = {
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    medium: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    high: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border-2 rounded-lg p-4 shadow-sm ${
      isOverdue ? 'border-red-300 dark:border-red-700' : 
      isToday ? 'border-blue-300 dark:border-blue-700' : 
      'border-gray-200 dark:border-gray-700'
    } ${reminder.isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => !reminder.isCompleted && onComplete(reminder._id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            reminder.isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          }`}
        >
          {reminder.isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`text-lg font-semibold ${
                reminder.isCompleted 
                  ? 'text-gray-500 dark:text-gray-500 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {reminder.title}
              </h3>
              {reminder.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {reminder.description}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[reminder.priority]}`}>
              {reminder.priority}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(reminder.reminderDate).toLocaleString()}
            </div>
            {reminder.recurrence !== 'none' && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded text-xs">
                {reminder.recurrence}
              </span>
            )}
            {isOverdue && !reminder.isCompleted && (
              <span className="text-red-600 dark:text-red-400 font-semibold">Overdue</span>
            )}
            {isToday && !reminder.isCompleted && (
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Today</span>
            )}
          </div>

          {reminder.relatedContent?.contentTitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Related: {reminder.relatedContent.contentTitle}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(reminder)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Clock className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(reminder._id)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reminders;

