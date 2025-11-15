import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizAttempt } from '../services/api';
import AttemptSummary from '../components/AttemptSummary';
import ResultList from '../components/ResultList';
import Loading from '../components/Loading';

const QuizResults = () => {
  const { id, attemptId } = useParams();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttempt();
  }, [id, attemptId]);

  const fetchAttempt = async () => {
    try {
      const response = await getQuizAttempt(id, attemptId);
      setAttempt(response.data);
    } catch (error) {
      console.error('Error fetching attempt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    navigate(`/quizzes/${id}/take`);
  };

  const handleBackToList = () => {
    navigate('/quizzes');
  };

  if (loading) return <Loading />;
  if (!attempt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Attempt not found</p>
        <button
          onClick={handleBackToList}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  // Calculate correct answers count
  const correctAnswers = attempt.answers.filter(a => a.correct).length;
  const totalQuestions = attempt.answers.length;

  const attemptData = {
    ...attempt,
    correctAnswers,
    totalQuestions
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Summary Section */}
      <div className="mb-8">
        <AttemptSummary
          attempt={attemptData}
          onRetry={handleRetry}
          onBackToList={handleBackToList}
        />
      </div>

      {/* Detailed Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <ResultList answers={attempt.answers} />
      </div>
    </div>
  );
};

export default QuizResults;

