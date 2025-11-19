import { useState } from 'react';
import { X, Save, Star } from 'lucide-react';

const FeedbackModal = ({ allowAnonymous, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    strengths: '',
    improvements: '',
    additionalComments: '',
    isAnonymous: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Submit Feedback
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      rating <= formData.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Strengths *
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              What did the author do well? Be specific and constructive.
            </p>
            <textarea
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows="4"
              placeholder="e.g., Clear structure, well-researched arguments, excellent use of examples..."
              required
            />
          </div>

          {/* Areas for Improvement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Areas for Improvement *
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              What could be improved? Provide actionable suggestions.
            </p>
            <textarea
              value={formData.improvements}
              onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows="4"
              placeholder="e.g., Consider adding more recent sources, clarify the methodology section..."
              required
            />
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={formData.additionalComments}
              onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="Any other thoughts or suggestions..."
            />
          </div>

          {/* Anonymous Option */}
          {allowAnonymous && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Submit Anonymously
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your name will be hidden from the author
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Guidelines */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Feedback Guidelines
            </h4>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-400">
              <li>• Be respectful and constructive</li>
              <li>• Provide specific examples and suggestions</li>
              <li>• Balance positive feedback with areas for improvement</li>
              <li>• Focus on the work, not the person</li>
              <li>• Use clear and actionable language</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;

