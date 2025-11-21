import { X, Edit, Trash2, Clock, CheckCircle, AlertTriangle, Award, BookOpen, Star } from 'lucide-react';

const ProtocolDetailModal = ({ protocol, onClose, onEdit, onDelete }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {protocol.title}
              </h2>
              {protocol.verified && (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              )}
              {protocol.featured && (
                <Star className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">{protocol.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Category</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{protocol.category}</p>
            </div>
            {protocol.subcategory && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Subcategory</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{protocol.subcategory}</p>
              </div>
            )}
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
          </div>

          {/* Evidence Level */}
          {protocol.evidenceLevel && (
            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-900 dark:text-white">
                Evidence Level: <span className="font-medium">{protocol.evidenceLevel}</span>
              </span>
            </div>
          )}

          {/* Indications */}
          {protocol.indications && protocol.indications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Indications</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {protocol.indications.map((indication, index) => (
                  <li key={index}>{indication}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contraindications */}
          {protocol.contraindications && protocol.contraindications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contraindications</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {protocol.contraindications.map((contraindication, index) => (
                  <li key={index}>{contraindication}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {protocol.prerequisites && protocol.prerequisites.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {protocol.prerequisites.map((prerequisite, index) => (
                  <li key={index}>{prerequisite}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Steps */}
          {protocol.steps && protocol.steps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procedure Steps</h3>
              </div>
              <div className="space-y-4">
                {protocol.steps.map((step, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-blue-600">Step {step.stepNumber}</span>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                      {step.duration && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">({step.duration})</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Materials */}
          {protocol.requiredMaterials && protocol.requiredMaterials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Required Materials</h3>
              <div className="flex flex-wrap gap-2">
                {protocol.requiredMaterials.map((material, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Required Instruments */}
          {protocol.requiredInstruments && protocol.requiredInstruments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Required Instruments</h3>
              <div className="flex flex-wrap gap-2">
                {protocol.requiredInstruments.map((instrument, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    {instrument}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Complications */}
          {protocol.complications && protocol.complications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Possible Complications</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {protocol.complications.map((complication, index) => (
                  <li key={index}>{complication}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Post-Treatment Care */}
          {protocol.postTreatmentCare && protocol.postTreatmentCare.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Post-Treatment Care</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {protocol.postTreatmentCare.map((care, index) => (
                  <li key={index}>{care}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up */}
          {protocol.followUp && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Follow-up</h3>
              <p className="text-gray-700 dark:text-gray-300">{protocol.followUp}</p>
            </div>
          )}

          {/* Tags */}
          {protocol.tags && protocol.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {protocol.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onEdit(protocol)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={() => onDelete(protocol._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
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

export default ProtocolDetailModal;

