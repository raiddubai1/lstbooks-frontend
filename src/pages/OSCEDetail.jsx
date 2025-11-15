import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOSCEStation } from '../services/api';
import { ArrowLeft, ClipboardList, Stethoscope, ListChecks, ExternalLink, Lightbulb, Target } from 'lucide-react';

const OSCEDetail = () => {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStation();
  }, [id]);

  const fetchStation = async () => {
    try {
      const response = await getOSCEStation(id);
      setStation(response.data);
    } catch (error) {
      console.error('Error fetching OSCE station:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading OSCE station...</p>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">OSCE station not found</h2>
          <Link to="/osce" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            ← Back to OSCE Stations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/osce"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to OSCE Stations
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-8 h-8 text-red-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{station.title}</h1>
            {station.subjectId && (
              <span className="inline-block text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded mb-3">
                {station.subjectId.name}
              </span>
            )}
            <p className="text-gray-700 leading-relaxed">{station.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-gray-500" />
            <span>{station.skills?.length || 0} related skills</span>
          </div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-gray-500" />
            <span>{station.steps?.length || 0} steps</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Created {new Date(station.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Related Skills */}
      {station.skills && station.skills.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            Related Clinical Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {station.skills.map((skill) => (
              <Link
                key={skill._id}
                to={`/skills/${skill._id}`}
                className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                    {skill.title}
                  </h3>
                  {skill.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {skill.description}
                    </p>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      {station.steps && station.steps.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-green-600" />
            Station Steps
          </h2>
          <div className="space-y-3">
            {station.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="flex-1 text-gray-800 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Tips */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-green-600" />
          Practice Tips
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl">💡</span>
            <span className="text-gray-800">Review all related clinical skills before attempting this station</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl">💡</span>
            <span className="text-gray-800">Practice each step multiple times until you can perform them smoothly</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl">💡</span>
            <span className="text-gray-800">Time yourself to ensure you can complete the station within the allocated time</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl">💡</span>
            <span className="text-gray-800">Practice with a partner and provide feedback to each other</span>
          </li>
        </ul>
      </div>

      {/* Related Resources */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          Related Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {station.subjectId && (
            <Link
              to={`/subjects/${station.subjectId._id}`}
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <Target className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">View Subject</p>
                <p className="font-medium text-gray-900 group-hover:text-purple-700">
                  {station.subjectId.name}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}
          <Link
            to="/labs"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
          >
            <Target className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Practice</p>
              <p className="font-medium text-gray-900 group-hover:text-purple-700">
                Lab Procedures
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OSCEDetail;

