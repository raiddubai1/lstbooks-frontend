import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Search, Lock, Calendar, MapPin, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudyGroupModal from '../components/StudyGroupModal';

const StudyGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my-groups'

  useEffect(() => {
    fetchGroups();
    fetchMyGroups();
    fetchSubjects();
    fetchYears();
  }, [selectedSubject, selectedYear, searchQuery]);

  const fetchGroups = async () => {
    try {
      const params = {};
      if (selectedSubject) params.subject = selectedSubject;
      if (selectedYear) params.year = selectedYear;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/study-groups`, { params });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching study groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/study-groups/my-groups`);
      setMyGroups(response.data);
    } catch (error) {
      console.error('Error fetching my groups:', error);
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

  const handleCreateGroup = () => {
    setIsModalOpen(true);
  };

  const handleSaveGroup = async (groupData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/study-groups`, groupData);
      setIsModalOpen(false);
      fetchGroups();
      fetchMyGroups();
    } catch (error) {
      console.error('Error creating study group:', error);
    }
  };

  const displayGroups = activeTab === 'my-groups' ? myGroups : groups;

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Groups</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join or create study groups to collaborate with peers
            </p>
          </div>
          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Groups ({groups.length})
          </button>
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'my-groups'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            My Groups ({myGroups.length})
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

              <button
                onClick={() => {
                  setSelectedSubject('');
                  setSelectedYear('');
                  setSearchQuery('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search study groups..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Study Groups List */}
        {displayGroups.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'my-groups' ? 'You haven\'t joined any groups yet.' : 'No study groups found.'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {activeTab === 'my-groups' ? 'Join a group or create your own!' : 'Create a study group to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGroups.map((group) => (
              <StudyGroupCard
                key={group._id}
                group={group}
                onClick={() => navigate(`/study-groups/${group._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Study Group Modal */}
      {isModalOpen && (
        <StudyGroupModal
          subjects={subjects}
          years={years}
          onSave={handleSaveGroup}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const StudyGroupCard = ({ group, onClick }) => {
  const upcomingSessions = group.sessions?.filter(s => new Date(s.scheduledAt) > new Date()) || [];
  const nextSession = upcomingSessions.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {group.name}
            </h3>
            {group.isPrivate && (
              <Lock className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
            {group.description}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-2 mb-4">
        {group.subject && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
              {group.subject.name}
            </span>
          </div>
        )}
        {group.year && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded">
              {group.year.name}
            </span>
          </div>
        )}
      </div>

      {/* Next Session */}
      {nextSession && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="font-semibold">Next Session</span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400">
            {nextSession.title}
          </p>
          <div className="flex items-center gap-3 text-xs text-green-600 dark:text-green-500 mt-1">
            <span>{new Date(nextSession.scheduledAt).toLocaleString()}</span>
            {nextSession.isOnline && (
              <div className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                Online
              </div>
            )}
            {nextSession.location && !nextSession.isOnline && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {nextSession.location}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4" />
          {group.members?.length || 0} / {group.maxMembers} members
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Created {new Date(group.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default StudyGroups;

