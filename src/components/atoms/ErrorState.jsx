import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ message = "Something went wrong", onRetry, title = "Error" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
        className="mb-6"
      >
        <ApperIcon name="AlertCircle" size={64} className="text-error" />
      </motion.div>
      
      <h3 className="text-xl font-display font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md break-words">{message}</p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorState;