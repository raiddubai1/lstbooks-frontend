import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuiz, checkAnswer } from '../services/api';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, ExternalLink, Lightbulb } from 'lucide-react';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await getQuiz(id);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = async (questionIndex) => {
    const userAnswer = userAnswers[questionIndex];
    if (!userAnswer || !userAnswer.trim()) {
      alert('Please provide an answer first');
      return;
    }

    try {
      const response = await checkAnswer(id, {
        questionIndex,
        userAnswer
      });

      setCheckedAnswers({
        ...checkedAnswers,
        [questionIndex]: response.data
      });
    } catch (error) {
      console.error('Error checking answer:', error);
      alert('Failed to check answer');
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: value
    });
    // Clear checked answer when user changes their answer
    if (checkedAnswers[questionIndex]) {
      const newChecked = { ...checkedAnswers };
      delete newChecked[questionIndex];
      setCheckedAnswers(newChecked);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Quiz not found</h2>
          <Link to="/quizzes" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/quizzes"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Quizzes
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{quiz.title}</h1>
            {quiz.subjectId && (
              <span className="inline-block text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
                {quiz.subjectId.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-500" />
            <span>{quiz.questions?.length || 0} questions</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {quiz.questions && quiz.questions.length > 0 && (
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Question {index + 1}: {question.questionText}
              </h3>

              {/* MCQ Options */}
              {question.type === 'MCQ' && question.options && (
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`block p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        userAnswers[index] === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mr-3"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {/* Short Answer Input */}
              {question.type === 'ShortAnswer' && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={userAnswers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Check Answer Button */}
              {!checkedAnswers[index] && (
                <button
                  onClick={() => handleCheckAnswer(index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Check Answer
                </button>
              )}

              {/* Feedback */}
              {checkedAnswers[index] && (
                <div className={`mt-4 p-4 rounded-lg ${
                  checkedAnswers[index].isCorrect
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {checkedAnswers[index].isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold mb-2 ${
                        checkedAnswers[index].isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {checkedAnswers[index].isCorrect ? 'Correct!' : 'Incorrect'}
                      </p>
                      {!checkedAnswers[index].isCorrect && (
                        <p className="text-red-800 mb-2">
                          Correct answer: <strong>{checkedAnswers[index].correctAnswer}</strong>
                        </p>
                      )}
                      {checkedAnswers[index].resources && checkedAnswers[index].resources.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Resources:</p>
                          <div className="space-y-1">
                            {checkedAnswers[index].resources.map((resource, rIndex) => (
                              <a
                                key={rIndex}
                                href={resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {resource}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Study Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-purple-600" />
          Study Tips
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-purple-600 text-xl">💡</span>
            <span className="text-gray-800">Take your time to read each question carefully</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 text-xl">💡</span>
            <span className="text-gray-800">Use the "Check Answer" feature to get instant feedback</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 text-xl">💡</span>
            <span className="text-gray-800">Review the resources provided for incorrect answers</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 text-xl">💡</span>
            <span className="text-gray-800">Practice regularly to improve your knowledge retention</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuizDetail;

