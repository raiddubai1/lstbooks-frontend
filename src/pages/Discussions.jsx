import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Eye, ThumbsUp, MessageCircle, Pin, Lock, CheckCircle, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DiscussionModal from '../components/DiscussionModal';

const Discussions = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchDiscussions();
    fetchSubjects();
    fetchYears();
  }, [selectedSubject, selectedYear, selectedCategory, searchQuery, sortBy]);

  const fetchDiscussions = async () => {
    try {
      const params = {};
      if (selectedSubject) params.subject = selectedSubject;
      if (selectedYear) params.year = selectedYear;
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      params.sort = sortBy;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/discussions`, { params });
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
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

  const handleCreateDiscussion = () => {
    setIsModalOpen(true);
  };

  const handleSaveDiscussion = async (discussionData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/discussions`, discussionData);
      setIsModalOpen(false);
      fetchDiscussions();
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Discussions</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {discussions.length} {discussions.length === 1 ? 'discussion' : 'discussions'}
            </p>
          </div>
          <button
            onClick={handleCreateDiscussion}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Discussion
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="question">Questions</option>
              <option value="discussion">Discussions</option>
              <option value="announcement">Announcements</option>
              <option value="resource">Resources</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostReplies">Most Replies</option>
            </select>

            <button
              onClick={() => {
                setSelectedSubject('');
                setSelectedYear('');
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Discussions List */}
        {discussions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No discussions yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Start a discussion to connect with your peers!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <DiscussionCard
                key={discussion._id}
                discussion={discussion}
                onClick={() => navigate(`/discussions/${discussion._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Discussion Modal */}
      {isModalOpen && (
        <DiscussionModal
          subjects={subjects}
          years={years}
          onSave={handleSaveDiscussion}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const DiscussionCard = ({ discussion, onClick }) => {
  const categoryColors = {
    question: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    discussion: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    announcement: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    resource: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {discussion.isPinned && (
                  <Pin className="w-4 h-4 text-yellow-500 fill-current" />
                )}
                {discussion.isClosed && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
                {discussion.isResolved && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[discussion.category]}`}>
                  {discussion.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {discussion.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {discussion.content}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>By {discussion.author?.name || 'Unknown'}</span>
            {discussion.subject && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {discussion.subject.name}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {discussion.views}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {discussion.likes?.length || 0}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {discussion.replies?.length || 0}
            </div>
            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussions;

