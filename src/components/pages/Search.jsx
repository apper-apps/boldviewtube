import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { videoService, channelService } from '@/services';
import VideoGrid from '@/components/molecules/VideoGrid';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const loadData = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setVideos([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [videosData, channelsData] = await Promise.all([
        videoService.search(searchTerm),
        channelService.getAll()
      ]);
      
      let sortedVideos = [...videosData];
      
      // Sort videos based on selected criteria
      switch (sortBy) {
        case 'views':
          sortedVideos.sort((a, b) => b.views - a.views);
          break;
        case 'date':
          sortedVideos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
          break;
        case 'duration':
          sortedVideos.sort((a, b) => b.duration - a.duration);
          break;
        default: // relevance
          // Keep original order (search relevance)
          break;
      }
      
      setVideos(sortedVideos);
      setChannels(channelsData);
    } catch (err) {
      setError(err.message || 'Failed to search videos');
      toast.error('Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  useEffect(() => {
    setSearchQuery(query);
    loadData(query);
  }, [query, sortBy]);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: 'Target' },
    { value: 'views', label: 'Most Viewed', icon: 'Eye' },
    { value: 'date', label: 'Upload Date', icon: 'Calendar' },
    { value: 'duration', label: 'Duration', icon: 'Clock' }
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for videos..."
              initialValue={query}
            />
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 whitespace-nowrap">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSortChange(option.value)}
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
        
        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <h1 className="text-xl font-display font-bold text-white">
              Search results for "{query}"
            </h1>
            {!loading && (
              <span className="text-sm text-gray-400">
                {videos.length} {videos.length === 1 ? 'result' : 'results'}
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Loading State */}
      {loading && <SkeletonLoader count={8} />}

      {/* Error State */}
      {error && <ErrorState message={error} onRetry={() => loadData(query)} />}

      {/* No Query State */}
      {!query && !loading && (
        <EmptyState
          title="Start searching"
          description="Enter a search term to find videos"
          icon="Search"
        />
      )}

      {/* No Results State */}
      {query && !loading && !error && videos.length === 0 && (
        <EmptyState
          title="No results found"
          description={`No videos found for "${query}". Try different keywords or check your spelling.`}
          icon="SearchX"
        />
      )}

      {/* Results */}
      {!loading && !error && videos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VideoGrid videos={videos} channels={channels} />
        </motion.div>
      )}
    </div>
  );
};

export default Search;