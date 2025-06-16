import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-surface/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25"
                >
                  <ApperIcon name="Upload" size={16} className="text-white" />
                </motion.div>
                <span className="text-lg font-bold text-white">DropZone</span>
              </div>
              
              <div className="flex items-center gap-1">
                {routeArray.map((route) => {
                  const isActive = location.pathname === route.path;
                  return (
                    <Link
                      key={route.id}
                      to={route.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <ApperIcon name={route.icon} size={16} />
                      <span className="text-sm font-medium">{route.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;