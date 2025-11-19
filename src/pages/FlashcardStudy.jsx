import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getFlashcards } from '../services/api';
import axios from 'axios';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw, CheckCircle, XCircle, Frown, Meh, Smile, Zap } from 'lucide-react';

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

  // SRS Rating System (0-5 scale)
  // 0: Complete blackout, 1: Incorrect, 2: Incorrect but remembered, 3: Correct but difficult, 4: Correct with hesitation, 5: Perfect recall
  const handleSRSRating = async (quality) => {
    const currentCard = flashcards[currentIndex];

    // Calculate new SRS values using SM-2 algorithm
    let easeFactor = 2.5; // Default ease factor
    let interval = 0;
    let repetitions = 0;

    // Simple SM-2 algorithm implementation
    if (quality >= 3) {
      // Correct response
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      // Incorrect response
      repetitions = 0;
      interval = 1;
    }

    // Ensure ease factor doesn't go below 1.3
    easeFactor = Math.max(1.3, easeFactor);

    try {
      // Send to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/progress/flashcard-review`, {
        flashcardId: currentCard._id,
        subjectId: currentCard.subjectId,
        quality,
        easeFactor,
        interval,
        repetitions
      });

      // Update local state based on quality
      if (quality >= 4) {
        const newLearned = new Set(learned);
        newLearned.add(currentCard._id);
        setLearned(newLearned);

        const newReviewLater = new Set(reviewLater);
        newReviewLater.delete(currentCard._id);
        setReviewLater(newReviewLater);
      } else if (quality <= 2) {
        const newReviewLater = new Set(reviewLater);
        newReviewLater.add(currentCard._id);
        setReviewLater(newReviewLater);

        const newLearned = new Set(learned);
        newLearned.delete(currentCard._id);
        setLearned(newLearned);
      }

      handleNext();
    } catch (error) {
      console.error('Error recording flashcard review:', error);
      handleNext(); // Still move to next card even if API fails
    }
  };

  const handleMarkLearned = () => {
    handleSRSRating(5); // Perfect recall
  };

  const handleMarkReviewLater = () => {
    handleSRSRating(1); // Incorrect
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

      {/* SRS Rating Buttons */}
      {isFlipped && (
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            How well did you know this?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleSRSRating(1)}
              className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700 px-4 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex flex-col items-center gap-2"
            >
              <Frown className="w-6 h-6" />
              <span className="text-xs font-semibold">Again</span>
              <span className="text-xs opacity-75">&lt;1 day</span>
            </button>

            <button
              onClick={() => handleSRSRating(2)}
              className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-700 px-4 py-3 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex flex-col items-center gap-2"
            >
              <Meh className="w-6 h-6" />
              <span className="text-xs font-semibold">Hard</span>
              <span className="text-xs opacity-75">1 day</span>
            </button>

            <button
              onClick={() => handleSRSRating(4)}
              className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex flex-col items-center gap-2"
            >
              <Smile className="w-6 h-6" />
              <span className="text-xs font-semibold">Good</span>
              <span className="text-xs opacity-75">3 days</span>
            </button>

            <button
              onClick={() => handleSRSRating(5)}
              className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700 px-4 py-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex flex-col items-center gap-2"
            >
              <Zap className="w-6 h-6" />
              <span className="text-xs font-semibold">Easy</span>
              <span className="text-xs opacity-75">6+ days</span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-3">
            Your rating helps optimize when you'll see this card again
          </p>
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

