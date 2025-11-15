import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLab, updateLab } from '../services/api';
import Loading from '../components/Loading';
import { ArrowLeft, FlaskConical, CheckCircle2, Circle } from 'lucide-react';

const LabDetail = () => {
  const { id } = useParams();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchLab();
  }, [id]);

  const fetchLab = async () => {
    try {
      const response = await getLab(id);
      setLab(response.data);
      // Simulate checking if current user completed this lab
      // In a real app, you'd check if the current user's ID is in completedBy array
      setIsCompleted(false);
    } catch (error) {
      console.error('Error fetching lab:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      // In a real app, you'd add the current user's ID to completedBy array
      // For now, we'll just toggle the local state
      setIsCompleted(!isCompleted);
      alert(isCompleted ? 'Lab marked as incomplete' : 'Lab marked as complete! Great job! 🎉');

      // Uncomment when user authentication is implemented:
      // const userId = 'current-user-id';
      // const updatedCompletedBy = isCompleted
      //   ? lab.completedBy.filter(id => id !== userId)
      //   : [...lab.completedBy, userId];
      // await updateLab(id, { ...lab, completedBy: updatedCompletedBy });
    } catch (error) {
      console.error('Error updating lab:', error);
      alert('Failed to update lab status');
    }
  };

  if (loading) return <Loading />;
  if (!lab) return <div>Lab not found</div>;

  return (
    <div>
      <Link to="/labs" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Labs
      </Link>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{lab.title}</h1>
            {lab.subjectId && (
              <p className="text-blue-600 mb-2 font-medium">{lab.subjectId.name}</p>
            )}
            <p className="text-gray-600">{lab.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {lab.steps?.length || 0} steps • Created {new Date(lab.createdAt).toLocaleDateString()}
          </div>
          <button
            onClick={handleMarkComplete}
            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-5 h-5" />
                Mark as Completed
              </>
            )}
          </button>
        </div>
      </div>

      {/* Procedure Steps */}
      {lab.steps && lab.steps.length > 0 ? (
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Procedure Steps</h2>
          <div className="space-y-4">
            {lab.steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-8">
          <p className="text-gray-500">No steps defined for this lab yet.</p>
        </div>
      )}

      {/* Related Information */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-lg mb-3">💡 Study Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Review each step carefully before starting</li>
            <li>• Practice the procedure multiple times</li>
            <li>• Take notes on challenging steps</li>
            <li>• Ask for feedback from instructors</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="font-bold text-lg mb-3">📚 Related Materials</h3>
          <div className="space-y-2">
            <Link to="/subjects" className="block text-sm text-blue-600 hover:text-blue-700">
              → View Subject Resources
            </Link>
            <Link to="/quizzes" className="block text-sm text-blue-600 hover:text-blue-700">
              → Practice Quizzes
            </Link>
            <Link to="/flashcards" className="block text-sm text-blue-600 hover:text-blue-700">
              → Review Flashcards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDetail;

