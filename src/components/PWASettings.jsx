import { useState, useEffect } from 'react';
import { Download, Bell, Wifi, Database, Trash2, RefreshCw } from 'lucide-react';
import { 
  showInstallPrompt, 
  isAppInstalled, 
  requestNotificationPermission,
  isOnline,
  getNetworkInfo
} from '../utils/pwa';
import { clearStore, STORES } from '../utils/offlineStorage';

const PWASettings = () => {
  const [installed, setInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [online, setOnline] = useState(true);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    // Check if app is installed
    setInstalled(isAppInstalled());

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check online status
    setOnline(isOnline());

    // Get network info
    const info = getNetworkInfo();
    setNetworkInfo(info);

    // Estimate cache size
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        setCacheSize(Math.round(estimate.usage / 1024 / 1024)); // Convert to MB
      });
    }

    // Listen for online/offline events
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await showInstallPrompt();
    if (accepted) {
      setInstalled(true);
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all offline data? This cannot be undone.')) {
      try {
        await Promise.all([
          clearStore(STORES.QUIZZES),
          clearStore(STORES.FLASHCARDS),
          clearStore(STORES.NOTES),
          clearStore(STORES.BOOKMARKS),
          clearStore(STORES.PROGRESS),
          clearStore(STORES.PENDING_ACTIONS)
        ]);

        // Clear service worker cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        alert('Cache cleared successfully!');
        setCacheSize(0);
      } catch (error) {
        alert('Failed to clear cache: ' + error.message);
      }
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Progressive Web App
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Manage offline features, notifications, and app installation.
        </p>
      </div>

      {/* Installation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
              <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Install App
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {installed 
                  ? 'App is installed on your device'
                  : 'Install the app for offline access and quick launch'
                }
              </p>
            </div>
          </div>
          {!installed && (
            <button
              onClick={handleInstall}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Install
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
              <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notificationsEnabled
                  ? 'Notifications are enabled'
                  : 'Enable notifications for reminders and updates'
                }
              </p>
            </div>
          </div>
          {!notificationsEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Enable
            </button>
          )}
        </div>
      </div>

      {/* Network Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-3 ${online ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <Wifi className={`w-6 h-6 ${online ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Network Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {online ? 'Connected' : 'Offline'}
            </p>
            {networkInfo && online && (
              <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <p>Connection: {networkInfo.effectiveType}</p>
                <p>Downlink: {networkInfo.downlink} Mbps</p>
                <p>RTT: {networkInfo.rtt} ms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cache Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3">
              <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Offline Storage
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cache size: {cacheSize} MB
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </button>
          <button
            onClick={handleReload}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload App
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWASettings;

