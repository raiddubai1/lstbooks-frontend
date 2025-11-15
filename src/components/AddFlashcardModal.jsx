import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { getSubjects, createFlashcard } from '../services/api';

const AddFlashcardModal = ({ isOpen, onClose, onFlashcardAdded }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState({
    question: '',
    answer: ''
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
    setSelectedSubject('');
    setFlashcards([]);
    setCurrentCard({ question: '', answer: '' });
    onClose();
  };

  const handleAddCard = () => {
    if (!currentCard.question.trim() || !currentCard.answer.trim()) {
      alert('Please fill in both question and answer');
      return;
    }

    setFlashcards([...flashcards, currentCard]);
    setCurrentCard({ question: '', answer: '' });
  };

  const handleRemoveCard = (index) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }

    if (flashcards.length === 0) {
      alert('Please add at least one flashcard');
      return;
    }

    try {
      // Create all flashcards
      const createdFlashcards = [];
      for (const card of flashcards) {
        const response = await createFlashcard({
          question: card.question,
          answer: card.answer,
          subjectId: selectedSubject
        });
        createdFlashcards.push(response.data);
      }

      alert(`${createdFlashcards.length} flashcard(s) created successfully!`);
      onFlashcardAdded(createdFlashcards);
      handleClose();
    } catch (error) {
      console.error('Error creating flashcards:', error);
      alert('Failed to create flashcards');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add Flashcards</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Subject Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
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

          {/* Added Flashcards */}
          {flashcards.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Added Flashcards ({flashcards.length})
              </h3>
              <div className="space-y-3">
                {flashcards.map((card, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        Q: {card.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        A: {card.answer}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Flashcard Form */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Add Flashcard</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question (Front) *
              </label>
              <textarea
                value={currentCard.question}
                onChange={(e) => setCurrentCard({ ...currentCard, question: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter the question..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer (Back) *
              </label>
              <textarea
                value={currentCard.answer}
                onChange={(e) => setCurrentCard({ ...currentCard, answer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Enter the answer..."
              />
            </div>

            <button
              type="button"
              onClick={handleAddCard}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Flashcard
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
              Create {flashcards.length} Flashcard{flashcards.length !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlashcardModal;

