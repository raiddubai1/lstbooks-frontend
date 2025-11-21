import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import {
  Sparkles,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

const AIQuizGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    subject: '',
    year: 'All',
    difficulty: 'medium',
    questionCount: 10,
    questionTypes: ['multiple-choice'],
    includeExplanations: true,
    timeLimit: 30
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
    if (!formData.topic) {
      setError('Please enter a topic');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setGeneratedQuestions([]);

      const response = await api.post('/ai-quiz-generator/generate', {
        topic: formData.topic,
        difficulty: formData.difficulty,
        questionCount: formData.questionCount,
        questionTypes: formData.questionTypes,
        includeExplanations: formData.includeExplanations
      });

      setGeneratedQuestions(response.data.questions);
      setSuccess(`Generated ${response.data.questions.length} questions successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError(error.response?.data?.error || 'Failed to generate quiz. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!formData.title || !formData.topic || !formData.subject) {
      setError('Please fill in all required fields (Title, Topic, and Subject)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await api.post('/ai-quiz-generator/create-quiz', {
        title: formData.title,
        topic: formData.topic,
        subject: formData.subject,
        year: formData.year,
        difficulty: formData.difficulty,
        questionCount: formData.questionCount,
        questionTypes: formData.questionTypes,
        includeExplanations: formData.includeExplanations,
        timeLimit: formData.timeLimit
      });

      setSuccess('Quiz created successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/quizzes/${response.data.quiz._id}`);
      }, 1000);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error.response?.data?.error || 'Failed to create quiz. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="AI Quiz Generator"
        subtitle="Generate custom quizzes instantly using AI - just enter a topic and let AI create the questions"
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generate Quiz</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered quiz creation</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Quiz Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Dental Anatomy Quiz"
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
                placeholder="e.g., Tooth Morphology, Root Canal Treatment"
                className="input w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Be specific for better results
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Questions: {formData.questionCount}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={formData.questionCount}
                onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>5</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                min="5"
                max="180"
                className="input w-full"
              />
            </div>

            {/* Include Explanations */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="explanations"
                checked={formData.includeExplanations}
                onChange={(e) => setFormData({ ...formData, includeExplanations: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="explanations" className="text-sm text-gray-700 dark:text-gray-300">
                Include explanations for answers
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading || !formData.topic}
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
                    Preview Questions
                  </>
                )}
              </button>
              <button
                onClick={handleCreateQuiz}
                disabled={loading || !formData.title || !formData.topic || !formData.subject}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Create Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Preview/Info Panel */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generated questions</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Generating questions with AI...</p>
            </div>
          ) : generatedQuestions.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {generatedQuestions.map((q, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                      {q.question}
                    </p>
                  </div>
                  {q.options && (
                    <div className="ml-8 space-y-1">
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`text-sm p-2 rounded ${
                            optIndex === q.correctAnswer
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {optIndex === q.correctAnswer && (
                            <CheckCircle className="w-4 h-4 inline ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.explanation && (
                    <div className="ml-8 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-gray-700 dark:text-gray-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Questions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter a topic and click "Preview Questions" to see AI-generated questions
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg max-w-md">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 text-left">
                  <li>• Enter your topic (e.g., "Dental Anatomy")</li>
                  <li>• Choose difficulty and question count</li>
                  <li>• AI generates relevant questions instantly</li>
                  <li>• Preview and create your quiz</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIQuizGenerator;