import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, Star, Folder, Filter, Trash2, Edit, BookOpen, Brain, CreditCard, FlaskConical, Stethoscope, ClipboardList, GraduationCap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const contentTypeIcons = {
  subject: BookOpen,
  quiz: Brain,
  flashcard: CreditCard,
  lab: FlaskConical,
  osce: Stethoscope,
  skill: ClipboardList,
  year: GraduationCap,
  note: FileText
};

const contentTypeColors = {
  subject: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  quiz: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  flashcard: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  lab: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  osce: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400',
  skill: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
  year: 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400',
  note: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
};

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchBookmarks();
    fetchFolders();
  }, [selectedFolder, selectedType, showFavoritesOnly]);

  const fetchBookmarks = async () => {
    try {
      const params = {};
      if (selectedFolder) params.folder = selectedFolder;
      if (selectedType) params.contentType = selectedType;
      if (showFavoritesOnly) params.isFavorite = 'true';

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookmarks/my-bookmarks`, { params });
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookmarks/folders`);
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleToggleFavorite = async (bookmarkId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/bookmarks/${bookmarkId}/favorite`);
      fetchBookmarks();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (!confirm('Are you sure you want to remove this bookmark?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/bookmarks/${bookmarkId}`);
      fetchBookmarks();
      fetchFolders();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleNavigateToContent = (bookmark) => {
    const routes = {
      subject: `/subjects/${bookmark.contentId}`,
      quiz: `/quizzes/${bookmark.contentId}`,
      flashcard: `/flashcards?subjectId=${bookmark.contentId}`,
      lab: `/labs/${bookmark.contentId}`,
      osce: `/osce/${bookmark.contentId}`,
      skill: `/clinical-skills/${bookmark.contentId}`,
      year: `/years/${bookmark.contentId}`,
      note: `/notes`
    };

    const route = routes[bookmark.contentType];
    if (route) navigate(route);
  };

  const favoriteBookmarks = bookmarks.filter(b => b.isFavorite);
  const regularBookmarks = bookmarks.filter(b => !b.isFavorite);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bookmarks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Folders</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="subject">Subjects</option>
              <option value="quiz">Quizzes</option>
              <option value="flashcard">Flashcards</option>
              <option value="lab">Labs</option>
              <option value="osce">OSCE</option>
              <option value="skill">Skills</option>
              <option value="year">Years</option>
              <option value="note">Notes</option>
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                showFavoritesOnly
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              Favorites Only
            </button>

            <button
              onClick={() => {
                setSelectedFolder('');
                setSelectedType('');
                setShowFavoritesOnly(false);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bookmarks */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No bookmarks yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Bookmark content to save it for later!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Favorite Bookmarks */}
            {favoriteBookmarks.length > 0 && !showFavoritesOnly && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current text-yellow-500" />
                  Favorites
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark._id}
                      bookmark={bookmark}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteBookmark}
                      onNavigate={handleNavigateToContent}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Bookmarks */}
            {(regularBookmarks.length > 0 || showFavoritesOnly) && (
              <div>
                {favoriteBookmarks.length > 0 && !showFavoritesOnly && (
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">All Bookmarks</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(showFavoritesOnly ? favoriteBookmarks : regularBookmarks).map((bookmark) => (
                    <BookmarkCard
                      key={bookmark._id}
                      bookmark={bookmark}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteBookmark}
                      onNavigate={handleNavigateToContent}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const BookmarkCard = ({ bookmark, onToggleFavorite, onDelete, onNavigate }) => {
  const Icon = contentTypeIcons[bookmark.contentType] || Bookmark;
  const colorClass = contentTypeColors[bookmark.contentType] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className={`${colorClass} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
          <Icon className="w-3 h-3" />
          {bookmark.contentType}
        </div>
        <button
          onClick={() => onToggleFavorite(bookmark._id)}
          className={`${
            bookmark.isFavorite
              ? 'text-yellow-500 fill-current'
              : 'text-gray-400 hover:text-yellow-500'
          }`}
        >
          <Star className={`w-5 h-5 ${bookmark.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <h3 
        onClick={() => onNavigate(bookmark)}
        className="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
      >
        {bookmark.contentDetails?.title || 'Untitled'}
      </h3>

      {bookmark.contentDetails?.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {bookmark.contentDetails.description}
        </p>
      )}

      {bookmark.contentDetails?.subjectName && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
          Subject: {bookmark.contentDetails.subjectName}
        </p>
      )}

      {bookmark.notes && (
        <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
          "{bookmark.notes}"
        </p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Folder className="w-3 h-3" />
          {bookmark.folder}
        </div>
        <button
          onClick={() => onDelete(bookmark._id)}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Bookmarks;

