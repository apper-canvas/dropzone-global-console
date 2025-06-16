import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const UploadStats = ({ 
  totalFiles = 0,
  completedFiles = 0, 
  totalSize = 0,
  uploadedSize = 0,
  averageSpeed = 0,
  className = '' 
}) => {
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

  const progressPercentage = totalSize > 0 ? (uploadedSize / totalSize) * 100 : 0;

  const stats = [
    {
      label: 'Files',
      value: `${completedFiles}/${totalFiles}`,
      icon: 'Files',
      color: 'text-primary'
    },
    {
      label: 'Size',
      value: formatFileSize(uploadedSize),
      subValue: `of ${formatFileSize(totalSize)}`,
      icon: 'HardDrive',
      color: 'text-secondary'
    },
    {
      label: 'Speed',
      value: formatSpeed(averageSpeed),
      icon: 'Zap',
      color: 'text-accent'
    },
    {
      label: 'Progress',
      value: `${Math.round(progressPercentage)}%`,
      icon: 'TrendingUp',
      color: 'text-success'
    }
  ];

  return (
    <div className={`glass rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <ApperIcon name="BarChart3" size={20} className="text-primary" />
        Upload Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 mb-2 ${stat.color}`}>
              <ApperIcon name={stat.icon} size={20} />
            </div>
            
            <div className="text-sm font-medium text-white">
              {stat.value}
            </div>
            
            {stat.subValue && (
              <div className="text-xs text-gray-400">
                {stat.subValue}
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UploadStats;