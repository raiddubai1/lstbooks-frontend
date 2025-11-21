import { useState } from 'react';
import { X, FileText, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const AddProtocolModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Operative Dentistry',
    subcategory: '',
    difficulty: 'Intermediate',
    estimatedTime: '',
    indications: [],
    contraindications: [],
    prerequisites: [],
    steps: [],
    requiredMaterials: [],
    requiredInstruments: [],
    complications: [],
    postTreatmentCare: [],
    followUp: '',
    evidenceLevel: 'Expert Opinion',
    references: [],
    thumbnailUrl: '',
    videoUrl: '',
    diagramUrls: [],
    tags: [],
    verified: false,
    featured: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('basic');

  // Input states for arrays
  const [indicationInput, setIndicationInput] = useState('');
  const [contraindicationInput, setContraindicationInput] = useState('');
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [materialInput, setMaterialInput] = useState('');
  const [instrumentInput, setInstrumentInput] = useState('');
  const [complicationInput, setComplicationInput] = useState('');
  const [postCareInput, setPostCareInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const categories = [
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

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const evidenceLevels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Expert Opinion'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/treatment-protocols', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create protocol');
    } finally {
      setLoading(false);
    }
  };

  const addToArray = (field, value, setValue) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setValue('');
    }
  };

  const removeFromArray = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const ArrayInput = ({ label, field, value, setValue, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray(field, value, setValue))}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => addToArray(field, value, setValue)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {formData[field].map((item, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <span className="flex-1 text-sm text-gray-900 dark:text-white">{item}</span>
            <button
              type="button"
              onClick={() => removeFromArray(field, index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Add Treatment Protocol
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6">
          <div className="flex gap-4">
            {['basic', 'clinical', 'steps', 'references'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  currentTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Info Tab */}
          {currentTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Class II Composite Restoration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of the protocol"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Direct Restorations"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    required
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 45-60 minutes"
                  />
                </div>
              </div>

              <ArrayInput
                label="Tags"
                field="tags"
                value={tagInput}
                setValue={setTagInput}
                placeholder="Add a tag"
              />

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as featured
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as verified
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Clinical Info Tab */}
          {currentTab === 'clinical' && (
            <div className="space-y-4">
              <ArrayInput
                label="Indications"
                field="indications"
                value={indicationInput}
                setValue={setIndicationInput}
                placeholder="Add an indication"
              />

              <ArrayInput
                label="Contraindications"
                field="contraindications"
                value={contraindicationInput}
                setValue={setContraindicationInput}
                placeholder="Add a contraindication"
              />

              <ArrayInput
                label="Prerequisites"
                field="prerequisites"
                value={prerequisiteInput}
                setValue={setPrerequisiteInput}
                placeholder="Add a prerequisite"
              />

              <ArrayInput
                label="Required Materials"
                field="requiredMaterials"
                value={materialInput}
                setValue={setMaterialInput}
                placeholder="Add a material"
              />

              <ArrayInput
                label="Required Instruments"
                field="requiredInstruments"
                value={instrumentInput}
                setValue={setInstrumentInput}
                placeholder="Add an instrument"
              />

              <ArrayInput
                label="Complications"
                field="complications"
                value={complicationInput}
                setValue={setComplicationInput}
                placeholder="Add a complication"
              />

              <ArrayInput
                label="Post-Treatment Care"
                field="postTreatmentCare"
                value={postCareInput}
                setValue={setPostCareInput}
                placeholder="Add post-treatment care instruction"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Follow-up
                </label>
                <textarea
                  value={formData.followUp}
                  onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Follow-up instructions"
                />
              </div>
            </div>
          )}

          {/* Steps Tab - Simplified for now */}
          {currentTab === 'steps' && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>Steps can be added after creating the protocol</p>
            </div>
          )}

          {/* References Tab */}
          {currentTab === 'references' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Evidence Level
                </label>
                <select
                  value={formData.evidenceLevel}
                  onChange={(e) => setFormData({ ...formData, evidenceLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {evidenceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Protocol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProtocolModal;

