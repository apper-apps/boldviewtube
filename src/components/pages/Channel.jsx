import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { channelService, videoService } from '@/services';
import VideoGrid from '@/components/molecules/VideoGrid';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const formatSubscribers = (subscribers) => {
  if (subscribers >= 1000000) {
    return `${(subscribers / 1000000).toFixed(1)}M subscribers`;
  } else if (subscribers >= 1000) {
    return `${(subscribers / 1000).toFixed(1)}K subscribers`;
  }
  return `${subscribers} subscribers`;
};

const Channel = () => {
  const { channelId } = useParams();
  
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [channelData, videosData, channelsData] = await Promise.all([
        channelService.getById(channelId),
        videoService.getByChannel(channelId),
        channelService.getAll()
      ]);
      
      setChannel(channelData);
      setAllChannels(channelsData);
      
      // Sort videos
      let sortedVideos = [...videosData];
      switch (sortBy) {
        case 'views':
          sortedVideos.sort((a, b) => b.views - a.views);
          break;
        case 'duration':
          sortedVideos.sort((a, b) => b.duration - a.duration);
          break;
        case 'title':
          sortedVideos.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default: // date
          sortedVideos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
          break;
      }
      
      setVideos(sortedVideos);
    } catch (err) {
      setError(err.message || 'Failed to load channel');
      toast.error('Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId) {
      loadData();
    }
  }, [channelId, sortBy]);

  if (loading) {
    return (
      <div className="p-6">
        {/* Channel Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-surface rounded-full" />
            <div className="flex-1">
              <div className="h-8 bg-surface rounded w-48 mb-2" />
              <div className="h-4 bg-surface rounded w-32 mb-4" />
              <div className="h-10 bg-surface rounded w-24" />
            </div>
          </div>
        </div>
        <SkeletonLoader count={8} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!channel) {
    return <ErrorState message="Channel not found" />;
  }

  const sortOptions = [
    { value: 'date', label: 'Latest', icon: 'Calendar' },
    { value: 'views', label: 'Most Viewed', icon: 'Eye' },
    { value: 'duration', label: 'Duration', icon: 'Clock' },
    { value: 'title', label: 'Title A-Z', icon: 'AlphabeticalSortingAZ' }
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Channel Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={channel.avatar}
            alt={channel.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-accent"
          />
          
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-display font-bold text-white mb-2 break-words">
              {channel.name}
            </h1>
            <p className="text-gray-400 mb-4">
              {formatSubscribers(channel.subscribers)}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium"
            >
              Subscribe
            </motion.button>
          </div>
        </div>
        
        {/* Videos Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center space-x-2">
            <ApperIcon name="Video" size={24} className="text-accent" />
            <span>Videos ({videos.length})</span>
          </h2>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 whitespace-nowrap">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy(option.value)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sortBy === option.value
                      ? 'bg-accent text-background'
                      : 'bg-surface text-gray-300 hover:bg-surface/80'
                  }`}
                >
                  <ApperIcon name={option.icon} size={14} />
                  <span className="hidden sm:inline">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <EmptyState
          title="No videos found"
          description="This channel hasn't uploaded any videos yet"
          icon="Video"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VideoGrid 
            videos={videos} 
            channels={allChannels} 
            showChannel={false}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Channel;