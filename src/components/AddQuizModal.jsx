import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { getSubjects, createQuiz } from '../services/api';

const AddQuizModal = ({ isOpen, onClose, onQuizAdded }) => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    type: 'MCQ',
    options: ['', '', '', ''],
    answer: '',
    resources: ['']
  });

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen]);

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', subjectId: '', questions: [] });
    setCurrentQuestion({
      questionText: '',
      type: 'MCQ',
      options: ['', '', '', ''],
      answer: '',
      resources: ['']
    });
    onClose();
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.answer) {
      alert('Please fill in question text and answer');
      return;
    }

    if (currentQuestion.type === 'MCQ' && currentQuestion.options.filter(o => o.trim()).length < 2) {
      alert('Please provide at least 2 options for MCQ');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      options: currentQuestion.type === 'MCQ' ? currentQuestion.options.filter(o => o.trim()) : [],
      resources: currentQuestion.resources.filter(r => r.trim())
    };

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });

    setCurrentQuestion({
      questionText: '',
      type: 'MCQ',
      options: ['', '', '', ''],
      answer: '',
      resources: ['']
    });
  };

  const handleRemoveQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...currentQuestion.resources];
    newResources[index] = value;
    setCurrentQuestion({ ...currentQuestion, resources: newResources });
  };

  const handleAddResource = () => {
    setCurrentQuestion({
      ...currentQuestion,
      resources: [...currentQuestion.resources, '']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.subjectId) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      const response = await createQuiz(formData);
      alert('Quiz created successfully!');
      onQuizAdded(response.data);
      handleClose();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Quiz</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Quiz Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Quiz Details</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Added Questions */}
          {formData.questions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Added Questions ({formData.questions.length})
              </h3>
              <div className="space-y-3">
                {formData.questions.map((q, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {index + 1}. {q.questionText}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Type: {q.type} | Answer: {q.answer}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Question Form */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Add Question</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type *
              </label>
              <select
                value={currentQuestion.type}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  type: e.target.value,
                  options: e.target.value === 'MCQ' ? ['', '', '', ''] : [],
                  answer: ''
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="ShortAnswer">Short Answer</option>
              </select>
            </div>

            {currentQuestion.type === 'MCQ' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options *
                </label>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
              </label>
              {currentQuestion.type === 'MCQ' ? (
                <select
                  value={currentQuestion.answer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select correct answer</option>
                  {currentQuestion.options.filter(o => o.trim()).map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={currentQuestion.answer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
                  placeholder="Enter correct answer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resources (Optional)
              </label>
              <div className="space-y-2">
                {currentQuestion.resources.map((resource, index) => (
                  <input
                    key={index}
                    type="url"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    placeholder="https://example.com/resource"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddResource}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Resource Link
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Question to Quiz
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizModal;

