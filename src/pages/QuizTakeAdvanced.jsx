import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, startQuizAttempt, submitQuizAttempt } from '../services/api';
import { ChevronLeft, ChevronRight, Send, List, Eye } from 'lucide-react';
import TimerBar from '../components/TimerBar';
import QuestionView from '../components/QuestionView';
import Loading from '../components/Loading';

const QuizTakeAdvanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [questionOrder, setQuestionOrder] = useState([]);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const autoSaveInterval = useRef(null);

  useEffect(() => {
    fetchQuiz();
    
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (started && timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, started]);

  // Auto-save answers to localStorage
  useEffect(() => {
    if (started && attemptId) {
      localStorage.setItem(`quiz_${attemptId}_answers`, JSON.stringify(answers));
    }
  }, [answers, attemptId, started]);

  // Load saved answers from localStorage
  useEffect(() => {
    if (attemptId) {
      const saved = localStorage.getItem(`quiz_${attemptId}_answers`);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    }
  }, [attemptId]);

  const fetchQuiz = async () => {
    try {
      const response = await getQuiz(id, { forAttempt: 'true' });
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      const userId = localStorage.getItem('userId') || null;
      const response = await startQuizAttempt(id, { userId });
      
      setAttemptId(response.data.attemptId);
      setQuestionOrder(response.data.questionOrder);
      setDeadline(response.data.deadline);
      
      if (response.data.timeLimit) {
        setTimeLeft(response.data.timeLimit);
      }
      
      setStarted(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to start quiz. Please try again.');
    }
  };

  const handleAnswerChange = (answer) => {
    const currentQuestion = orderedQuestions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  const handleSubmit = async (timedOut = false) => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const response = await submitQuizAttempt(id, {
        attemptId,
        answers,
        timedOut
      });
      
      // Clear localStorage
      localStorage.removeItem(`quiz_${attemptId}_answers`);
      
      // Navigate to results page
      navigate(`/quizzes/${id}/results/${attemptId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const handleTimeout = () => {
    handleSubmit(true);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < orderedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowQuestionList(false);
  };

  if (loading) return <Loading />;
  if (!quiz) return <div className="text-center py-12">Quiz not found</div>;

  // Order questions based on questionOrder (for shuffled quizzes)
  const orderedQuestions = questionOrder.length > 0
    ? questionOrder.map(qId => quiz.questions.find(q => q.id === qId)).filter(Boolean)
    : quiz.questions;

  // Start screen
  if (!started) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          
          {quiz.subjectId && (
            <p className="text-gray-600 mb-6">
              Subject: <span className="font-medium">{quiz.subjectId.name}</span>
            </p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Quiz Information</h2>
            <ul className="space-y-2 text-blue-800">
              <li>📝 <strong>{orderedQuestions.length}</strong> questions</li>
              <li>⭐ <strong>{quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)}</strong> total points</li>
              {quiz.timeLimit && (
                <li>⏱️ <strong>{Math.floor(quiz.timeLimit / 60)} minutes</strong> time limit</li>
              )}
              {quiz.shuffleQuestions && (
                <li>🔀 Questions will be <strong>shuffled</strong></li>
              )}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Your answers are auto-saved as you progress</li>
              {quiz.timeLimit && (
                <li>• The quiz will auto-submit when time runs out</li>
              )}
              <li>• You can navigate between questions freely</li>
              <li>• Review your answers before submitting</li>
            </ul>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = orderedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / orderedQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Timer (if timed) */}
      {timeLeft !== null && (
        <div className="mb-6">
          <TimerBar 
            timeLeft={timeLeft} 
            totalTime={quiz.timeLimit} 
            onTimeout={handleTimeout}
          />
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {orderedQuestions.length}
          </span>
          <span className="text-sm text-gray-600">
            {answeredCount} / {orderedQuestions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <QuestionView
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={orderedQuestions.length}
          answer={answers[currentQuestion.id] || ''}
          onAnswerChange={handleAnswerChange}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={() => setShowQuestionList(!showQuestionList)}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <List className="w-5 h-5" />
          Question List
        </button>

        {currentQuestionIndex === orderedQuestions.length - 1 ? (
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
          >
            <Send className="w-5 h-5" />
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Question List Modal */}
      {showQuestionList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Question Navigator</h3>
              <button
                onClick={() => setShowQuestionList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
              {orderedQuestions.map((q, index) => {
                const isAnswered = answers[q.id];
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(index)}
                    className={`aspect-square rounded-lg font-semibold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                    } hover:scale-105`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTakeAdvanced;

