import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Download, Eye, ThumbsUp, User, FileText, 
  Send, Trash2, Link as LinkIcon, File, MessageSquare 
} from 'lucide-react';

const SharedResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/shared-resources/${id}`);
      setResource(response.data);
      
      // Set user's existing rating if any
      const existingRating = response.data.ratings?.find(r => r.user._id === currentUser._id);
      if (existingRating) {
        setUserRating(existingRating.rating);
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/shared-resources/${id}/like`);
      fetchResource();
    } catch (error) {
      console.error('Error liking resource:', error);
    }
  };

  const handleDownload = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/shared-resources/${id}/download`);
      
      // Open the file URL in a new tab
      if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank');
      } else if (resource.externalUrl) {
        window.open(resource.externalUrl, '_blank');
      }
      
      fetchResource();
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/shared-resources/${id}/comments`, {
        text: commentText
      });
      setCommentText('');
      fetchResource();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/shared-resources/${id}/comments/${commentId}`);
      fetchResource();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleRating = async (rating) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/shared-resources/${id}/rating`, { rating });
      setUserRating(rating);
      fetchResource();
    } catch (error) {
      console.error('Error rating resource:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Resource not found</p>
      </div>
    );
  }

  const isAuthor = resource.author?._id === currentUser._id;
  const hasLiked = resource.likes?.includes(currentUser._id);

  const resourceTypeIcons = {
    file: File,
    link: LinkIcon,
    note: FileText,
    video: FileText,
    document: FileText,
    presentation: FileText,
    other: FileText
  };

  const Icon = resourceTypeIcons[resource.resourceType] || FileText;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/shared-resources')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shared Resources
        </button>

        {/* Resource Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {resource.title}
                </h1>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {resource.description}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                  {resource.resourceType}
                </span>
                {resource.category && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                    {resource.category.replace('-', ' ')}
                  </span>
                )}
                {resource.subject && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm">
                    {resource.subject.name}
                  </span>
                )}
                {resource.year && (
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-sm">
                    {resource.year.name}
                  </span>
                )}
                {resource.isFeatured && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>Shared by {resource.author.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                  hasLiked
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                {hasLiked ? 'Liked' : 'Like'}
              </button>
              {(resource.fileUrl || resource.externalUrl) && (
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {resource.resourceType === 'link' ? 'Visit' : 'Download'}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {resource.averageRating || 'N/A'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Rating ({resource.ratingCount || 0})
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {resource.downloads || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {resource.views || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {resource.likeCount || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {resource.commentCount || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Comments</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Content */}
            {resource.content && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Content
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {resource.content}
                  </p>
                </div>
              </div>
            )}

            {/* File Info */}
            {resource.fileUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  File Information
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{resource.fileName}</span>
                  </div>
                  {resource.fileSize && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                  {resource.mimeType && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{resource.mimeType}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* External Link */}
            {resource.externalUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  External Link
                </h2>
                <a
                  href={resource.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {resource.externalUrl}
                </a>
              </div>
            )}

            {/* Comments */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Comments ({resource.commentCount || 0})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-2"
                  rows="3"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              {resource.comments && resource.comments.length > 0 ? (
                <div className="space-y-4">
                  {resource.comments.map((comment) => (
                    <CommentCard
                      key={comment._id}
                      comment={comment}
                      currentUserId={currentUser._id}
                      onDelete={() => handleDeleteComment(comment._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rate this Resource */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Rate this Resource
              </h3>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= userRating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You rated this {userRating} star{userRating !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentCard = ({ comment, currentUserId, onDelete }) => {
  const isMyComment = comment.user._id === currentUserId;

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {comment.user.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isMyComment && (
          <button
            onClick={onDelete}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
    </div>
  );
};

export default SharedResourceDetail;

