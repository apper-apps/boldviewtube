import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { videoService, channelService, watchHistoryService } from '@/services';
import VideoGrid from '@/components/molecules/VideoGrid';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [videosData, channelsData, historyData] = await Promise.all([
        videoService.getTrending(),
        channelService.getAll(),
        watchHistoryService.getAll()
      ]);
      
      setVideos(videosData);
      setChannels(channelsData);
      
      // Get continue watching videos (recent history with progress)
      const recentHistory = historyData.slice(0, 6);
      const continueVideos = [];
      
      for (const historyItem of recentHistory) {
        if (historyItem.progress > 10 && historyItem.progress < 90) { // Only partially watched videos
          try {
            const video = await videoService.getById(historyItem.videoId);
            continueVideos.push({
              ...video,
              progress: historyItem.progress
            });
          } catch (err) {
            // Video might be deleted, skip it
            continue;
          }
        }
      }
      
      setContinueWatching(continueVideos);
    } catch (err) {
      setError(err.message || 'Failed to load content');
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface rounded w-48 mb-4" />
          <SkeletonLoader count={4} />
        </div>
        <div className="mb-8">
          <div className="h-8 bg-surface rounded w-32 mb-4" />
          <SkeletonLoader count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Continue Watching Section */}
      {continueWatching.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center space-x-2">
            <span>Continue Watching</span>
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded" />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {continueWatching.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                className="relative bg-surface rounded-lg overflow-hidden geometric-hover group cursor-pointer"
                onClick={() => window.location.href = `/watch/${video.id}`}
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                    <div 
                      className="h-full progress-bar"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                  
                  {/* Continue Badge */}
                  <div className="absolute top-2 left-2 bg-accent text-background px-2 py-1 rounded text-xs font-bold">
                    Continue
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium text-white text-sm line-clamp-2 break-words">
                    {video.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Trending Videos Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center space-x-2">
          <span>Trending</span>
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded" />
        </h2>
        
        {videos.length === 0 ? (
          <EmptyState
            title="No trending videos"
            description="Check back later for trending content"
            icon="TrendingUp"
          />
        ) : (
          <VideoGrid videos={videos} channels={channels} />
        )}
      </motion.section>
    </div>
  );
};

export default Home;