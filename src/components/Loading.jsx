import { useEffect, useState } from 'react';

const Loading = ({ message = 'Loading...' }) => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // Show "taking longer than usual" message after 5 seconds
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
      {showSlowMessage && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          This is taking longer than usual... The server might be waking up.
        </p>
      )}
    </div>
  );
};

export default Loading;

