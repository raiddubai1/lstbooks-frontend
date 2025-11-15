import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getFlashcards } from '../services/api';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw, CheckCircle, XCircle } from 'lucide-react';

const FlashcardStudy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [learned, setLearned] = useState(new Set());
  const [reviewLater, setReviewLater] = useState(new Set());

  useEffect(() => {
    fetchFlashcards();
  }, [subjectId]);

  const fetchFlashcards = async () => {
    try {
      const params = subjectId ? { subjectId } : {};
      const response = await getFlashcards(params);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkLearned = () => {
    const newLearned = new Set(learned);
    newLearned.add(flashcards[currentIndex]._id);
    setLearned(newLearned);
    
    // Remove from review later if it was there
    const newReviewLater = new Set(reviewLater);
    newReviewLater.delete(flashcards[currentIndex]._id);
    setReviewLater(newReviewLater);
    
    handleNext();
  };

  const handleMarkReviewLater = () => {
    const newReviewLater = new Set(reviewLater);
    newReviewLater.add(flashcards[currentIndex]._id);
    setReviewLater(newReviewLater);
    
    // Remove from learned if it was there
    const newLearned = new Set(learned);
    newLearned.delete(flashcards[currentIndex]._id);
    setLearned(newLearned);
    
    handleNext();
  };

  const handleKeyPress = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isFlipped]);

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

  if (flashcards.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/flashcards')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Flashcards
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No flashcards available</h2>
          <p className="text-gray-600">Add some flashcards to start studying!</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/flashcards')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Flashcards
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
          <div className="w-64 h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="text-green-600 font-medium">{learned.size} learned</span>
          {' • '}
          <span className="text-orange-600 font-medium">{reviewLater.size} review</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="max-w-3xl mx-auto mb-8">
        <div
          className="relative h-96 cursor-pointer"
          onClick={handleFlip}
          style={{ perspective: '1000px' }}
        >
          <div
            className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full bg-white border-2 border-blue-300 rounded-xl shadow-xl flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-xs text-blue-600 font-semibold mb-4 uppercase tracking-wide">Question</p>
              <p className="text-2xl font-bold text-gray-900 text-center">
                {currentCard.question}
              </p>
              <p className="text-sm text-gray-500 mt-6">Click or press Space to flip</p>
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl flex flex-col items-center justify-center p-8"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <p className="text-xs text-blue-100 font-semibold mb-4 uppercase tracking-wide">Answer</p>
              <p className="text-xl text-white text-center leading-relaxed">
                {currentCard.answer}
              </p>
              <p className="text-sm text-blue-100 mt-6">Click or press Space to flip back</p>
            </div>
          </div>
        </div>

        {/* Flip Hint */}
        <div className="text-center mt-4">
          <button
            onClick={handleFlip}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mx-auto"
          >
            <RotateCw className="w-4 h-4" />
            <span className="text-sm">Flip Card</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {isFlipped && (
        <div className="max-w-3xl mx-auto mb-8 flex gap-4 justify-center">
          <button
            onClick={handleMarkReviewLater}
            className="flex-1 max-w-xs bg-orange-100 text-orange-700 border-2 border-orange-300 px-6 py-3 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Review Later
          </button>
          <button
            onClick={handleMarkLearned}
            className="flex-1 max-w-xs bg-green-100 text-green-700 border-2 border-green-300 px-6 py-3 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Learned
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {/* Progress Dots */}
        <div className="flex gap-2">
          {flashcards.slice(Math.max(0, currentIndex - 2), Math.min(flashcards.length, currentIndex + 3)).map((card, idx) => {
            const actualIndex = Math.max(0, currentIndex - 2) + idx;
            const cardId = card._id;
            return (
              <button
                key={actualIndex}
                onClick={() => {
                  setCurrentIndex(actualIndex);
                  setIsFlipped(false);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  actualIndex === currentIndex
                    ? 'bg-blue-600 w-8'
                    : learned.has(cardId)
                    ? 'bg-green-500'
                    : reviewLater.has(cardId)
                    ? 'bg-orange-500'
                    : 'bg-gray-300'
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>Keyboard shortcuts:</strong> Space/Enter = Flip • ← = Previous • → = Next
        </p>
      </div>
    </div>
  );
};

export default FlashcardStudy;

