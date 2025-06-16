import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import FileIcon from '@/components/atoms/FileIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import Button from '@/components/atoms/Button';

const FileCard = ({ 
  file, 
  onRemove, 
  onPreview,
  showActions = true,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case 'completed':
        return <ApperIcon name="CheckCircle" size={16} className="text-success" />;
      case 'failed':
        return <ApperIcon name="XCircle" size={16} className="text-error" />;
      case 'uploading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <ApperIcon name="Loader" size={16} className="text-primary" />
          </motion.div>
        );
      default:
        return <ApperIcon name="Clock" size={16} className="text-gray-400" />;
    }
  };

  const isImage = file.type?.startsWith('image/');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`glass glass-hover rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <FileIcon type={file.type} size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium truncate text-sm">
              {file.name}
            </h3>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
{showActions && isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Eye"
                    onClick={() => onPreview?.(file)}
                    className="p-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => onRemove?.(file.Id)}
                    className="p-1 hover:text-error"
                  />
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mb-2">
            {formatFileSize(file.size)}
          </div>
          
          {file.status === 'uploading' && (
            <ProgressBar 
              progress={file.uploadProgress || 0} 
              size="sm"
              color="primary"
            />
          )}
          
          {file.status === 'completed' && (
            <ProgressBar 
              progress={100} 
              size="sm"
              color="success"
              showPercentage={false}
            />
          )}
          
          {file.status === 'failed' && (
            <div className="text-xs text-error">Upload failed</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;