import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import PhotoDetailModal from '../components/PhotoDetailModal';
import AddPhotoModal from '../components/AddPhotoModal';
import { Image, Search, Filter, Plus, Eye, Heart, Star, CheckCircle, Grid, List, X } from 'lucide-react';

const PhotoLibrary = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = [
    'All',
    'Dental Anatomy',
    'Oral Pathology',
    'Periodontology',
    'Endodontics',
    'Prosthodontics',
    'Oral Surgery',
    'Orthodontics',
    'Pediatric Dentistry',
    'Radiology',
    'Clinical Cases',
    'Procedures',
    'Instruments',
    'Lab Work',
    'Other'
  ];

  useEffect(() => {
    fetchPhotos();
  }, [selectedCategory, selectedSubcategory, showFeatured, showVerified, searchTerm]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedSubcategory) params.subcategory = selectedSubcategory;
      if (showFeatured) params.featured = 'true';
      if (showVerified) params.verified = 'true';
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/photos', { params });
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = async (photo) => {
    setSelectedPhoto(photo);
    try {
      await api.post(`/photos/${photo._id}/view`);
      fetchPhotos(); // Refresh to update view count
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleLike = async (photoId, e) => {
    e.stopPropagation();
    try {
      await api.post(`/photos/${photoId}/like`);
      fetchPhotos(); // Refresh to update like count
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Image className="w-8 h-8 text-purple-600" />
            Photo Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse dental images, clinical cases, and educational photos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Photo
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category === 'All' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subcategory
            </label>
            <input
              type="text"
              placeholder="Enter subcategory"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFeatured}
                onChange={(e) => setShowFeatured(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Only
              </span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVerified}
                onChange={(e) => setShowVerified(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Verified Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Total Photos</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">{photos.length}</p>
            </div>
            <Image className="w-10 h-10 text-purple-600 dark:text-purple-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">Featured</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-white mt-1">
                {photos.filter(p => p.featured).length}
              </p>
            </div>
            <Star className="w-10 h-10 text-yellow-600 dark:text-yellow-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-300 font-medium">Verified</p>
              <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">
                {photos.filter(p => p.verified).length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Views</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-white mt-1">
                {photos.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
              </p>
            </div>
            <Eye className="w-10 h-10 text-blue-600 dark:text-blue-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Photos Grid/List */}
      {photos.length === 0 ? (
        <div className="card text-center py-12">
          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No photos found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} onClick={() => handlePhotoClick(photo)} onLike={handleLike} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {photos.map((photo) => (
            <PhotoListItem key={photo._id} photo={photo} onClick={() => handlePhotoClick(photo)} onLike={handleLike} />
          ))}
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <PhotoDetailModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} onUpdate={fetchPhotos} onLike={handleLike} />
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <AddPhotoModal onClose={() => setShowAddModal(false)} onSuccess={fetchPhotos} />
      )}
    </div>
  );
};

// Photo Card Component (Grid View)
const PhotoCard = ({ photo, onClick, onLike }) => {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {photo.featured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {photo.verified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        {/* Stats Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {photo.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {photo.likes || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
          {photo.title}
        </h3>
        {photo.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {photo.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
            {photo.category}
          </span>
          <button
            onClick={(e) => onLike(photo._id, e)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {photo.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Photo List Item Component (List View)
const PhotoListItem = ({ photo, onClick, onLike }) => {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-4"
    >
      {/* Image */}
      <div className="relative w-full md:w-64 h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
        <img
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {photo.featured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {photo.verified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {photo.title}
            </h3>
            {photo.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {photo.description}
              </p>
            )}
          </div>
          <button
            onClick={(e) => onLike(photo._id, e)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
            {photo.category}
          </span>
          {photo.subcategory && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              {photo.subcategory}
            </span>
          )}
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{photo.views || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{photo.likes || 0} likes</span>
          </div>
        </div>

        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {photo.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoLibrary;

