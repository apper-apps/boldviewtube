import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ onSearch, placeholder = "Search...", initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-full">
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused ? 'ring-2 ring-accent' : ''
      }`}>
        <div className="absolute left-3 z-10">
          <ApperIcon name="Search" size={18} className="text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-2 bg-surface border-2 border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-all duration-200"
        />
        
        {query && (
          <motion.button
            type="button"
            onClick={handleClear}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-10 p-1 hover:bg-gray-600 rounded-full transition-colors"
          >
            <ApperIcon name="X" size={14} className="text-gray-400" />
          </motion.button>
        )}
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 p-1 bg-accent text-background rounded-lg hover:bg-accent/80 transition-colors"
        >
          <ApperIcon name="Search" size={16} />
        </motion.button>
      </div>
    </form>
  );
};

export default SearchBar;