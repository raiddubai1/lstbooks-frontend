import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubject } from '../services/api';
import Loading from '../components/Loading';
import { ArrowLeft, FileText, Video, ExternalLink } from 'lucide-react';

const SubjectDetail = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    try {
      const response = await getSubject(id);
      setSubject(response.data);
    } catch (error) {
      console.error('Error fetching subject:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!subject) return <div className="text-center py-12 text-gray-500">Subject not found</div>;

  const getResourceIcon = (type) => {
    return type === 'pdf' ? <FileText className="w-5 h-5" /> : <Video className="w-5 h-5" />;
  };

  const getResourceColor = (type) => {
    return type === 'pdf' ? 'text-red-600' : 'text-blue-600';
  };

  return (
    <div>
      <Link to="/subjects" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Subjects
      </Link>

      {/* Header */}
      <div className="card mb-6 border-l-4 border-primary-500">
        <h1 className="text-3xl font-bold mb-3">{subject.name}</h1>
        <p className="text-gray-700 text-lg mb-4">{subject.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Created {new Date(subject.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{subject.resources?.length || 0} resources</span>
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>

        {subject.resources && subject.resources.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {subject.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:shadow-lg hover:border-primary-300 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${getResourceColor(resource.type)} mt-1`}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-500 uppercase mb-2">
                      {resource.type}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {resource.url}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">No resources available for this subject yet.</p>
          </div>
        )}
      </div>

      {/* Related Links */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Related Study Materials</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/quizzes" className="card hover:border-primary-300 hover:shadow-md transition-all">
            <h3 className="font-semibold mb-2">Practice Quizzes</h3>
            <p className="text-sm text-gray-600">Test your knowledge with interactive quizzes</p>
          </Link>
          <Link to="/flashcards" className="card hover:border-primary-300 hover:shadow-md transition-all">
            <h3 className="font-semibold mb-2">Flashcards</h3>
            <p className="text-sm text-gray-600">Review key concepts with flashcards</p>
          </Link>
          <Link to="/osce" className="card hover:border-primary-300 hover:shadow-md transition-all">
            <h3 className="font-semibold mb-2">OSCE Practice</h3>
            <p className="text-sm text-gray-600">Prepare for clinical examinations</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;

