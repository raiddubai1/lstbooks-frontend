import { ChevronRight } from 'lucide-react';

const ModuleCard = ({ module, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:border-primary-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              Chapter {module.order}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{module.description}</p>
          {module.topics && module.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {module.topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {topic}
                </span>
              ))}
              {module.topics.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{module.topics.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default ModuleCard;

