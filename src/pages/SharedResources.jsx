import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Plus, Search, Download, Eye, ThumbsUp, Star, Link as LinkIcon, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SharedResourceModal from '../components/SharedResourceModal';

const SharedResources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [myResources, setMyResources] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my-resources', 'featured'

  useEffect(() => {
    fetchResources();
    fetchMyResources();
    fetchFeaturedResources();
    fetchSubjects();
    fetchYears();
  }, [selectedSubject, selectedYear, selectedResourceType, selectedCategory, searchQuery, sortBy]);

  const fetchResources = async () => {
    try {
      const params = { sortBy };
      if (selectedSubject) params.subject = selectedSubject;
      if (selectedYear) params.year = selectedYear;
      if (selectedResourceType) params.resourceType = selectedResourceType;
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/shared-resources`, { params });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching shared resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyResources = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/shared-resources/my-resources`);
      setMyResources(response.data);
    } catch (error) {
      console.error('Error fetching my resources:', error);
    }
  };

  const fetchFeaturedResources = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/shared-resources/featured`);
      setFeaturedResources(response.data);
    } catch (error) {
      console.error('Error fetching featured resources:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/years`);
      setYears(response.data);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const handleCreateResource = () => {
    setIsModalOpen(true);
  };

  const handleSaveResource = async (resourceData) => {
    try {
      // Check if resourceData is FormData (file upload) or regular object
      const config = resourceData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};

      await axios.post(`${import.meta.env.VITE_API_URL}/shared-resources`, resourceData, config);
      setIsModalOpen(false);
      fetchResources();
      fetchMyResources();
    } catch (error) {
      console.error('Error creating shared resource:', error);
      alert('Error creating resource: ' + (error.response?.data?.error || error.message));
    }
  };

  const displayResources = activeTab === 'my-resources' ? myResources : activeTab === 'featured' ? featuredResources : resources;

  const resourceTypes = [
    { value: 'file', label: 'File' },
    { value: 'link', label: 'Link' },
    { value: 'note', label: 'Note' },
    { value: 'video', label: 'Video' },
    { value: 'document', label: 'Document' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'other', label: 'Other' }
  ];

  const categories = [
    { value: 'lecture-notes', label: 'Lecture Notes' },
    { value: 'study-guide', label: 'Study Guide' },
    { value: 'practice-questions', label: 'Practice Questions' },
    { value: 'summary', label: 'Summary' },
    { value: 'reference', label: 'Reference' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'other', label: 'Other' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Shared Resources</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Share and discover study materials, notes, and resources
            </p>
          </div>
          <button
            onClick={handleCreateResource}
            className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Share Resource</span>
            <span className="sm:hidden">Share</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="hidden sm:inline">All Resources ({resources.length})</span>
            <span className="sm:hidden">All ({resources.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap ${
              activeTab === 'featured'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="hidden sm:inline">Featured ({featuredResources.length})</span>
            <span className="sm:hidden">Featured ({featuredResources.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('my-resources')}
            className={`px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap ${
              activeTab === 'my-resources'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="hidden sm:inline">My Resources ({myResources.length})</span>
            <span className="sm:hidden">Mine ({myResources.length})</span>
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year._id} value={year._id}>
                    {year.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedResourceType}
                onChange={(e) => setSelectedResourceType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Resources List */}
        {displayResources.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'my-resources' 
                ? 'You haven\'t shared any resources yet.' 
                : activeTab === 'featured'
                ? 'No featured resources available.'
                : 'No resources found.'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {activeTab === 'my-resources' 
                ? 'Share your study materials to help others!' 
                : 'Try adjusting your filters or search query.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                onClick={() => navigate(`/shared-resources/${resource._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shared Resource Modal */}
      {isModalOpen && (
        <SharedResourceModal
          subjects={subjects}
          years={years}
          onSave={handleSaveResource}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const ResourceCard = ({ resource, onClick }) => {
  const resourceTypeIcons = {
    file: File,
    link: LinkIcon,
    note: FileText,
    video: FileText,
    document: FileText,
    presentation: FileText,
    other: FileText
  };

  const resourceTypeColors = {
    file: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    link: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    note: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    video: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    document: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    presentation: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400',
    other: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
  };

  const Icon = resourceTypeIcons[resource.resourceType] || FileText;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {resource.title}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
            {resource.description}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${resourceTypeColors[resource.resourceType]}`}>
          {resource.resourceType}
        </span>
        {resource.category && (
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded text-xs">
            {resource.category.replace('-', ' ')}
          </span>
        )}
        {resource.subject && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs">
            {resource.subject.name}
          </span>
        )}
        {resource.isFeatured && (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded text-xs flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Download className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {resource.downloads || 0}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Downloads</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {resource.views || 0}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Views</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ThumbsUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {resource.likeCount || 0}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Likes</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {resource.averageRating || 'N/A'}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
        </div>
      </div>
    </div>
  );
};

export default SharedResources;

