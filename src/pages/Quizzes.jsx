import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, getSubjects, getQuizStats } from '../services/api';
import { Search, Plus, BookOpen, Clock, Award, Users } from 'lucide-react';
import AddQuizModal from '../components/AddQuizModal';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizStats, setQuizStats] = useState({});

  useEffect(() => {
    fetchQuizzes();
    fetchSubjects();
  }, []);

  useEffect(() => {
    let filtered = quizzes;

    if (searchQuery) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(quiz => quiz.subjectId?._id === selectedSubject);
    }

    setFilteredQuizzes(filtered);
  }, [searchQuery, selectedSubject, quizzes]);

  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzes();
      const quizzesData = response.data;
      setQuizzes(quizzesData);
      setFilteredQuizzes(quizzesData);

      // Fetch stats for each quiz
      const statsPromises = quizzesData.map(quiz =>
        getQuizStats(quiz._id).catch(() => null)
      );
      const statsResults = await Promise.all(statsPromises);

      const statsMap = {};
      quizzesData.forEach((quiz, index) => {
        if (statsResults[index]) {
          statsMap[quiz._id] = statsResults[index].data;
        }
      });
      setQuizStats(statsMap);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleQuizAdded = (newQuiz) => {
    setQuizzes([newQuiz, ...quizzes]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600 mt-2">Test your knowledge with interactive quizzes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Quiz
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-64"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedSubject
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first quiz'}
          </p>
          {!searchQuery && !selectedSubject && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const stats = quizStats[quiz._id];
            const totalPoints = quiz.questions?.reduce((sum, q) => sum + (q.points || 1), 0) || 0;

            return (
              <div
                key={quiz._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {quiz.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {quiz.subjectId && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {quiz.subjectId.name}
                          </span>
                        )}
                        {quiz.timeLimit && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.floor(quiz.timeLimit / 60)}min
                          </span>
                        )}
                        {quiz.shuffleQuestions && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            🔀 Shuffled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{quiz.questions?.length || 0} questions</span>
                      <span>•</span>
                      <span>{totalPoints} points</span>
                    </div>

                    {stats && stats.attemptsCount > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <Award className="w-4 h-4" />
                          <span className="font-medium">{stats.averagePercent.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Users className="w-4 h-4" />
                          <span>{stats.attemptsCount} attempts</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                  <Link
                    to={`/quizzes/${quiz._id}/take`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    Take Quiz →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Quiz Modal */}
      <AddQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuizAdded={handleQuizAdded}
      />
    </div>
  );
};

export default Quizzes;

