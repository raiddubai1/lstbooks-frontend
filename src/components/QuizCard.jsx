import { Link } from 'react-router-dom';
import { Brain, Clock, Target } from 'lucide-react';
import { getDifficultyColor } from '../utils/helpers';

const QuizCard = ({ quiz }) => {
  return (
    <Link
      to={`/quizzes/${quiz._id}`}
      className="card hover:border-primary-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg flex-1">{quiz.title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(quiz.difficulty)}`}>
          {quiz.difficulty}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {quiz.description}
      </p>

      {quiz.subject && (
        <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded inline-block mb-3">
          {quiz.subject.name}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Brain className="w-4 h-4" />
          <span>{quiz.questions?.length || 0} questions</span>
        </div>
        {quiz.timeLimit && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{quiz.timeLimit} min</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          <span>{quiz.passingScore}% to pass</span>
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;

