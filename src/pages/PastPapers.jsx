import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import AddPaperModal from '../components/AddPaperModal';
import { FileText, Search, Filter, Plus, Download, ExternalLink, Calendar, Clock, Award, CheckCircle, Tag, BookOpen } from 'lucide-react';

const PastPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const subjects = ['All', 'Dental Anatomy', 'Oral Pathology', 'Periodontology', 'Endodontics', 'Prosthodontics', 'Oral Surgery', 'Orthodontics', 'Pediatric Dentistry', 'Radiology', 'Pharmacology'];
  const examTypes = ['All', 'Final Exam', 'Midterm', 'Quiz', 'Mock Exam', 'Practice Test', 'Other'];
  const academicYears = ['All', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

  useEffect(() => {
    fetchPapers();
  }, [selectedSubject, selectedYear, selectedExamType, selectedAcademicYear, searchTerm]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedSubject && selectedSubject !== 'All') params.subject = selectedSubject;
      if (selectedYear && selectedYear !== 'All') params.year = selectedYear;
      if (selectedExamType && selectedExamType !== 'All') params.examType = selectedExamType;
      if (selectedAcademicYear && selectedAcademicYear !== 'All') params.academicYear = selectedAcademicYear;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/past-papers', { params });
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching past papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (paperId) => {
    try {
      await api.post(`/past-papers/${paperId}/download`);
      fetchPapers(); // Refresh to update download count
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Past Papers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Access previous exam papers and practice tests
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Upload Paper
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, subject, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject === 'All' ? '' : subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {years.map((year) => (
                <option key={year} value={year === 'All' ? '' : year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exam Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {examTypes.map((type) => (
                <option key={type} value={type === 'All' ? '' : type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Academic Year
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {academicYears.map((year) => (
                <option key={year} value={year === 'All' ? '' : year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Papers</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{papers.length}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-300 font-medium">Verified</p>
              <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">
                {papers.filter(p => p.verified).length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Subjects</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">
                {new Set(papers.map(p => p.subject)).size}
              </p>
            </div>
            <BookOpen className="w-10 h-10 text-purple-600 dark:text-purple-300 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Total Downloads</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-white mt-1">
                {papers.reduce((sum, p) => sum + (p.downloads || 0), 0).toLocaleString()}
              </p>
            </div>
            <Download className="w-10 h-10 text-orange-600 dark:text-orange-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Papers List */}
      {papers.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No past papers found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <PaperCard key={paper._id} paper={paper} onDownload={handleDownload} onUpdate={fetchPapers} />
          ))}
        </div>
      )}

      {/* Add Paper Modal */}
      {showAddModal && (
        <AddPaperModal onClose={() => setShowAddModal(false)} onSuccess={fetchPapers} />
      )}
    </div>
  );
};

// Paper Card Component
const PaperCard = ({ paper, onDownload, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <>
      <div className="card hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Left: Paper Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {paper.title}
                  {paper.verified && (
                    <CheckCircle className="w-5 h-5 text-green-600" title="Verified" />
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {paper.subject} • {paper.year} • {paper.semester}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(paper.difficulty)}`}>
                {paper.difficulty}
              </span>
            </div>

            {paper.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {paper.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{paper.examType}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{paper.academicYear}</span>
              </div>
              {paper.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{paper.duration} min</span>
                </div>
              )}
              {paper.totalMarks && (
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{paper.totalMarks} marks</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{paper.downloads || 0} downloads</span>
              </div>
            </div>

            {paper.topics && paper.topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {paper.topics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
                {paper.topics.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{paper.topics.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex md:flex-col gap-2">
            <a
              href={paper.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onDownload(paper._id)}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
            {paper.solutionUrl && (
              <a
                href={paper.solutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Solutions
              </a>
            )}
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 md:flex-none px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <PaperDetailsModal paper={paper} onClose={() => setShowDetails(false)} onUpdate={onUpdate} />
      )}
    </>
  );
};

// Paper Details Modal
const PaperDetailsModal = ({ paper, onClose, onUpdate }) => {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this past paper?')) return;

    try {
      await api.delete(`/past-papers/${paper._id}`);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting paper:', error);
      alert('Failed to delete paper');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paper Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {paper.title}
              {paper.verified && (
                <CheckCircle className="w-6 h-6 text-green-600" title="Verified" />
              )}
            </h3>
          </div>

          {paper.description && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Subject</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.subject}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Year</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.year}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Semester</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.semester}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Exam Type</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.examType}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Academic Year</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.academicYear}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Difficulty</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.difficulty}</p>
            </div>

            {paper.duration && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Duration</h4>
                <p className="text-gray-600 dark:text-gray-400">{paper.duration} minutes</p>
              </div>
            )}

            {paper.totalMarks && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Total Marks</h4>
                <p className="text-gray-600 dark:text-gray-400">{paper.totalMarks}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Downloads</h4>
              <p className="text-gray-600 dark:text-gray-400">{paper.downloads || 0}</p>
            </div>
          </div>

          {paper.topics && paper.topics.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {paper.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {paper.tags && paper.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag, index) => (
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
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Paper
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

export default PastPapers;

