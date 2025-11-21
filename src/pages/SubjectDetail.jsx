import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubject } from '../services/api';
import Loading from '../components/Loading';
import {
  ArrowLeft,
  FileText,
  Video,
  ExternalLink,
  BookOpen,
  Image,
  Stethoscope,
  Brain,
  Zap,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Clock,
  Target
} from 'lucide-react';

const SubjectDetail = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    try {
      const response = await getSubject(id);
      setSubject(response.data);
    } catch (error) {
      console.error('Error fetching subject:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!subject) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Subject not found</div>;

  const { relatedResources = {}, stats = {} } = subject;
  const { books = [], pastPapers = [], photos = [], protocols = [], quizzes = [], flashcardDecks = [] } = relatedResources;

  const getResourceIcon = (type) => {
    return type === 'pdf' ? <FileText className="w-5 h-5" /> : <Video className="w-5 h-5" />;
  };

  const getResourceColor = (type) => {
    return type === 'pdf' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div>
      {/* Back Button */}
      <Link
        to="/subjects"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Subjects
      </Link>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{subject.name}</h1>
        <p className="text-blue-100 text-lg mb-6 max-w-3xl">{subject.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalBooks || 0}</div>
            <div className="text-xs text-blue-100">Books</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalPastPapers || 0}</div>
            <div className="text-xs text-blue-100">Past Papers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalPhotos || 0}</div>
            <div className="text-xs text-blue-100">Photos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalProtocols || 0}</div>
            <div className="text-xs text-blue-100">Protocols</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalQuizzes || 0}</div>
            <div className="text-xs text-blue-100">Quizzes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalFlashcardDecks || 0}</div>
            <div className="text-xs text-blue-100">Flashcards</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalResources || 0}</div>
            <div className="text-xs text-blue-100">Total</div>
          </div>
        </div>
      </div>

      {/* Subject Resources (PDFs/Videos) */}
      {subject.resources && subject.resources.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold dark:text-white">Subject Materials</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {subject.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${getResourceColor(resource.type)} mt-1`}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors dark:text-white">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase mb-2">
                      {resource.type}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Books Section */}
      {books.length > 0 && (
        <div className="mb-8">
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
        <div className="mb-8">
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
        <div className="mb-8">
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
        <div className="mb-8">
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
        <div className="mb-8">
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
        <div className="mb-8">
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
            There are no resources available for {subject.name} at the moment.
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
  );
};

export default SubjectDetail;

