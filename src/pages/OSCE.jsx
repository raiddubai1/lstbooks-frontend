import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOSCEStations, getSubjects } from '../services/api';
import AddOSCEStationModal from '../components/AddOSCEStationModal';
import { ClipboardList, Plus, Search, Stethoscope, ListChecks } from 'lucide-react';

const OSCE = () => {
  const [stations, setStations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
    fetchSubjects();
  }, []);

  useEffect(() => {
    let filtered = stations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(station =>
        station.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(station => station.subjectId?._id === selectedSubject);
    }

    setFilteredStations(filtered);
  }, [searchQuery, selectedSubject, stations]);

  const fetchStations = async () => {
    try {
      const response = await getOSCEStations();
      setStations(response.data);
      setFilteredStations(response.data);
    } catch (error) {
      console.error('Error fetching OSCE stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleStationAdded = (newStation) => {
    setStations([newStation, ...stations]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading OSCE stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">OSCE Stations</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Practice clinical scenarios and examinations</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-sm md:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add OSCE Station</span>
            <span className="sm:hidden">Add Station</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search OSCE stations by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stations Grid */}
      {filteredStations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No OSCE stations found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedSubject
              ? 'Try adjusting your filters'
              : 'Get started by adding your first OSCE station'}
          </p>
          {!searchQuery && !selectedSubject && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First OSCE Station
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <Link
              key={station._id}
              to={`/osce/${station._id}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {station.title}
                  </h3>
                  {station.subjectId && (
                    <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {station.subjectId.name}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {station.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Stethoscope className="w-4 h-4" />
                  <span>{station.skills?.length || 0} skills</span>
                </div>
                <div className="flex items-center gap-1">
                  <ListChecks className="w-4 h-4" />
                  <span>{station.steps?.length || 0} steps</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add OSCE Station Modal */}
      <AddOSCEStationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStationAdded={handleStationAdded}
      />
    </div>
  );
};

export default OSCE;

