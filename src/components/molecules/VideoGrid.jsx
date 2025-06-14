import { motion } from 'framer-motion';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos = [], channels = [], showChannel = true }) => {
  const getChannelById = (channelId) => {
    return channels.find(channel => channel.id === channelId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-full"
    >
      {videos.map((video) => (
        <motion.div key={video.id} variants={itemVariants}>
          <VideoCard
            video={video}
            channel={showChannel ? getChannelById(video.channelId) : null}
            showChannel={showChannel}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VideoGrid;