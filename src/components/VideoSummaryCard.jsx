import { Video, Clock, Calendar, ExternalLink } from 'lucide-react';

const VideoSummaryCard = ({ video }) => {
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVideoThumbnail = (url) => {
    // Extract YouTube video ID
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
    }
    
    // Extract Vimeo video ID
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      // Vimeo thumbnails require API call, so we'll use a placeholder
      return video.thumbnail || '/placeholder-video.jpg';
    }
    
    return video.thumbnail || '/placeholder-video.jpg';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <img
          src={getVideoThumbnail(video.url)}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/640x360/4B5563/FFFFFF?text=Video';
          }}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(video.duration)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {video.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {video.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(video.uploadedAt)}</span>
          </div>
          
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            <span>Watch</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoSummaryCard;

