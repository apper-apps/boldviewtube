import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { videoService, channelService, watchHistoryService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
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

const History = () => {
  const navigate = useNavigate();
  
  const [historyItems, setHistoryItems] = useState([]);
  const [videos, setVideos] = useState({});
  const [channels, setChannels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [historyData, channelsData] = await Promise.all([
        watchHistoryService.getAll(),
        channelService.getAll()
      ]);
      
      setHistoryItems(historyData);
      
      // Create channels lookup
      const channelsLookup = {};
      channelsData.forEach(channel => {
        channelsLookup[channel.id] = channel;
      });
      setChannels(channelsLookup);
      
      // Fetch video details for each history item
      const videosLookup = {};
      for (const historyItem of historyData) {
        try {
          const video = await videoService.getById(historyItem.videoId);
          videosLookup[historyItem.videoId] = video;
        } catch (err) {
          // Video might be deleted, skip it
          console.warn(`Video ${historyItem.videoId} not found`);
        }
      }
      setVideos(videosLookup);
      
    } catch (err) {
      setError(err.message || 'Failed to load history');
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  const handleChannelClick = (channelId, e) => {
    e.stopPropagation();
    navigate(`/channel/${channelId}`);
  };

  const handleDeleteItem = async (videoId, e) => {
    e.stopPropagation();
    
    try {
      await watchHistoryService.delete(videoId);
      setHistoryItems(prev => prev.filter(item => item.videoId !== videoId));
      toast.success('Removed from history');
    } catch (err) {
      toast.error('Failed to remove from history');
    }
  };

  const handleClearAll = async () => {
    try {
      await watchHistoryService.clear();
      setHistoryItems([]);
      setVideos({});
      setShowClearConfirm(false);
      toast.success('History cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-surface rounded w-32" />
          <div className="h-10 bg-surface rounded w-24" />
        </div>
        <SkeletonLoader count={6} type="list" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  const validHistoryItems = historyItems.filter(item => videos[item.videoId]);

  if (validHistoryItems.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-white">Watch History</h1>
        </div>
        <EmptyState
          title="No watch history"
          description="Videos you watch will appear here"
          icon="History"
          actionLabel="Explore Videos"
          onAction={() => navigate('/home')}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <h1 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
          <ApperIcon name="History" size={28} className="text-accent" />
          <span>Watch History</span>
        </h1>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowClearConfirm(true)}
          className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/80 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Trash2" size={16} />
          <span>Clear All</span>
        </motion.button>
      </motion.div>

      {/* History List */}
      <div className="space-y-4">
        {validHistoryItems.map((historyItem, index) => {
          const video = videos[historyItem.videoId];
          const channel = channels[video?.channelId];
          
          if (!video) return null;
          
          return (
            <motion.div
              key={historyItem.videoId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleVideoClick(video.id)}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-surface rounded-lg cursor-pointer geometric-hover group"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-48 aspect-video flex-shrink-0 overflow-hidden rounded">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Duration */}
                <div className="absolute bottom-2 right-2 duration-badge px-2 py-1 rounded text-xs font-medium text-white">
                  {formatDuration(video.duration)}
                </div>
                
                {/* Progress Bar */}
                {historyItem.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                    <div 
                      className="h-full progress-bar"
                      style={{ width: `${Math.min(historyItem.progress, 100)}%` }}
                    />
                  </div>
                )}
              </div>
              
              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-bold text-white line-clamp-2 mb-2 break-words group-hover:text-accent transition-colors">
                      {video.title}
                    </h3>
                    
                    {channel && (
                      <motion.p
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => handleChannelClick(channel.id, e)}
                        className="text-gray-300 hover:text-accent cursor-pointer text-sm font-medium mb-2 transition-colors inline-block"
                      >
                        {channel.name}
                      </motion.p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
                      <span>{formatViews(video.views)}</span>
                      <span>•</span>
                      <span>Watched {formatDistanceToNow(new Date(historyItem.watchedAt), { addSuffix: true })}</span>
                      {historyItem.progress > 0 && (
                        <>
                          <span>•</span>
                          <span>{Math.round(historyItem.progress)}% watched</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-400 line-clamp-2 break-words">
                      {video.description}
                    </p>
                  </div>
                  
                  {/* Delete Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleDeleteItem(video.id, e)}
                    className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Remove from history"
                  >
                    <ApperIcon name="X" size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowClearConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ApperIcon name="AlertTriangle" size={24} className="text-warning" />
                  <h3 className="text-lg font-display font-bold text-white">Clear Watch History</h3>
                </div>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to clear your entire watch history? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearAll}
                    className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/80 transition-colors"
                  >
                    Clear All
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;