import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFlashcards, getSubjects } from '../services/api';
import { Search, Plus, BookOpen, Play } from 'lucide-react';
import AddFlashcardModal from '../components/AddFlashcardModal';

const Flashcards = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFlashcards();
    fetchSubjects();
  }, []);

  useEffect(() => {
    let filtered = flashcards;

    if (searchQuery) {
      filtered = filtered.filter(card =>
        card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(card => card.subjectId?._id === selectedSubject);
    }

    setFilteredFlashcards(filtered);
  }, [searchQuery, selectedSubject, flashcards]);

  const fetchFlashcards = async () => {
    try {
      const response = await getFlashcards();
      setFlashcards(response.data);
      setFilteredFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
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

  const handleFlashcardAdded = (newFlashcards) => {
    setFlashcards([...newFlashcards, ...flashcards]);
  };

  const handleStartStudy = () => {
    if (filteredFlashcards.length > 0) {
      const subjectParam = selectedSubject ? `?subjectId=${selectedSubject}` : '';
      navigate(`/flashcards/study${subjectParam}`);
    }
  };

  // Group flashcards by subject
  const flashcardsBySubject = filteredFlashcards.reduce((acc, card) => {
    const subjectName = card.subjectId?.name || 'Uncategorized';
    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }
    acc[subjectName].push(card);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Flashcards</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">Master dental concepts with interactive flashcards</p>
        </div>
        <div className="flex gap-2 md:gap-3 flex-wrap">
          {filteredFlashcards.length > 0 && (
            <button
              onClick={handleStartStudy}
              className="bg-green-600 dark:bg-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Study Mode</span>
              <span className="sm:hidden">Study</span>
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add Flashcards</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flashcards..."
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{flashcards.length}</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Total Cards</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 dark:bg-purple-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{Object.keys(flashcardsBySubject).length}</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Subjects</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 dark:bg-green-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{filteredFlashcards.length}</p>
              <p className="text-sm text-green-700 dark:text-green-300">Filtered Cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcards by Subject */}
      {filteredFlashcards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No flashcards found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || selectedSubject
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first flashcard'}
          </p>
          {!searchQuery && !selectedSubject && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Flashcard
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(flashcardsBySubject).map(([subjectName, cards]) => (
            <div key={subjectName}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                {subjectName}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">({cards.length} cards)</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div
                    key={card._id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
                  >
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Question</p>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                        {card.question}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Answer</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {card.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Flashcard Modal */}
      <AddFlashcardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFlashcardAdded={handleFlashcardAdded}
      />
    </div>
  );
};

export default Flashcards;

