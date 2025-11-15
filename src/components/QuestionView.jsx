import { CheckCircle, XCircle } from 'lucide-react';

const QuestionView = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  answer, 
  onAnswerChange, 
  showResult = false,
  correctAnswer = null,
  isCorrect = null
}) => {
  const handleMCQChange = (option) => {
    onAnswerChange(option);
  };

  const handleShortAnswerChange = (e) => {
    onAnswerChange(e.target.value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            {question.points && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {question.points} {question.points === 1 ? 'point' : 'points'}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {question.questionText}
          </h3>
        </div>
        
        {showResult && (
          <div className="ml-4">
            {isCorrect ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
        )}
      </div>

      {/* Question Type Badge */}
      <div className="mb-4">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {question.type === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}
        </span>
      </div>

      {/* Answer Options */}
      {question.type === 'MCQ' ? (
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isSelected = answer === option;
            const isCorrectOption = showResult && option === correctAnswer;
            const isWrongSelection = showResult && isSelected && !isCorrect;
            
            let borderColor = 'border-gray-200';
            let bgColor = 'bg-white';
            
            if (showResult) {
              if (isCorrectOption) {
                borderColor = 'border-green-500';
                bgColor = 'bg-green-50';
              } else if (isWrongSelection) {
                borderColor = 'border-red-500';
                bgColor = 'bg-red-50';
              }
            } else if (isSelected) {
              borderColor = 'border-blue-500';
              bgColor = 'bg-blue-50';
            }
            
            return (
              <label
                key={index}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${borderColor} ${bgColor} ${
                  !showResult && 'hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={isSelected}
                    onChange={() => handleMCQChange(option)}
                    disabled={showResult}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="flex-1 text-gray-900">{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && isWrongSelection && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <div>
          <textarea
            value={answer || ''}
            onChange={handleShortAnswerChange}
            disabled={showResult}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
          {showResult && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</p>
              <p className="text-gray-900">{correctAnswer}</p>
            </div>
          )}
        </div>
      )}

      {/* Resources */}
      {showResult && question.resources && question.resources.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">📚 Additional Resources:</p>
          <ul className="space-y-1">
            {question.resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {resource}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionView;

