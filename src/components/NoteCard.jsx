import { Pin, Edit, Trash2, Tag, BookOpen } from 'lucide-react';

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
  gray: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
};

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const colorClass = colorClasses[note.color] || colorClasses.blue;

  return (
    <div className={`${colorClass} border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 pr-2">
          {note.title}
        </h3>
        <button
          onClick={() => onTogglePin(note._id)}
          className={`${
            note.isPinned
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-4">
        {note.content}
      </p>

      {/* Subject */}
      {note.subject && (
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <BookOpen className="w-3 h-3" />
          <span>{note.subject.name}</span>
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

