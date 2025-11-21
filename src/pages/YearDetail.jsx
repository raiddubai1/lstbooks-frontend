import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Download,
  Clock,
  FileType,
  Plus,
  Image,
  Stethoscope,
  Brain,
  Zap,
  Award
} from 'lucide-react';
import SubjectCard from '../components/SubjectCard';
import VideoSummaryCard from '../components/VideoSummaryCard';
import PDFNoteCard from '../components/PDFNoteCard';
import AddResourceModal from '../components/AddResourceModal';
import { isTeacher, isAdmin } from '../utils/auth';

const YearDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [relatedResources, setRelatedResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [resourceType, setResourceType] = useState('video');

  const canManageContent = isTeacher() || isAdmin();

  useEffect(() => {
    fetchYearDetails();
  }, [id]);

  const fetchYearDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/years/${id}`);
      setYear(response.data);
      setSubjects(response.data.subjects || []);
      setRelatedResources(response.data.relatedResources || {});
    } catch (error) {
      console.error('Error fetching year details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = (type) => {
    setResourceType(type);
    setShowAddModal(true);
  };

  const handleResourceAdded = () => {
    fetchYearDetails(); // Refresh data
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

  const { books = [], pastPapers = [], photos = [], protocols = [], quizzes = [], flashcardDecks = [] } = relatedResources;
  const stats = year.stats || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Header */}
      <div className={`bg-gradient-to-r ${getYearColor(year.order)} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/years')}
            className="flex items-center text-white mb-6 hover:underline transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Years
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{year.displayName}</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl">{year.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalSubjects || 0}</div>
              <div className="text-xs text-white/80">Subjects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalBooks || 0}</div>
              <div className="text-xs text-white/80">Books</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalPastPapers || 0}</div>
              <div className="text-xs text-white/80">Papers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalPhotos || 0}</div>
              <div className="text-xs text-white/80">Photos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalProtocols || 0}</div>
              <div className="text-xs text-white/80">Protocols</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalQuizzes || 0}</div>
              <div className="text-xs text-white/80">Quizzes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalFlashcards || 0}</div>
              <div className="text-xs text-white/80">Flashcards</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalResources || 0}</div>
              <div className="text-xs text-white/80">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'materials'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Year Materials
              </button>
            </div>

            {/* Add Resource Button (Teachers/Admins only) */}
            {canManageContent && activeTab === 'materials' && (
              <button
                onClick={() => {
                  setResourceType('video');
                  setShowAddModal(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Material</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab - All Resources */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Subjects Section */}
            {subjects.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold dark:text-white">Subjects</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({subjects.length})</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <SubjectCard key={subject._id} subject={subject} />
                  ))}
                </div>
              </div>
            )}

            {/* Books Section */}
            {books.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold dark:text-white">Books</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({books.length})</span>
                  </div>
                  <Link to="/books" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View All Books →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {books.slice(0, 8).map((book) => (
                    <Link
                      key={book._id}
                      to={`/books/${book._id}`}
                      className="card hover:shadow-lg transition-all hover:scale-105 group"
                    >
                      {book.coverImage && (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-bold text-sm mb-1 line-clamp-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{book.author}</p>
                      {book.pages && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">{book.pages} pages</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Past Papers Section */}
            {pastPapers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-2xl font-bold dark:text-white">Past Papers</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({pastPapers.length})</span>
                  </div>
                  <Link to="/past-papers" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                    View All Papers →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastPapers.slice(0, 6).map((paper) => (
                    <a
                      key={paper._id}
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card hover:shadow-lg transition-all hover:scale-105 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1 line-clamp-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            {paper.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {paper.year} • {paper.semester} • {paper.examType}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Section */}
            {photos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h2 className="text-2xl font-bold dark:text-white">Clinical Photos</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({photos.length})</span>
                  </div>
                  <Link to="/photos" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                    View All Photos →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {photos.slice(0, 10).map((photo) => (
                    <div
                      key={photo._id}
                      className="card p-0 overflow-hidden hover:shadow-lg transition-all hover:scale-105 group cursor-pointer"
                    >
                      <img
                        src={photo.thumbnailUrl || photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <h3 className="font-bold text-xs line-clamp-2 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                          {photo.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Treatment Protocols Section */}
            {protocols.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h2 className="text-2xl font-bold dark:text-white">Treatment Protocols</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({protocols.length})</span>
                  </div>
                  <Link to="/treatment-protocols" className="text-sm text-red-600 dark:text-red-400 hover:underline">
                    View All Protocols →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {protocols.slice(0, 6).map((protocol) => (
                    <Link
                      key={protocol._id}
                      to={`/treatment-protocols/${protocol._id}`}
                      className="card hover:shadow-lg transition-all hover:scale-105 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1 line-clamp-2 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                            {protocol.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{protocol.difficulty}</span>
                            {protocol.estimatedTime && <span>⏱️ {protocol.estimatedTime}</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quizzes Section */}
            {quizzes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-2xl font-bold dark:text-white">Quizzes</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({quizzes.length})</span>
                  </div>
                  <Link to="/quizzes" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                    View All Quizzes →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quizzes.slice(0, 6).map((quiz) => (
                    <Link
                      key={quiz._id}
                      to={`/quizzes/${quiz._id}`}
                      className="card hover:shadow-lg transition-all hover:scale-105 group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1 line-clamp-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            {quiz.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                            {quiz.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                          {quiz.questions?.length || 0} questions
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          {quiz.difficulty}
                        </span>
                        {quiz.isAIGenerated && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-xs">
                            AI
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Flashcard Decks Section */}
            {flashcardDecks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h2 className="text-2xl font-bold dark:text-white">Flashcard Decks</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({flashcardDecks.length})</span>
                  </div>
                  <Link to="/spaced-repetition" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
                    View All Decks →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flashcardDecks.slice(0, 6).map((deck) => (
                    <Link
                      key={deck._id}
                      to={`/spaced-repetition/${deck._id}`}
                      className="card hover:shadow-lg transition-all hover:scale-105 group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1 line-clamp-2 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                            {deck.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                            {deck.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded">
                          {deck.totalCards || 0} cards
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          {deck.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {stats.totalResources === 0 && (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">No Resources Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  There are no resources available for {year.displayName} at the moment.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/books" className="btn-primary">
                    Browse Books
                  </Link>
                  <Link to="/ai-quiz-generator" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    Generate AI Quiz
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Materials Tab - Year-specific PDFs/Videos */}
        {activeTab === 'materials' && (
          <div className="space-y-8">
            {/* Video Summaries */}
            {year.resources?.videoSummaries && year.resources.videoSummaries.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold dark:text-white">Video Summaries</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({year.resources.videoSummaries.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {year.resources.videoSummaries.map((video, index) => (
                    <VideoSummaryCard key={index} video={video} />
                  ))}
                </div>
              </div>
            )}

            {/* PDF Notes */}
            {year.resources?.pdfNotes && year.resources.pdfNotes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h2 className="text-2xl font-bold dark:text-white">PDF Notes</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({year.resources.pdfNotes.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {year.resources.pdfNotes.map((pdf, index) => (
                    <PDFNoteCard key={index} pdf={pdf} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!year.resources?.videoSummaries || year.resources.videoSummaries.length === 0) &&
             (!year.resources?.pdfNotes || year.resources.pdfNotes.length === 0) && (
              <div className="card text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 dark:text-white">No Year Materials Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No PDFs or videos have been added for {year.displayName} yet.
                </p>
                {canManageContent && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Click "Add Material" to upload resources for this year.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        yearId={id}
        resourceType={resourceType}
        onSuccess={handleResourceAdded}
      />
    </div>
  );
};

export default YearDetail;

