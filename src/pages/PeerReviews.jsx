import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Plus, Search, Star, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PeerReviewModal from '../components/PeerReviewModal';

const PeerReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my-submissions', 'my-reviews'

  useEffect(() => {
    fetchReviews();
    fetchMySubmissions();
    fetchMyReviews();
    fetchSubjects();
    fetchYears();
  }, [selectedSubject, selectedYear, selectedContentType, selectedStatus, searchQuery]);

  const fetchReviews = async () => {
    try {
      const params = {};
      if (selectedSubject) params.subject = selectedSubject;
      if (selectedYear) params.year = selectedYear;
      if (selectedContentType) params.contentType = selectedContentType;
      if (selectedStatus) params.status = selectedStatus;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/peer-reviews`, { params });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching peer reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/peer-reviews/my-submissions`);
      setMySubmissions(response.data);
    } catch (error) {
      console.error('Error fetching my submissions:', error);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/peer-reviews/my-reviews`);
      setMyReviews(response.data);
    } catch (error) {
      console.error('Error fetching my reviews:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/years`);
      setYears(response.data);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const handleCreateReview = () => {
    setIsModalOpen(true);
  };

  const handleSaveReview = async (reviewData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/peer-reviews`, reviewData);
      setIsModalOpen(false);
      fetchReviews();
      fetchMySubmissions();
    } catch (error) {
      console.error('Error creating peer review:', error);
    }
  };

  const displayReviews = activeTab === 'my-submissions' ? mySubmissions : activeTab === 'my-reviews' ? myReviews : reviews;

  const contentTypes = [
    { value: 'note', label: 'Note' },
    { value: 'essay', label: 'Essay' },
    { value: 'case-study', label: 'Case Study' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'open', label: 'Open' },
    { value: 'in-review', label: 'In Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'closed', label: 'Closed' }
  ];

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Peer Reviews</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Submit your work for feedback or review others' submissions
            </p>
          </div>
          <button
            onClick={handleCreateReview}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Submit for Review
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('my-submissions')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'my-submissions'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            My Submissions ({mySubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'my-reviews'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Reviews Given ({myReviews.length})
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year._id} value={year._id}>
                    {year.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search peer reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Peer Reviews List */}
        {displayReviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'my-submissions' 
                ? 'You haven\'t submitted anything for review yet.' 
                : activeTab === 'my-reviews'
                ? 'You haven\'t reviewed any submissions yet.'
                : 'No peer reviews found.'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {activeTab === 'my-submissions' 
                ? 'Submit your work to get valuable feedback!' 
                : activeTab === 'my-reviews'
                ? 'Help others by reviewing their work!'
                : 'Submit your work or review others\' submissions!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review) => (
              <PeerReviewCard
                key={review._id}
                review={review}
                onClick={() => navigate(`/peer-reviews/${review._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Peer Review Modal */}
      {isModalOpen && (
        <PeerReviewModal
          subjects={subjects}
          years={years}
          onSave={handleSaveReview}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const PeerReviewCard = ({ review, onClick }) => {
  const statusColors = {
    open: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    'in-review': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    completed: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    closed: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
  };

  const contentTypeColors = {
    note: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    essay: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    'case-study': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    presentation: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400',
    research: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
    other: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
  };

  const isExpired = new Date(review.deadline) < new Date();
  const daysUntilDeadline = Math.ceil((new Date(review.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {review.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
            {review.description}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[review.status]}`}>
          {review.status}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${contentTypeColors[review.contentType]}`}>
          {review.contentType.replace('-', ' ')}
        </span>
        {review.subject && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs">
            {review.subject.name}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {review.averageRating || 'N/A'}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {review.feedbackCount || 0}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {review.feedbackCount || 0}/{review.maxReviewers}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Slots</div>
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          {isExpired ? (
            <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              Expired
            </span>
          ) : (
            <span className={`${
              daysUntilDeadline <= 3 
                ? 'text-orange-600 dark:text-orange-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {daysUntilDeadline} days left
            </span>
          )}
        </div>
        {review.status === 'completed' && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>
    </div>
  );
};

export default PeerReviews;

