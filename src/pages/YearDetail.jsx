import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Video, FileText, ExternalLink, Download, Clock, FileType } from 'lucide-react';
import SubjectCard from '../components/SubjectCard';

const YearDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subjects');

  useEffect(() => {
    fetchYearDetails();
  }, [id]);

  const fetchYearDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/years/${id}`);
      setYear(response.data);
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching year details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYearColor = (order) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-rose-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[order] || 'from-gray-500 to-gray-600';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Year not found</h2>
          <button
            onClick={() => navigate('/years')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Years
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getYearColor(year.order)} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/years')}
            className="flex items-center text-white mb-6 hover:underline"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Years
          </button>
          <h1 className="text-4xl font-bold text-white mb-4">{year.displayName}</h1>
          <p className="text-xl text-white/90">{year.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subjects'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Subjects ({subjects.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'videos'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Video className="w-5 h-5 inline mr-2" />
              Video Summaries ({year.resources?.videoSummaries?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('pdfs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pdfs'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              PDF Notes ({year.resources?.pdfNotes?.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div>
            {subjects.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No subjects available for this year yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <SubjectCard key={subject._id} subject={subject} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab - Placeholder for now */}
        {activeTab === 'videos' && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Video summaries coming soon!</p>
          </div>
        )}

        {/* PDFs Tab - Placeholder for now */}
        {activeTab === 'pdfs' && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">PDF notes coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearDetail;

