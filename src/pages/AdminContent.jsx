import { useState, useEffect } from 'react';
import axios from 'axios';
import SectionHeader from '../components/SectionHeader';
import { 
  FileText, CheckCircle, XCircle, Clock, 
  Search, Filter, Eye, MessageSquare 
} from 'lucide-react';

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [pendingContent, setPendingContent] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingContent();
  }, [filter]);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await axios.get('/api/admin/content/pending', { params });
      setPendingContent(response.data);
    } catch (error) {
      console.error('Failed to fetch pending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type, id) => {
    try {
      await axios.put(`/api/admin/content/approve/${type}/${id}`);
      alert('Content approved successfully!');
      fetchPendingContent();
    } catch (error) {
      alert('Failed to approve content: ' + error.message);
    }
  };

  const handleReject = async (type, id) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await axios.put(`/api/admin/content/reject/${type}/${id}`, {
        reason: rejectionReason
      });
      alert('Content rejected successfully!');
      setSelectedContent(null);
      setRejectionReason('');
      fetchPendingContent();
    } catch (error) {
      alert('Failed to reject content: ' + error.message);
    }
  };

  const filteredContent = pendingContent.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getContentIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <FileText className="w-5 h-5" />;
      case 'flashcard':
        return <FileText className="w-5 h-5" />;
      case 'discussion':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTitle = (item) => {
    if (item.type === 'quiz') return item.title;
    if (item.type === 'flashcard') return item.question;
    if (item.type === 'discussion') return item.topic;
    return 'Untitled';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Content Management"
        subtitle="Review and approve pending content"
      />

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('quizzes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'quizzes'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setFilter('flashcards')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'flashcards'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setFilter('discussions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'discussions'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Discussions
          </button>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No pending content to review</p>
          </div>
        ) : (
          filteredContent.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 text-blue-600 dark:text-blue-400">
                      {getContentIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getContentTitle(item)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • 
                        Created by {item.createdBy?.name || item.author?.name || 'Unknown'} • 
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {item.subject && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Subject: {item.subject.name}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(item.type, item._id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setSelectedContent(item)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Reject Content
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting this content:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-4"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleReject(selectedContent.type, selectedContent._id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setSelectedContent(null);
                  setRejectionReason('');
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;

