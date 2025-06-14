import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { videoService, channelService, watchHistoryService } from '@/services';
import VideoPlayer from '@/components/organisms/VideoPlayer';
import VideoCard from '@/components/molecules/VideoCard';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import ApperIcon from '@/components/ApperIcon';

const formatViews = (views) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
};

const formatSubscribers = (subscribers) => {
  if (subscribers >= 1000000) {
    return `${(subscribers / 1000000).toFixed(1)}M subscribers`;
  } else if (subscribers >= 1000) {
    return `${(subscribers / 1000).toFixed(1)}K subscribers`;
  }
  return `${subscribers} subscribers`;
};

const Watch = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [watchHistory, setWatchHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [videoData, channelsData, relatedData] = await Promise.all([
        videoService.getById(videoId),
        channelService.getAll(),
        videoService.getRelated(videoId)
      ]);
      
      setVideo(videoData);
      setChannels(channelsData);
      setRelatedVideos(relatedData);
      
      const videoChannel = channelsData.find(c => c.id === videoData.channelId);
      setChannel(videoChannel);
      
      // Get watch history for this video
      const history = await watchHistoryService.getByVideoId(videoId);
      setWatchHistory(history);
      
      // Increment view count
      await videoService.incrementViews(videoId);
      setVideo(prev => ({ ...prev, views: prev.views + 1 }));
      
    } catch (err) {
      setError(err.message || 'Failed to load video');
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = async (currentTime) => {
    if (!video) return;
    
    const progress = (currentTime / video.duration) * 100;
    
    try {
      // Add to watch history
      await watchHistoryService.add(videoId, progress);
      
      // Update progress if already in history
      if (watchHistory) {
        await watchHistoryService.updateProgress(videoId, progress);
      }
    } catch (err) {
      console.error('Failed to update watch history:', err);
    }
  };

  const handleChannelClick = () => {
    if (channel) {
      navigate(`/channel/${channel.id}`);
    }
  };

  useEffect(() => {
    if (videoId) {
      loadData();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="aspect-video bg-surface rounded-lg mb-6" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="h-8 bg-surface rounded w-3/4 mb-4" />
            <div className="h-4 bg-surface rounded w-1/2 mb-6" />
            <SkeletonLoader count={1} type="list" />
          </div>
          <div className="w-full lg:w-96">
            <SkeletonLoader count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!video) {
    return <ErrorState message="Video not found" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-full overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <VideoPlayer
            video={video}
            onTimeUpdate={handleTimeUpdate}
            initialTime={watchHistory ? (watchHistory.progress / 100) * video.duration : 0}
          />
        </motion.div>

        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-white mb-4 break-words">
            {video.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="text-gray-400 text-sm">
              {formatViews(video.views)} • {formatDistanceToNow(new Date(video.uploadDate), { addSuffix: true })}
            </div>
          </div>

          {/* Channel Info */}
          {channel && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={handleChannelClick}
              className="flex items-center space-x-4 p-4 bg-surface rounded-lg cursor-pointer hover:bg-surface/80 transition-colors mb-4"
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white">{channel.name}</h3>
                <p className="text-sm text-gray-400">{formatSubscribers(channel.subscribers)}</p>
              </div>
              <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
            </motion.div>
          )}

          {/* Description */}
          <div className="bg-surface rounded-lg p-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-white">Description</span>
              <motion.div
                animate={{ rotate: showDescription ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
              </motion.div>
            </motion.button>
            
            <motion.div
              initial={false}
              animate={{ height: showDescription ? 'auto' : 0, opacity: showDescription ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-gray-300 mt-4 whitespace-pre-wrap break-words">
                {video.description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Sidebar - Related Videos */}
      <div className="w-full lg:w-96 lg:flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-display font-bold text-white mb-4">Related Videos</h2>
          
          {relatedVideos.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Video" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No related videos found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo, index) => (
                <motion.div
                  key={relatedVideo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <VideoCard
                    video={relatedVideo}
                    channel={channels.find(c => c.id === relatedVideo.channelId)}
                    showChannel={true}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Watch;