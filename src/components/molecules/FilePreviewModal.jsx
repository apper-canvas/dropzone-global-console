import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!file) return null;

  const isImage = file.type?.startsWith('image/');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white truncate">
                    {file.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {file.type} • {Math.round(file.size / 1024)} KB
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                  className="flex-shrink-0"
                />
              </div>
              
              <div className="flex items-center justify-center min-h-[200px] bg-slate-800/50 rounded-lg">
                {isImage ? (
                  <img
                    src={file.url || URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg"
                    onLoad={(e) => {
                      if (file.url) return;
                      // Cleanup object URL after image loads
                      setTimeout(() => {
                        URL.revokeObjectURL(e.target.src);
                      }, 1000);
                    }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <ApperIcon name="File" size={64} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Preview not available for this file type</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilePreviewModal;