import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions = [
    {
      value: 'system',
      label: 'System',
      description: 'Use system preference',
      icon: 'Monitor'
    },
    {
      value: 'light',
      label: 'Light',
      description: 'Light theme',
      icon: 'Sun'
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Dark theme',
      icon: 'Moon'
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background light:bg-background-light">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-display text-text-primary dark:text-text-primary light:text-text-primary-light mb-2">
                Settings
              </h1>
              <p className="text-text-secondary dark:text-text-secondary light:text-text-secondary-light">
                Customize your ViewTube experience
              </p>
            </div>

            {/* Theme Section */}
            <div className="bg-surface dark:bg-surface light:bg-surface-light rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <ApperIcon name="Palette" size={24} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary light:text-text-primary-light">
                    Appearance
                  </h2>
                  <p className="text-text-secondary dark:text-text-secondary light:text-text-secondary-light">
                    Choose how ViewTube looks to you
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-text-primary dark:text-text-primary light:text-text-primary-light mb-4">
                  Theme Preference
                  {theme === 'system' && (
                    <span className="ml-2 text-xs text-text-secondary dark:text-text-secondary light:text-text-secondary-light">
                      (Currently: {resolvedTheme})
                    </span>
                  )}
                </p>
                
                <div className="grid gap-3">
                  {themeOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                        theme === option.value
                          ? 'border-accent bg-accent/5'
                          : 'border-gray-600 dark:border-gray-600 light:border-gray-300 hover:border-accent/50'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          theme === option.value
                            ? 'bg-accent text-white'
                            : 'bg-gray-600 dark:bg-gray-600 light:bg-gray-200 text-text-secondary dark:text-text-secondary light:text-text-secondary-light'
                        }`}>
                          <ApperIcon name={option.icon} size={20} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-text-primary dark:text-text-primary light:text-text-primary-light">
                            {option.label}
                          </div>
                          <div className="text-sm text-text-secondary dark:text-text-secondary light:text-text-secondary-light">
                            {option.description}
                          </div>
                        </div>
                      </div>
                      
                      {theme === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-accent"
                        >
                          <ApperIcon name="Check" size={20} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Settings Placeholder */}
            <div className="bg-surface dark:bg-surface light:bg-surface-light rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <ApperIcon name="Settings" size={24} className="text-info" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary light:text-text-primary-light">
                    More Settings
                  </h2>
                  <p className="text-text-secondary dark:text-text-secondary light:text-text-secondary-light">
                    Additional customization options coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;