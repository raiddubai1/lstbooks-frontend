import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import { getSkill } from '../services/api';

const SkillDetail = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkill();
  }, [id]);

  const fetchSkill = async () => {
    try {
      setLoading(true);
      const response = await getSkill(id);
      setSkill(response.data);
    } catch (error) {
      console.error('Error fetching skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMedia = (mediaItem, index) => {
    if (mediaItem.type === 'image') {
      return (
        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={mediaItem.url}
            alt={`Media ${index + 1}`}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
            }}
          />
          <div className="p-3 flex items-center gap-2 text-sm text-gray-600">
            <ImageIcon className="w-4 h-4" />
            <span>Image</span>
          </div>
        </div>
      );
    } else if (mediaItem.type === 'video') {
      return (
        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gray-200">
            <iframe
              src={mediaItem.url}
              className="w-full h-full"
              allowFullScreen
              title={`Video ${index + 1}`}
            />
          </div>
          <div className="p-3 flex items-center gap-2 text-sm text-gray-600">
            <Video className="w-4 h-4" />
            <span>Video</span>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading skill...</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Skill not found</h2>
        <Link to="/skills" className="text-blue-600 hover:underline">
          Back to Skills
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        to="/skills"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Skills
      </Link>

      {/* Skill Header */}
      <div className="card border-l-4 border-l-blue-600 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{skill.title}</h1>
            {skill.subjectId && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {skill.subjectId.name}
                </span>
              </div>
            )}
            <p className="text-gray-700 text-lg">{skill.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span>{skill.media?.length || 0} media items</span>
              <span>•</span>
              <span>Created {new Date(skill.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Media Section */}
      {skill.media && skill.media.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">Media Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skill.media.map((mediaItem, index) => renderMedia(mediaItem, index))}
          </div>
        </div>
      )}

      {/* Learning Tips */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100 mb-6">
        <h2 className="text-2xl font-bold mb-4">💡 Learning Tips</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Watch all video demonstrations carefully and take notes on key techniques</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Practice the skill multiple times under supervision before performing independently</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Review the images to understand proper positioning and technique</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Ask for feedback from instructors to improve your technique</span>
          </li>
        </ul>
      </div>

      {/* Related Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-lg mb-3">📚 Related Materials</h3>
          <div className="space-y-2">
            {skill.subjectId && (
              <Link
                to={`/subjects/${skill.subjectId._id}`}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View Subject Resources
              </Link>
            )}
            <Link
              to="/labs"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Practice Lab Procedures
            </Link>
            <Link
              to="/osce"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              OSCE Practice Stations
            </Link>
          </div>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <h3 className="font-bold text-lg mb-3">⚠️ Safety Reminders</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Always follow infection control protocols</li>
            <li>• Use appropriate personal protective equipment (PPE)</li>
            <li>• Ensure patient comfort and safety at all times</li>
            <li>• Maintain sterile technique when required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;

