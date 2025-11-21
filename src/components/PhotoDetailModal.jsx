import { useState } from 'react';
import { X, Eye, Heart, Star, CheckCircle, Download, Calendar, Edit } from 'lucide-react';
import api from '../services/api';
import EditPhotoModal from './EditPhotoModal';

const PhotoDetailModal = ({ photo, onClose, onUpdate, onLike }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await api.delete(`/photos/${photo._id}`);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  if (isEditing) {
    return <EditPhotoModal photo={photo} onClose={() => setIsEditing(false)} onSuccess={() => { setIsEditing(false); onUpdate(); }} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {photo.title}
            {photo.featured && <Star className="w-6 h-6 text-yellow-500" />}
            {photo.verified && <CheckCircle className="w-6 h-6 text-green-500" />}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          <div className="relative w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-auto max-h-[60vh] object-contain mx-auto"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              <span className="text-blue-900 dark:text-blue-100 font-medium">
                {photo.views || 0} views
              </span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900 px-4 py-2 rounded-lg">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-300" />
              <span className="text-red-900 dark:text-red-100 font-medium">
                {photo.likes || 0} likes
              </span>
            </div>
            {photo.resolution && (
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900 px-4 py-2 rounded-lg">
                <span className="text-purple-900 dark:text-purple-100 font-medium">
                  {photo.resolution}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {photo.description && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{photo.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Category</h4>
              <p className="text-gray-600 dark:text-gray-400">{photo.category}</p>
            </div>

            {photo.subcategory && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Subcategory</h4>
                <p className="text-gray-600 dark:text-gray-400">{photo.subcategory}</p>
              </div>
            )}

            {photo.source && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Source</h4>
                <p className="text-gray-600 dark:text-gray-400">{photo.source}</p>
              </div>
            )}

            {photo.copyright && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Copyright</h4>
                <p className="text-gray-600 dark:text-gray-400">{photo.copyright}</p>
              </div>
            )}

            {photo.uploadedBy && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Uploaded By</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {photo.uploadedBy.name || photo.uploadedBy.email}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Upload Date</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(photo.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(photo._id, e);
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Like
            </button>
            <a
              href={photo.imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </a>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
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

export default PhotoDetailModal;

