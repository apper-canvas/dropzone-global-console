import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { uploadService } from '@/services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    completedFiles: 0,
    totalSize: 0,
    uploadedSize: 0,
    averageSpeed: 0,
    activeUploads: 0,
    completedUploads: 0
  });
  const [loading, setLoading] = useState(true);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const fetchStats = async () => {
    try {
      const aggregateStats = await uploadService.getAggregateStats();
      setStats(aggregateStats);
    } catch (error) {
      console.error('Failed to fetch upload statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 1000); // Refresh every second for real-time updates
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = stats.totalSize > 0 ? (stats.uploadedSize / stats.totalSize) * 100 : 0;

  const dashboardCards = [
    {
      title: 'Total Files',
      value: stats.totalFiles.toString(),
      subValue: `${stats.completedFiles} completed`,
      icon: 'Files',
      color: 'text-primary',
      bgGradient: 'from-blue-500/20 to-blue-600/20'
    },
    {
      title: 'Upload Size',
      value: formatFileSize(stats.uploadedSize),
      subValue: `of ${formatFileSize(stats.totalSize)}`,
      icon: 'HardDrive',
      color: 'text-secondary',
      bgGradient: 'from-purple-500/20 to-purple-600/20'
    },
    {
      title: 'Upload Speed',
      value: formatSpeed(stats.averageSpeed),
      subValue: 'Average speed',
      icon: 'Zap',
      color: 'text-accent',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20'
    },
    {
      title: 'Progress',
      value: `${Math.round(progressPercentage)}%`,
      subValue: 'Overall completion',
      icon: 'TrendingUp',
      color: 'text-success',
      bgGradient: 'from-green-500/20 to-green-600/20'
    }
  ];

  const sessionCards = [
    {
      title: 'Active Sessions',
      value: stats.activeUploads.toString(),
      icon: 'Upload',
      color: 'text-orange-400'
    },
    {
      title: 'Completed Sessions',
      value: stats.completedUploads.toString(),
      icon: 'CheckCircle',
      color: 'text-green-400'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-700 bg-surface/50 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25"
            >
              <ApperIcon name="BarChart3" size={24} className="text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Upload Dashboard</h1>
              <p className="text-gray-400">Real-time upload metrics and statistics</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Main Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <ApperIcon name="Activity" size={20} className="text-primary" />
              Upload Statistics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass rounded-xl p-6 bg-gradient-to-br ${card.bgGradient}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                      <p className={`text-2xl font-bold ${card.color} mt-1`}>
                        {card.value}
                      </p>
                      {card.subValue && (
                        <p className="text-gray-500 text-xs mt-1">{card.subValue}</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-800/50 ${card.color}`}>
                      <ApperIcon name={card.icon} size={20} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Session Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <ApperIcon name="Globe" size={20} className="text-primary" />
              Session Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessionCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-lg bg-slate-800/50 ${card.color}`}>
                      <ApperIcon name={card.icon} size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                      <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Progress Overview */}
          {stats.totalSize > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ApperIcon name="Progress" size={20} className="text-primary" />
                Overall Progress
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Upload Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatFileSize(stats.uploadedSize)} uploaded</span>
                  <span>{formatFileSize(stats.totalSize)} total</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/10 to-secondary/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default Dashboard;