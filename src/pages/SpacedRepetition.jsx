import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import AddDeckModal from '../components/AddDeckModal';
import EditDeckModal from '../components/EditDeckModal';
import DeckDetailModal from '../components/DeckDetailModal';
import {
  Brain,
  Plus,
  Clock,
  TrendingUp,
  Star,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Zap,
  Edit,
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';

const SpacedRepetition = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [decks, setDecks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [editingDeck, setEditingDeck] = useState(null);
  const [filter, setFilter] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchDecks();
  }, [filter]);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.search) params.append('search', filter.search);

      const response = await api.get(`/spaced-repetition/decks?${params}`);
      setDecks(response.data);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Anatomy',
    'Physiology',
    'Pathology',
    'Pharmacology',
    'Clinical Skills',
    'Diagnosis',
    'Treatment',
    'Radiology',
    'Surgery',
    'Preventive'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'learning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mastered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <SectionHeader
        title="Spaced Repetition System"
        subtitle="Master your knowledge with scientifically-proven spaced repetition learning"
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/ai-flashcard-generator')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all flex items-center gap-2 text-sm md:text-base whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Generate with AI</span>
              <span className="sm:hidden">AI</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 dark:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Add Deck</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Decks</p>
              <p className="text-3xl font-bold mt-1">{decks.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Cards Due Today</p>
              <p className="text-3xl font-bold mt-1">
                {decks.reduce((sum, deck) => sum + (deck.newCards || 0) + (deck.reviewCards || 0), 0)}
              </p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Cards</p>
              <p className="text-3xl font-bold mt-1">
                {decks.reduce((sum, deck) => sum + (deck.totalCards || 0), 0)}
              </p>
            </div>
            <Brain className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Mastered Cards</p>
              <p className="text-3xl font-bold mt-1">
                {decks.reduce((sum, deck) => sum + (deck.masteredCards || 0), 0)}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search decks..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="input w-full"
            />
          </div>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value === 'All' ? '' : e.target.value })}
            className="input md:w-48"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <div className="card text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Decks Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first spaced repetition deck to start learning smarter
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck._id}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {deck.name}
                    </h3>
                    {deck.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {deck.description}
                  </p>
                </div>
              </div>

              {/* Category & Subject */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                  {deck.category}
                </span>
                {deck.subject && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                    {deck.subject.name}
                  </span>
                )}
                {deck.isPublic && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                    Public
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Total Cards</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {deck.totalCards || 0}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Due Today</span>
                  </div>
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {(deck.newCards || 0) + (deck.reviewCards || 0)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {deck.totalCards > 0
                      ? Math.round(((deck.masteredCards || 0) / deck.totalCards) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${deck.totalCards > 0
                        ? ((deck.masteredCards || 0) / deck.totalCards) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Card Status Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <div className={`${getStatusColor('new')} rounded px-2 py-1 font-medium mb-1`}>
                    {deck.newCards || 0}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">New</span>
                </div>
                <div>
                  <div className={`${getStatusColor('learning')} rounded px-2 py-1 font-medium mb-1`}>
                    {deck.learningCards || 0}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Learning</span>
                </div>
                <div>
                  <div className={`${getStatusColor('review')} rounded px-2 py-1 font-medium mb-1`}>
                    {deck.reviewCards || 0}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Review</span>
                </div>
                <div>
                  <div className={`${getStatusColor('mastered')} rounded px-2 py-1 font-medium mb-1`}>
                    {deck.masteredCards || 0}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Mastered</span>
                </div>
              </div>

              {/* Footer */}
              {deck.isPublic && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{deck.subscriberCount || 0} subscribers</span>
                  </div>
                  {deck.owner && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {deck.owner.name}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <button
                  onClick={() => setSelectedDeck(deck)}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  View
                </button>
                <button
                  onClick={() => setEditingDeck(deck)}
                  className="btn-secondary text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {((deck.newCards || 0) + (deck.reviewCards || 0)) > 0 && (
                  <button
                    onClick={() => navigate(`/spaced-repetition/study/${deck._id}`)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    <Zap className="w-4 h-4 inline mr-1" />
                    Study ({(deck.newCards || 0) + (deck.reviewCards || 0)})
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddDeckModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchDecks();
          }}
        />
      )}

      {selectedDeck && (
        <DeckDetailModal
          deck={selectedDeck}
          onClose={() => setSelectedDeck(null)}
          onEdit={(deck) => {
            setSelectedDeck(null);
            setEditingDeck(deck);
          }}
          onUpdate={fetchDecks}
        />
      )}

      {editingDeck && (
        <EditDeckModal
          deck={editingDeck}
          onClose={() => setEditingDeck(null)}
          onSuccess={() => {
            setEditingDeck(null);
            fetchDecks();
          }}
        />
      )}
    </div>
  );
};

export default SpacedRepetition;

