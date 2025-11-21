import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Clock,
  Star,
  Eye,
  Download,
  BookOpen,
  GraduationCap,
  Tag,
  FileText,
  Lightbulb,
  Image as ImageIcon,
  ThumbsUp,
  Share2,
  Bookmark,
  Edit,
  Trash2
} from 'lucide-react';
import { getUserRole, getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RevisionNoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const userRole = getUserRole();
  const token = getToken();

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/revision-notes/${id}`);
      setNote(response.data);
    } catch (error) {
      console.error('Error fetching revision note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async () => {
    if (!token) {
      alert('Please login to rate this note');
      return;
    }

    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    try {
      setSubmittingRating(true);
      const response = await axios.post(
        `${API_URL}/api/revision-notes/${id}/rate`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNote(response.data);
      setRating(0);
      setComment('');
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this revision note?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/revision-notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Revision note deleted successfully');
      navigate('/revision-notes');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading revision note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Revision note not found
          </h2>
          <Link
            to="/revision-notes"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            Back to Revision Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/revision-notes"
            className="inline-flex items-center gap-2 text-purple-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Revision Notes
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(note.difficulty)}`}>
                  {note.difficulty}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {note.category.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-3">{note.title}</h1>
              <p className="text-xl text-purple-100 mb-4">{note.topic}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-purple-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {note.estimatedReadTime} min read
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {note.views} views
                </div>
                {note.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    {note.averageRating.toFixed(1)} ({note.ratings.length} ratings)
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {note.year}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {note.subject?.name}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              {(userRole === 'teacher' || userRole === 'admin') && (
                <>
                  <Link
                    to={`/revision-notes/${id}/edit`}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  {userRole === 'admin' && (
                    <button
                      onClick={handleDelete}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        </div>

        {/* Key Points */}
        {note.keyPoints && note.keyPoints.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              Key Points
            </h2>
            <ul className="space-y-2">
              {note.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mnemonics */}
        {note.mnemonics && note.mnemonics.length > 0 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              Mnemonics
            </h2>
            <div className="space-y-4">
              {note.mnemonics.map((mnemonic, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="font-bold text-purple-600 dark:text-purple-400 text-lg mb-1">
                    {mnemonic.acronym}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 mb-2">
                    {mnemonic.meaning}
                  </div>
                  {mnemonic.explanation && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {mnemonic.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagrams */}
        {note.diagrams && note.diagrams.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-gray-600" />
              Diagrams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {note.diagrams.map((diagram, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={diagram.imageUrl}
                    alt={diagram.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {diagram.title}
                    </h3>
                    {diagram.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {diagram.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  <Tag className="w-4 h-4" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rating Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rate this Note</h2>

          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {rating} / 5
              </span>
            )}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white mb-4"
            rows="3"
          />

          <button
            onClick={handleRating}
            disabled={submittingRating || rating === 0}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submittingRating ? 'Submitting...' : 'Submit Rating'}
          </button>

          {/* Existing Ratings */}
          {note.ratings && note.ratings.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Reviews ({note.ratings.length})
              </h3>
              <div className="space-y-4">
                {note.ratings.slice(0, 5).map((review, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.user?.name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionNoteDetail;

