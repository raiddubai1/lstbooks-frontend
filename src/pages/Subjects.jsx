import { useState, useEffect } from 'react';
import { getSubjects, createSubject } from '../services/api';
import SubjectCard from '../components/SubjectCard';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import AddSubjectModal from '../components/AddSubjectModal';
import { Plus } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjects);
    }
  }, [searchQuery, subjects]);

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data);
      setFilteredSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (formData) => {
    setSubmitting(true);
    try {
      const response = await createSubject(formData);
      setSubjects([response.data, ...subjects]);
      setIsModalOpen(false);
      alert('Subject created successfully!');
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('Failed to create subject. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader
          title="Subjects"
          subtitle="Browse all available dental subjects and courses"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search subjects by name or description..."
        />
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No subjects found matching your search' : 'No subjects available'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Subject
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
        </div>
      )}

      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubject}
      />
    </div>
  );
};

export default Subjects;

