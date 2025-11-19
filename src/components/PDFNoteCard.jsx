import { FileText, Download, Calendar, File } from 'lucide-react';

const PDFNoteCard = ({ pdf }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(2)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header with PDF Icon */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 flex items-center justify-center">
        <FileText className="w-16 h-16 text-white" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {pdf.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {pdf.description}
        </p>

        {/* File Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <File className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Size</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatFileSize(pdf.fileSize)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Pages</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {pdf.pages || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(pdf.uploadedAt)}</span>
          </div>
          
          <a
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PDFNoteCard;

