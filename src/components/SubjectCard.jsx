import { Link } from 'react-router-dom';
import { BookOpen, FileText, Video } from 'lucide-react';

const SubjectCard = ({ subject }) => {
  const pdfCount = subject.resources?.filter(r => r.type === 'pdf').length || 0;
  const videoCount = subject.resources?.filter(r => r.type === 'video').length || 0;

  return (
    <Link
      to={`/subjects/${subject._id}`}
      className="card hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-xl mb-2 text-gray-900">{subject.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {subject.description}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>{subject.resources?.length || 0} resources</span>
        </div>
        {pdfCount > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{pdfCount} PDF</span>
          </div>
        )}
        {videoCount > 0 && (
          <div className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            <span>{videoCount} video</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SubjectCard;

