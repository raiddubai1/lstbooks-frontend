import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLabs, getSubjects, createLab } from '../services/api';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';
import AddLabModal from '../components/AddLabModal';
import Loading from '../components/Loading';
import { FlaskConical, Target, Plus } from 'lucide-react';

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLabs();
    fetchSubjects();
  }, []);

  useEffect(() => {
    let filtered = labs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(lab =>
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(lab => lab.subjectId?._id === selectedSubject);
    }

    setFilteredLabs(filtered);
  }, [searchQuery, selectedSubject, labs]);

  const fetchLabs = async () => {
    try {
      const response = await getLabs();
      setLabs(response.data);
      setFilteredLabs(response.data);
    } catch (error) {
      console.error('Error fetching labs:', error);
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

  const handleCreateLab = async (formData) => {
    setSubmitting(true);
    try {
      const response = await createLab(formData);
      setLabs([response.data, ...labs]);
      setIsModalOpen(false);
      alert('Lab created successfully!');
    } catch (error) {
      console.error('Error creating lab:', error);
      alert('Failed to create lab. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader
          title="Lab Manuals"
          subtitle="Step-by-step guides for laboratory procedures"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Lab
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search labs by title..."
          />
        </div>
        <div className="md:w-64">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredLabs.length === 0 ? (
        <div className="text-center py-12">
          <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedSubject ? 'No labs found matching your filters' : 'No lab manuals found'}
          </p>
          {!searchQuery && !selectedSubject && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first lab
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <Link
              key={lab._id}
              to={`/labs/${lab._id}`}
              className="card hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg line-clamp-2">{lab.title}</h3>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {lab.description}
              </p>

              {lab.subjectId && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-3">
                  {lab.subjectId.name}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Target className="w-4 h-4" />
                <span>{lab.steps?.length || 0} steps</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Lab Modal */}
      <AddLabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLab}
        submitting={submitting}
      />
    </div>
  );
};

export default Labs;

