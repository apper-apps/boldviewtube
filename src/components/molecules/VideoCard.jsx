import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatViews = (views) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
};

const VideoCard = ({ video, channel, showChannel = true, progress }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video.id}`);
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    if (channel) {
      navigate(`/channel/${channel.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-surface rounded-lg overflow-hidden cursor-pointer geometric-hover group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 duration-badge px-2 py-1 rounded text-xs font-medium text-white">
          {formatDuration(video.duration)}
        </div>
        
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
            <div 
              className="h-full progress-bar"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
          <motion.div
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            className="bg-primary/90 rounded-full p-3"
          >
            <ApperIcon name="Play" size={24} className="text-white ml-1" />
          </motion.div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex space-x-3">
          {/* Channel Avatar */}
          {showChannel && channel && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={handleChannelClick}
              className="flex-shrink-0 cursor-pointer"
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </motion.div>
          )}
          
          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-bold text-white line-clamp-2 mb-1 break-words">
              {video.title}
            </h3>
            
            {showChannel && channel && (
              <motion.p
                onClick={handleChannelClick}
                whileHover={{ scale: 1.02 }}
                className="text-gray-300 hover:text-accent cursor-pointer text-sm font-medium mb-1 transition-colors"
              >
                {channel.name}
              </motion.p>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{formatViews(video.views)}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.uploadDate), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;