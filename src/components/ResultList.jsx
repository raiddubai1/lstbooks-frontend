import { CheckCircle, XCircle, Award } from 'lucide-react';

const ResultList = ({ answers }) => {
  const getScoreColor = (percent) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 70) return 'text-blue-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Results</h2>
      
      {answers.map((answer, index) => {
        const percentEarned = answer.maxPoints > 0 
          ? (answer.pointsEarned / answer.maxPoints) * 100 
          : 0;
        
        return (
          <div
            key={answer.questionId}
            className={`border-2 rounded-lg p-6 ${
              answer.correct 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}
          >
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Question {index + 1}
                  </span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                    {answer.type === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    answer.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {answer.pointsEarned} / {answer.maxPoints} points
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {answer.questionText}
                </h3>
              </div>
              
              <div className="ml-4">
                {answer.correct ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-3">
              {/* User's Answer */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                <p className={`text-gray-900 ${!answer.userAnswer && 'text-gray-400 italic'}`}>
                  {answer.userAnswer || 'No answer provided'}
                </p>
              </div>

              {/* Correct Answer (if wrong) */}
              {!answer.correct && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-1">Correct Answer:</p>
                  <p className="text-gray-900">{answer.correctAnswer}</p>
                </div>
              )}

              {/* MCQ Options Display */}
              {answer.type === 'MCQ' && answer.options && answer.options.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">All Options:</p>
                  <div className="space-y-2">
                    {answer.options.map((option, optIndex) => {
                      const isUserAnswer = option === answer.userAnswer;
                      const isCorrectAnswer = option === answer.correctAnswer;
                      
                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 p-2 rounded ${
                            isCorrectAnswer 
                              ? 'bg-green-100 border border-green-300' 
                              : isUserAnswer 
                              ? 'bg-red-100 border border-red-300' 
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <span className="flex-1">{option}</span>
                          {isCorrectAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Resources */}
              {answer.resources && answer.resources.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    📚 Additional Resources:
                  </p>
                  <ul className="space-y-1">
                    {answer.resources.map((resource, resIndex) => (
                      <li key={resIndex}>
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

            {/* Score Badge */}
            <div className="mt-4 flex items-center gap-2">
              <Award className={`w-5 h-5 ${getScoreColor(percentEarned)}`} />
              <span className={`font-medium ${getScoreColor(percentEarned)}`}>
                {percentEarned.toFixed(0)}% on this question
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultList;

