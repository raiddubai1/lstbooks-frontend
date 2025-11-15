import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/api';
import { getUser } from '../utils/auth';
import Loading from '../components/Loading';
import { Clock, CheckCircle } from 'lucide-react';
import { formatTime, getScoreColor } from '../utils/helpers';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && quiz.timeLimit && !submitted) {
      setTimeLeft(quiz.timeLimit * 60);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

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

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
    const user = getUser();
    const answerArray = quiz.questions.map((_, index) => answers[index] || '');
    
    try {
      const response = await submitQuiz(id, {
        userId: user?.id,
        answers: answerArray,
        timeSpent: quiz.timeLimit ? (quiz.timeLimit * 60 - (timeLeft || 0)) : 0
      });
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) return <Loading />;
  if (!quiz) return <div>Quiz not found</div>;

  if (submitted && results) {
    const passed = results.score >= quiz.passingScore;
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <CheckCircle className={`w-12 h-12 ${passed ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {passed ? 'You passed the quiz!' : 'You need more practice.'}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className={`text-5xl font-bold mb-2 ${getScoreColor(results.score)}`}>
              {results.score.toFixed(1)}%
            </p>
            <p className="text-gray-600">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/quizzes')} className="btn-secondary">
              Back to Quizzes
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-primary-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                answers[currentQuestion] === option
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswer(currentQuestion, option)}
                className="mr-3"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button onClick={handleSubmit} className="btn-primary">
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="btn-primary"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTake;

