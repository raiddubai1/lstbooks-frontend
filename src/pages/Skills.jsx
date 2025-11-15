import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Stethoscope, Image, Video } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import AddSkillModal from '../components/AddSkillModal';
import { getSkills, getSubjects, createSkill } from '../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
    fetchSubjects();
  }, []);

  useEffect(() => {
    let filtered = skills;

    if (searchQuery) {
      filtered = filtered.filter(skill =>
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(skill => skill.subjectId?._id === selectedSubject);
    }

    setFilteredSkills(filtered);
  }, [searchQuery, selectedSubject, skills]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await getSkills();
      setSkills(response.data);
      setFilteredSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
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

  const handleCreateSkill = async (skillData) => {
    try {
      setSubmitting(true);
      const response = await createSkill(skillData);
      setSkills([response.data, ...skills]);
      setIsModalOpen(false);
      alert('Clinical skill created successfully!');
    } catch (error) {
      console.error('Error creating skill:', error);
      alert('Failed to create skill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Clinical Skills"
        subtitle="Master essential dental clinical techniques"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Skill
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search skills by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery || selectedSubject ? 'No skills found' : 'No clinical skills yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedSubject
              ? 'Try adjusting your filters'
              : 'Create your first clinical skill to get started'}
          </p>
          {!searchQuery && !selectedSubject && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add First Skill
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <Link
              key={skill._id}
              to={`/skills/${skill._id}`}
              className="card hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{skill.title}</h3>
                  {skill.subjectId && (
                    <span className="inline-block text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                      {skill.subjectId.name}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  <span>{skill.media?.filter(m => m.type === 'image').length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>{skill.media?.filter(m => m.type === 'video').length || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSkill}
        submitting={submitting}
      />
    </div>
  );
};

export default Skills;

