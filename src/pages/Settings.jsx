import { useState } from 'react';
import { getUser, setUser } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';
import SectionHeader from '../components/SectionHeader';
import { User, Bell, Lock, Palette, Sun, Moon, Monitor } from 'lucide-react';

const Settings = () => {
  const user = getUser();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    year: user?.year || '',
    university: user?.university || ''
  });

  const handleSave = () => {
    // In a real app, this would call an API
    setUser({ ...user, ...formData });
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <SectionHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                activeTab === 'notifications' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                activeTab === 'security' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
              }`}
            >
              <Lock className="w-5 h-5" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                activeTab === 'appearance' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
              }`}
            >
              <Palette className="w-5 h-5" />
              Appearance
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <select
                      className="input"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                      <option value="5">Year 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    />
                  </div>
                </div>

                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Quiz Reminders</p>
                    <p className="text-sm text-gray-600">Get notified about upcoming quizzes</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Study Streaks</p>
                    <p className="text-sm text-gray-600">Daily reminders to maintain your streak</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">New Content</p>
                    <p className="text-sm text-gray-600">Alerts when new materials are added</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>

                <button className="btn-primary">Update Password</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Appearance</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme Preference
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Choose how lstBooks looks to you. Select a single theme, or sync with your system preferences.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Light Theme */}
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        theme === 'light'
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <Sun className="w-8 h-8 text-yellow-500" />
                      </div>
                      <div className="w-full h-20 bg-white border border-gray-200 rounded mb-3 flex items-center justify-center">
                        <div className="space-y-2 w-full px-3">
                          <div className="h-2 bg-gray-200 rounded"></div>
                          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <p className="text-sm font-medium dark:text-white">Light</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Bright and clear
                      </p>
                    </button>

                    {/* Dark Theme */}
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        theme === 'dark'
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <Moon className="w-8 h-8 text-indigo-500" />
                      </div>
                      <div className="w-full h-20 bg-gray-900 border border-gray-700 rounded mb-3 flex items-center justify-center">
                        <div className="space-y-2 w-full px-3">
                          <div className="h-2 bg-gray-700 rounded"></div>
                          <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                      <p className="text-sm font-medium dark:text-white">Dark</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Easy on the eyes
                      </p>
                    </button>

                    {/* Auto Theme */}
                    <button
                      onClick={() => setTheme('auto')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        theme === 'auto'
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <Monitor className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="w-full h-20 bg-gradient-to-br from-white via-gray-400 to-gray-900 border border-gray-300 rounded mb-3"></div>
                      <p className="text-sm font-medium dark:text-white">Auto</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sync with system
                      </p>
                    </button>
                  </div>
                </div>

                {/* Current Theme Info */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {theme === 'light' && <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                      {theme === 'dark' && <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                      {theme === 'auto' && <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Current theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {theme === 'auto'
                          ? 'Theme automatically switches based on your system preferences'
                          : `You're using ${theme} mode across all pages`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

