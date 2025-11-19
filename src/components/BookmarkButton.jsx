import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark } from 'lucide-react';

const BookmarkButton = ({ contentType, contentId, contentDetails, className = '' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, [contentType, contentId]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookmarks/check/${contentType}/${contentId}`
      );
      setIsBookmarked(response.data.isBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleToggleBookmark = async () => {
    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/bookmarks/content/${contentType}/${contentId}`
        );
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await axios.post(`${import.meta.env.VITE_API_URL}/bookmarks`, {
          contentType,
          contentId,
          contentDetails,
          folder: 'General'
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isBookmarked
          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-2 border-blue-500'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
};

export default BookmarkButton;

