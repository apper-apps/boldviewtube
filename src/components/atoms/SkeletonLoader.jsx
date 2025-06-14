import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, type = 'video' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const shimmerVariants = {
    animate: {
      x: ['0%', '100%'],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };

  if (type === 'video') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-lg overflow-hidden"
          >
            {/* Thumbnail skeleton */}
            <div className="aspect-video bg-gray-600 relative overflow-hidden">
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
              />
            </div>
            
            {/* Content skeleton */}
            <div className="p-4">
              <div className="flex space-x-3">
                {/* Avatar skeleton */}
                <div className="w-10 h-10 bg-gray-600 rounded-full relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
                  />
                </div>
                
                {/* Text skeleton */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4 relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
                    />
                  </div>
                  <div className="h-3 bg-gray-600 rounded w-1/2 relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
                    />
                  </div>
                  <div className="h-3 bg-gray-600 rounded w-1/3 relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex space-x-4 p-4 bg-surface rounded-lg"
          >
            <div className="w-40 h-24 bg-gray-600 rounded relative overflow-hidden">
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-600 rounded w-3/4 relative overflow-hidden">
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
                />
              </div>
              <div className="h-3 bg-gray-600 rounded w-1/2 relative overflow-hidden">
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;