import { useState, useEffect } from 'react';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import UploadResourceModal from '../components/UploadResourceModal';
import EditResourceModal from '../components/EditResourceModal';
import ResourceDetailModal from '../components/ResourceDetailModal';
import {
  Upload,
  FileText,
  Video,
  Presentation,
  Image,
  File,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Edit,
  Plus,
  ExternalLink
} from 'lucide-react';

const ResourceCenter = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pdfs: 0,
    videos: 0,
    slides: 0
  });

  useEffect(() => {
    fetchResources();
  }, [selectedType, searchTerm]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedType) params.type = selectedType;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/resources', { params });
      setResources(response.data.resources);

      // Calculate stats
      const all = response.data.resources;
      setStats({
        total: all.length,
        pdfs: all.filter(r => r.type === 'pdf').length,
        videos: all.filter(r => r.type === 'video').length,
        slides: all.filter(r => r.type === 'slide').length
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const handleDownload = async (resource) => {
    try {
      await api.post(`/resources/${resource._id}/download`);
      window.open(resource.fileUrl, '_blank');
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'slide':
        return <Presentation className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
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

  return (
    <div>
      <SectionHeader
        title="Resource Upload Center"
        subtitle="Upload and manage PDFs, videos, slides, and other learning materials"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Resources</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <Upload className="w-10 h-10 text-blue-600 dark:text-blue-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-300 font-medium">PDFs</p>
              <p className="text-2xl font-bold text-red-900 dark:text-white mt-1">{stats.pdfs}</p>
            </div>
            <FileText className="w-10 h-10 text-red-600 dark:text-red-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Videos</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">{stats.videos}</p>
            </div>
            <Video className="w-10 h-10 text-purple-600 dark:text-purple-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Slides</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-white mt-1">{stats.slides}</p>
            </div>
            <Presentation className="w-10 h-10 text-orange-600 dark:text-orange-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="pdf">PDFs</option>
              <option value="video">Videos</option>
              <option value="slide">Slides</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
            </select>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Upload Resource
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <Loading />
      ) : resources.length === 0 ? (
        <div className="card text-center py-12">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Resources Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedType ? 'Try adjusting your filters' : 'Start by uploading your first resource'}
          </p>
          {!searchTerm && !selectedType && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Upload First Resource
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource._id} className="card hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              {resource.thumbnailUrl ? (
                <img
                  src={resource.thumbnailUrl}
                  alt={resource.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className={`w-full h-48 rounded-lg mb-4 flex items-center justify-center ${getTypeColor(resource.type)}`}>
                  <div className="text-6xl">
                    {getTypeIcon(resource.type)}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex items-start gap-2 mb-2">
                <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {resource.title}
                  </h3>
                  {resource.isExternal && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1">
                      <ExternalLink className="w-3 h-3" />
                      {resource.externalSource}
                    </span>
                  )}
                </div>
              </div>

              {resource.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {resource.description}
                </p>
              )}

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {resource.views || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {resource.downloads || 0}
                </div>
                {resource.formattedSize && (
                  <span className="text-xs">{resource.formattedSize}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedResource(resource)}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  View
                </button>
                <button
                  onClick={() => setEditingResource(resource)}
                  className="btn-secondary text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(resource._id)}
                  className="btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <UploadResourceModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchResources();
          }}
        />
      )}

      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onEdit={(resource) => {
            setSelectedResource(null);
            setEditingResource(resource);
          }}
          onDelete={(resourceId) => {
            setSelectedResource(null);
            handleDelete(resourceId);
          }}
          onUpdate={fetchResources}
        />
      )}

      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSuccess={() => {
            setEditingResource(null);
            fetchResources();
          }}
        />
      )}
    </div>
  );
};

export default ResourceCenter;
