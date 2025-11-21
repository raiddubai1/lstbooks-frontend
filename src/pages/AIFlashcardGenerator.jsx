import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import {
  Sparkles,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader,
  FileText,
  Upload
} from 'lucide-react';

const AIFlashcardGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [generatedCards, setGeneratedCards] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    deckName: '',
    topic: '',
    content: '',
    subject: '',
    year: 'All',
    difficulty: 'medium',
    cardCount: 10,
    includeHints: true,
    isPublic: false
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data.subjects || response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleGenerate = async () => {
    if (!formData.topic && !formData.content) {
      setError('Please enter a topic or paste content');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setGeneratedCards([]);

      const response = await api.post('/ai-flashcard-generator/generate', {
        topic: formData.topic,
        content: formData.content,
        difficulty: formData.difficulty,
        cardCount: formData.cardCount,
        includeHints: formData.includeHints
      });

      setGeneratedCards(response.data.flashcards);
      setSuccess(`Generated ${response.data.flashcards.length} flashcards successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setError(error.response?.data?.error || 'Failed to generate flashcards. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async () => {
    if (!formData.deckName || (!formData.topic && !formData.content) || !formData.subject) {
      setError('Please fill in all required fields (Deck Name, Topic/Content, and Subject)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await api.post('/ai-flashcard-generator/create-deck', {
        deckName: formData.deckName,
        topic: formData.topic,
        content: formData.content,
        subject: formData.subject,
        year: formData.year,
        difficulty: formData.difficulty,
        cardCount: formData.cardCount,
        includeHints: formData.includeHints,
        isPublic: formData.isPublic
      });

      setSuccess('Flashcard deck created successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/spaced-repetition`);
      }, 1000);
    } catch (error) {
      console.error('Error creating deck:', error);
      setError(error.response?.data?.error || 'Failed to create deck. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="AI Flashcard Generator"
        subtitle="Generate flashcards instantly from topics or PDF content using AI"
      />

      {/* Success/Error Messages */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Form */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generate Flashcards</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered flashcard creation</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Deck Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deck Name *
              </label>
              <input
                type="text"
                value={formData.deckName}
                onChange={(e) => setFormData({ ...formData, deckName: e.target.value })}
                placeholder="e.g., Dental Anatomy Flashcards"
                className="input w-full"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Tooth Morphology, Periodontal Disease"
                className="input w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Be specific for better results
              </p>
            </div>

            {/* Content (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content (Optional)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="4"
                placeholder="Paste text content from PDFs or notes here..."
                className="input w-full font-mono text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                AI will extract key concepts from this content
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input w-full"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="input w-full"
              >
                <option value="All">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.difficulty === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Cards: {formData.cardCount}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={formData.cardCount}
                onChange={(e) => setFormData({ ...formData, cardCount: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>5</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeHints}
                  onChange={(e) => setFormData({ ...formData, includeHints: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include hints for difficult cards
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Make this deck public (others can subscribe)
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading || (!formData.topic && !formData.content)}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Preview Cards
                  </>
                )}
              </button>
              <button
                onClick={handleCreateDeck}
                disabled={loading || !formData.deckName || (!formData.topic && !formData.content) || !formData.subject}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Create Deck
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generated flashcards</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Generating flashcards with AI...</p>
            </div>
          ) : generatedCards.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {generatedCards.map((card, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Front:</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {card.front}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Back:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {card.back}
                        </p>
                      </div>
                      {card.hint && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-gray-700 dark:text-gray-300">
                          <strong>Hint:</strong> {card.hint}
                        </div>
                      )}
                      {card.tags && card.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {card.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Flashcards Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter a topic or paste content and click "Preview Cards" to see AI-generated flashcards
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg max-w-md">
                <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">How it works:</h4>
                <ul className="text-sm text-purple-800 dark:text-purple-400 space-y-1 text-left">
                  <li>• Enter your topic (e.g., "Dental Anatomy")</li>
                  <li>• Or paste content from PDFs/notes</li>
                  <li>• Choose difficulty and card count</li>
                  <li>• AI generates flashcards instantly</li>
                  <li>• Preview and create your deck</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFlashcardGenerator;

