import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import clsx from 'clsx';

const FlashcardComponent = ({ flashcard, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (quality) => {
    onRate(quality);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={clsx(
          'card min-h-[300px] cursor-pointer transition-all duration-300',
          isFlipped && 'bg-primary-50'
        )}
        onClick={handleFlip}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[250px] p-8">
          <div className="mb-4">
            <RotateCw className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              {isFlipped ? 'Answer' : 'Question'}
            </p>
            <p className="text-xl font-medium">
              {isFlipped ? flashcard.back : flashcard.front}
            </p>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center mb-3">
            How well did you know this?
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleRate(1)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Again
            </button>
            <button
              onClick={() => handleRate(3)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
            >
              Hard
            </button>
            <button
              onClick={() => handleRate(4)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              Good
            </button>
            <button
              onClick={() => handleRate(5)}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              Easy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardComponent;

