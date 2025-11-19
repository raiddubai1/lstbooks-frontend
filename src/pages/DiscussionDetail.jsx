import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageCircle, Eye, Send, CheckCircle, Trash2, Pin, Lock } from 'lucide-react';
import { getUserRole } from '../utils/auth';

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const userRole = getUserRole();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/discussions/${id}`);
      setDiscussion(response.data);
    } catch (error) {
      console.error('Error fetching discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeDiscussion = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/discussions/${id}/like`);
      fetchDiscussion();
    } catch (error) {
      console.error('Error liking discussion:', error);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/discussions/${id}/replies`, {
        content: replyContent
      });
      setReplyContent('');
      fetchDiscussion();
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/discussions/${id}/replies/${replyId}/like`);
      fetchDiscussion();
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleAcceptAnswer = async (replyId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/discussions/${id}/replies/${replyId}/accept`);
      fetchDiscussion();
    } catch (error) {
      console.error('Error accepting answer:', error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/discussions/${id}/replies/${replyId}`);
      fetchDiscussion();
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleTogglePin = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/discussions/${id}/pin`);
      fetchDiscussion();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleToggleClose = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/discussions/${id}/close`);
      fetchDiscussion();
    } catch (error) {
      console.error('Error toggling close:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Discussion not found</p>
      </div>
    );
  }

  const isAuthor = discussion.author?._id === currentUser._id;
  const isLiked = discussion.likes?.includes(currentUser._id);
  const canModerate = userRole === 'admin' || userRole === 'teacher';

  const categoryColors = {
    question: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    discussion: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    announcement: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    resource: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/discussions')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Discussions
        </button>

        {/* Discussion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {discussion.isPinned && (
                  <Pin className="w-5 h-5 text-yellow-500 fill-current" />
                )}
                {discussion.isClosed && (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
                {discussion.isResolved && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[discussion.category]}`}>
                  {discussion.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {discussion.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {discussion.content}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>By <span className="font-semibold">{discussion.author?.name || 'Unknown'}</span></span>
              {discussion.subject && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {discussion.subject.name}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {discussion.views}
              </div>
              <span>{new Date(discussion.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              {canModerate && (
                <>
                  <button
                    onClick={handleTogglePin}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      discussion.isPinned
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleClose}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      discussion.isClosed
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={handleLikeDiscussion}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {discussion.likes?.length || 0}
              </button>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Replies ({discussion.replies?.length || 0})
          </h2>

          {/* Reply Form */}
          {!discussion.isClosed && (
            <form onSubmit={handleSubmitReply} className="mb-8">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none mb-3"
                required
              />
              <button
                type="submit"
                disabled={submitting || !replyContent.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </form>
          )}

          {discussion.isClosed && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300">
                This discussion is closed. No new replies can be added.
              </p>
            </div>
          )}

          {/* Replies List */}
          <div className="space-y-4">
            {discussion.replies?.map((reply) => (
              <ReplyCard
                key={reply._id}
                reply={reply}
                isAuthor={isAuthor}
                currentUserId={currentUser._id}
                onLike={() => handleLikeReply(reply._id)}
                onAccept={() => handleAcceptAnswer(reply._id)}
                onDelete={() => handleDeleteReply(reply._id)}
              />
            ))}

            {(!discussion.replies || discussion.replies.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No replies yet. Be the first to reply!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReplyCard = ({ reply, isAuthor, currentUserId, onLike, onAccept, onDelete }) => {
  const isReplyAuthor = reply.user?._id === currentUserId;
  const isLiked = reply.likes?.includes(currentUserId);

  return (
    <div className={`border-2 rounded-lg p-4 ${
      reply.isAcceptedAnswer
        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      {reply.isAcceptedAnswer && (
        <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400">
          <CheckCircle className="w-5 h-5 fill-current" />
          <span className="font-semibold">Accepted Answer</span>
        </div>
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
        {reply.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">{reply.user?.name || 'Unknown'}</span>
          <span>{new Date(reply.createdAt).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          {isAuthor && !reply.isAcceptedAnswer && (
            <button
              onClick={onAccept}
              className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
            >
              Accept Answer
            </button>
          )}
          <button
            onClick={onLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              isLiked
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {reply.likes?.length || 0}
          </button>
          {(isReplyAuthor || isAuthor) && (
            <button
              onClick={onDelete}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;

