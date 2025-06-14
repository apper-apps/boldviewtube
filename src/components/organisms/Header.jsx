import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <header className="flex-shrink-0 h-16 bg-secondary border-b border-surface flex items-center px-4 z-40">
      <div className="flex items-center justify-between w-full max-w-full overflow-hidden">
        {/* Left section */}
        <div className="flex items-center space-x-4 min-w-0">
          {/* Mobile menu button */}
          <button 
            onClick={onMobileMenuToggle}
            className="p-2 hover:bg-surface rounded-lg transition-colors md:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          {/* Logo */}
          <motion.button
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-accent font-display text-xl font-bold"
          >
            <ApperIcon name="Play" size={24} className="text-primary" />
            <span className="hidden sm:block">ViewTube</span>
          </motion.button>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4 min-w-0">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search videos..."
            initialValue={new URLSearchParams(location.search).get('q') || ''}
          />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-surface rounded-lg transition-colors hidden sm:block"
            title="Settings"
          >
            <ApperIcon name="Settings" size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
            title="User Profile"
          >
            <ApperIcon name="User" size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;