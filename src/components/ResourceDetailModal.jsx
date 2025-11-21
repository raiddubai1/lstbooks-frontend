import { X, Edit, Trash2, Download, Eye, FileText, Video, Presentation, Image, File, ExternalLink, Clock, HardDrive } from 'lucide-react';
import api from '../services/api';

const ResourceDetailModal = ({ resource, onClose, onEdit, onDelete }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'slide':
        return <Presentation className="w-6 h-6" />;
      case 'image':
        return <Image className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'video':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'slide':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'image':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const handleDownload = async () => {
    try {
      await api.post(`/resources/${resource._id}/download`);
      window.open(resource.fileUrl, '_blank');
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                {getTypeIcon(resource.type)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {resource.title}
              </h2>
              {resource.isExternal && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  <ExternalLink className="w-3 h-3" />
                  {resource.externalSource}
                </span>
              )}
            </div>
            {resource.description && (
              <p className="text-gray-600 dark:text-gray-400">{resource.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thumbnail/Preview */}
          {resource.thumbnailUrl ? (
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className={`w-full h-64 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
              <div className="text-8xl">
                {getTypeIcon(resource.type)}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Type</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{resource.type}</p>
            </div>
            {resource.year && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Year</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Year {resource.year}</p>
              </div>
            )}
            {resource.formattedSize && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">File Size</p>
                <div className="flex items-center gap-1">
                  <HardDrive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{resource.formattedSize}</p>
                </div>
              </div>
            )}
            {resource.formattedDuration && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{resource.formattedDuration}</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Views</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{resource.views || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Downloads</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{resource.downloads || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject */}
          {resource.subject && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subject</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{resource.subject.name}</p>
            </div>
          )}

          {/* Topics */}
          {resource.topics && resource.topics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {resource.topics.map((topic, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* File URL */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">File URL</h3>
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {resource.fileUrl}
            </a>
          </div>

          {/* Uploaded By */}
          {resource.uploadedBy && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Uploaded By</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {resource.uploadedBy.name || resource.uploadedBy.email}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium mb-1">Created</p>
              <p>{new Date(resource.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Last Updated</p>
              <p>{new Date(resource.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={() => onEdit(resource)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={() => onDelete(resource._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal;

