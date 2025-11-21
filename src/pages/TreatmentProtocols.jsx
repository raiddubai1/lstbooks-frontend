import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import Loading from '../components/Loading';
import AddProtocolModal from '../components/AddProtocolModal';
import EditProtocolModal from '../components/EditProtocolModal';
import ProtocolDetailModal from '../components/ProtocolDetailModal';
import {
  FileText,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Award,
  ChevronRight,
  Star,
  Plus
} from 'lucide-react';

const TreatmentProtocols = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [protocols, setProtocols] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showVerified, setShowVerified] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [editingProtocol, setEditingProtocol] = useState(null);

  const categories = [
    'All',
    'Operative Dentistry',
    'Endodontics',
    'Periodontics',
    'Prosthodontics',
    'Oral Surgery',
    'Orthodontics',
    'Pediatric Dentistry',
    'Preventive Dentistry',
    'Emergency Procedures',
    'Diagnosis',
    'Radiology',
    'Anesthesia',
    'Other'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchProtocols();
  }, [selectedCategory, selectedDifficulty, showVerified, searchTerm]);

  const fetchProtocols = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (showVerified) params.verified = 'true';
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/treatment-protocols', { params });
      setProtocols(response.data.protocols || []);
    } catch (error) {
      console.error('Error fetching treatment protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Intermediate':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    // Return appropriate icon based on category
    return FileText;
  };

  const handleProtocolClick = (protocol) => {
    setSelectedProtocol(protocol);
  };

  const handleEdit = (protocol, e) => {
    e.stopPropagation();
    setEditingProtocol(protocol);
  };

  const handleDelete = async (protocolId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this protocol?')) return;

    try {
      await api.delete(`/treatment-protocols/${protocolId}`);
      fetchProtocols();
    } catch (error) {
      console.error('Error deleting protocol:', error);
      alert('Failed to delete protocol');
    }
  };

  return (
    <div>
      <SectionHeader
        title="Treatment Protocols"
        subtitle="Evidence-based clinical procedures with step-by-step guidelines"
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Protocol
          </button>
        }
      />

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search protocols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input w-full"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Levels' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Verified Toggle */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="verified"
            checked={showVerified}
            onChange={(e) => setShowVerified(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="verified" className="text-sm text-gray-700 dark:text-gray-300">
            Show verified protocols only
          </label>
        </div>
      </div>

      {/* Protocols List */}
      {loading ? (
        <Loading />
      ) : protocols.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Protocols Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {protocols.map((protocol) => (
            <div
              key={protocol._id}
              className="card hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleProtocolClick(protocol)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {protocol.title}
                    </h3>
                    {protocol.verified && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {protocol.featured && (
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {protocol.description}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Category</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {protocol.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Difficulty</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${getDifficultyColor(protocol.difficulty)}`}>
                    {protocol.difficulty}
                  </span>
                </div>
                {protocol.estimatedTime && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                    <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                      <Clock className="w-4 h-4" />
                      <span>{protocol.estimatedTime}</span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Steps</p>
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <BookOpen className="w-4 h-4" />
                    <span>{protocol.steps?.length || 0} steps</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-2 mb-4">
                {protocol.indications && protocol.indications.length > 0 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Indications</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        {protocol.indications[0]}
                        {protocol.indications.length > 1 && ` +${protocol.indications.length - 1} more`}
                      </p>
                    </div>
                  </div>
                )}
                {protocol.contraindications && protocol.contraindications.length > 0 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Contraindications</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        {protocol.contraindications[0]}
                        {protocol.contraindications.length > 1 && ` +${protocol.contraindications.length - 1} more`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Evidence Level */}
              {protocol.evidenceLevel && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Evidence: <span className="font-medium text-gray-900 dark:text-white">{protocol.evidenceLevel}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Tags */}
              {protocol.tags && protocol.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {protocol.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {protocol.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                      +{protocol.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* View Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  View Protocol
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddProtocolModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchProtocols();
          }}
        />
      )}

      {selectedProtocol && (
        <ProtocolDetailModal
          protocol={selectedProtocol}
          onClose={() => setSelectedProtocol(null)}
          onEdit={(protocol) => {
            setSelectedProtocol(null);
            setEditingProtocol(protocol);
          }}
          onDelete={(protocolId) => {
            setSelectedProtocol(null);
            handleDelete(protocolId, { stopPropagation: () => {} });
          }}
          onUpdate={fetchProtocols}
        />
      )}

      {editingProtocol && (
        <EditProtocolModal
          protocol={editingProtocol}
          onClose={() => setEditingProtocol(null)}
          onSuccess={() => {
            setEditingProtocol(null);
            fetchProtocols();
          }}
        />
      )}
    </div>
  );
};

export default TreatmentProtocols;
