import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, User, FileText, Send, Edit2, Trash2 } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

const PeerReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/peer-reviews/${id}`);
      setReview(response.data);
    } catch (error) {
      console.error('Error fetching peer review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/peer-reviews/${id}/feedback`, feedbackData);
      setIsFeedbackModalOpen(false);
      fetchReview();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit feedback');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!confirm('Are you sure you want to delete your feedback?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/peer-reviews/${id}/feedback/${feedbackId}`);
      fetchReview();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete feedback');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Peer review not found</p>
      </div>
    );
  }

  const isAuthor = review.author?._id === currentUser._id;
  const hasReviewed = review.feedback?.some(f => f.reviewer._id === currentUser._id);
  const myFeedback = review.feedback?.find(f => f.reviewer._id === currentUser._id);
  const canReview = !isAuthor && !hasReviewed && review.status !== 'closed' && !review.isExpired;
  const isExpired = new Date(review.deadline) < new Date();

  const statusColors = {
    open: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    'in-review': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    completed: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    closed: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/peer-reviews')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Peer Reviews
        </button>

        {/* Review Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {review.title}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.description}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[review.status]}`}>
                  {review.status}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                  {review.contentType.replace('-', ' ')}
                </span>
                {review.subject && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                    {review.subject.name}
                  </span>
                )}
                {review.year && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm">
                    {review.year.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>By {review.author.name}</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4" />
                <span>
                  Deadline: {new Date(review.deadline).toLocaleDateString()}
                  {isExpired && <span className="text-red-600 dark:text-red-400 ml-2">(Expired)</span>}
                </span>
              </div>
            </div>

            {canReview && (
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Feedback
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {review.averageRating || 'N/A'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {review.feedbackCount || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {review.feedbackCount || 0}/{review.maxReviewers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Slots Filled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.ceil((new Date(review.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Days Remaining</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Content
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {review.content}
                </p>
              </div>

              {/* Attachments */}
              {review.attachments && review.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {review.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attachment.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {attachment.type} • {(attachment.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feedback List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Feedback ({review.feedbackCount || 0})
              </h2>

              {review.feedback && review.feedback.length > 0 ? (
                <div className="space-y-4">
                  {review.feedback.map((feedback) => (
                    <FeedbackCard
                      key={feedback._id}
                      feedback={feedback}
                      currentUserId={currentUser._id}
                      onDelete={() => handleDeleteFeedback(feedback._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No feedback yet. Be the first to review!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {review.tags && review.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {review.tags.map((tag, index) => (
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

            {/* Review Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
                Review Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                <li>• Be constructive and respectful</li>
                <li>• Provide specific examples</li>
                <li>• Balance strengths and improvements</li>
                <li>• Focus on the content, not the person</li>
                <li>• Use clear and actionable language</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <FeedbackModal
          allowAnonymous={review.allowAnonymous}
          onSave={handleSubmitFeedback}
          onClose={() => setIsFeedbackModalOpen(false)}
        />
      )}
    </div>
  );
};

const FeedbackCard = ({ feedback, currentUserId, onDelete }) => {
  const isMyFeedback = feedback.reviewer._id === currentUserId;

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {feedback.reviewer.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold text-gray-900 dark:text-white">{feedback.rating}</span>
          </div>
          {isMyFeedback && (
            <button
              onClick={onDelete}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">Strengths</h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{feedback.strengths}</p>
        </div>
        <div>
          <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-1">Areas for Improvement</h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{feedback.improvements}</p>
        </div>
        {feedback.additionalComments && (
          <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Additional Comments</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{feedback.additionalComments}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerReviewDetail;

