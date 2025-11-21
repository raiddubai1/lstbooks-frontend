import { X, Edit, Brain, BookOpen, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeckDetailModal = ({ deck, onClose, onEdit }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'learning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mastered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleStudy = () => {
    onClose();
    navigate(`/spaced-repetition/study/${deck._id}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {deck.name}
              </h2>
              {deck.featured && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            {deck.description && (
              <p className="text-gray-600 dark:text-gray-400">{deck.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Category</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{deck.category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Year</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Year {deck.year}</p>
            </div>
            {deck.subject && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Subject</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{deck.subject.name}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Visibility</p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${deck.isPublic ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {deck.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Cards</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{deck.totalCards || 0}</p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-yellow-600" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Due Today</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(deck.newCards || 0) + (deck.reviewCards || 0)}
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Mastered</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{deck.masteredCards || 0}</p>
            </div>

            {deck.isPublic && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-purple-600" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Subscribers</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{deck.subscriberCount || 0}</p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-medium">Mastery Progress</span>
              <span>
                {deck.totalCards > 0
                  ? Math.round(((deck.masteredCards || 0) / deck.totalCards) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                style={{
                  width: `${deck.totalCards > 0
                    ? ((deck.masteredCards || 0) / deck.totalCards) * 100
                    : 0}%`
                }}
              />
            </div>
          </div>

          {/* Card Status Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Card Status Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center">
                <div className={`${getStatusColor('new')} rounded-lg px-4 py-3 font-bold text-2xl mb-2`}>
                  {deck.newCards || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
              </div>
              <div className="text-center">
                <div className={`${getStatusColor('learning')} rounded-lg px-4 py-3 font-bold text-2xl mb-2`}>
                  {deck.learningCards || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Learning</p>
              </div>
              <div className="text-center">
                <div className={`${getStatusColor('review')} rounded-lg px-4 py-3 font-bold text-2xl mb-2`}>
                  {deck.reviewCards || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review</p>
              </div>
              <div className="text-center">
                <div className={`${getStatusColor('mastered')} rounded-lg px-4 py-3 font-bold text-2xl mb-2`}>
                  {deck.masteredCards || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mastered</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Study Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Cards Per Day</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{deck.newCardsPerDay || 20}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Reviews Per Day</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{deck.maxReviewsPerDay || 100}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {deck.tags && deck.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {deck.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner */}
          {deck.owner && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Created By</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{deck.owner.name || deck.owner.email}</p>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium mb-1">Created</p>
              <p>{new Date(deck.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Last Updated</p>
              <p>{new Date(deck.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-wrap gap-3">
            {((deck.newCards || 0) + (deck.reviewCards || 0)) > 0 && (
              <button
                onClick={handleStudy}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Study Now ({(deck.newCards || 0) + (deck.reviewCards || 0)} cards)
              </button>
            )}
            <button
              onClick={() => onEdit(deck)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Deck
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckDetailModal;

