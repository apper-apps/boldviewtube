import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ 
  title = "No content found", 
  description = "Try adjusting your search or explore other content",
  actionLabel,
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-6"
      >
        <ApperIcon name={icon} size={64} className="text-gray-400" />
      </motion.div>
      
      <h3 className="text-xl font-display font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md break-words">{description}</p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/80 transition-colors"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;