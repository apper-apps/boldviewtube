import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Header from '@/components/organisms/Header';
import { routes } from '@/config/routes';
import { ThemeProvider } from '@/contexts/ThemeContext';

const LayoutContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = Object.values(routes).filter(route => !route.hideInNav);

  const isWatchPage = location.pathname.startsWith('/watch');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background dark:bg-background light:bg-background-light text-text-primary dark:text-text-primary light:text-text-primary-light">
      {/* Header */}
      <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
<aside className={`w-64 bg-secondary dark:bg-secondary light:bg-secondary-light border-r border-surface dark:border-surface light:border-gray-200 flex-shrink-0 overflow-y-auto z-40 ${isWatchPage ? 'hidden lg:block' : 'hidden md:block'}`}>
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-surface text-accent nav-active' 
                        : 'text-gray-300 hover:bg-surface hover:text-white'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Bottom Navigation */}
<div className={`md:hidden fixed bottom-0 left-0 right-0 bg-secondary dark:bg-secondary light:bg-secondary-light border-t border-surface dark:border-surface light:border-gray-200 z-50 ${isWatchPage ? 'hidden' : 'block'}`}>
          <div className="flex justify-around py-2">
            {navigationItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 px-4 py-2 transition-colors ${
                    isActive ? 'text-accent' : 'text-gray-400'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.3 }}
className="fixed left-0 top-0 bottom-0 w-64 bg-secondary dark:bg-secondary light:bg-secondary-light border-r border-surface dark:border-surface light:border-gray-200 z-50 overflow-y-auto md:hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display text-accent">ViewTube</h2>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 hover:bg-surface rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  <nav>
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive 
                                ? 'bg-surface text-accent nav-active' 
                                : 'text-gray-300 hover:bg-surface hover:text-white'
                            }`
                          }
                        >
                          <ApperIcon name={item.icon} size={20} />
                          <span className="font-medium">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto ${isWatchPage ? '' : 'pb-16 md:pb-0'}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
</div>
  );
};

const Layout = () => {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
};

export default Layout;