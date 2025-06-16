import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ShareDialog = ({ file, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = file?.url || '';
  const fileName = file?.name || '';

  const shareOptions = [
    {
      name: 'Email',
      icon: 'Mail',
      action: () => {
        window.open(`mailto:?subject=Shared File: ${fileName}&body=Check out this file: ${shareUrl}`);
      }
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=Check out this file: ${fileName}&url=${encodeURIComponent(shareUrl)}`);
      }
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
      }
    }
  ];

  if (!file) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <ApperIcon name="Share" size={20} />
                Share File
              </h3>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
                className="p-1"
              />
            </div>

            <div className="space-y-4">
              {/* File Info */}
              <div className="glass rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <ApperIcon name="File" size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-medium text-sm truncate">{fileName}</p>
                    <p className="text-xs text-gray-400">Ready to share</p>
                  </div>
                </div>
              </div>

              {/* Copy Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                  <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
                    <Button
                      variant={copied ? "primary" : "secondary"}
                      size="sm"
                      icon={copied ? "Check" : "Copy"}
                      className="px-3"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </CopyToClipboard>
                </div>
              </div>

              {/* Social Share */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Share Via</label>
                <div className="grid grid-cols-3 gap-2">
                  {shareOptions.map((option) => (
                    <Button
                      key={option.name}
                      variant="ghost"
                      size="sm"
                      icon={option.icon}
                      onClick={option.action}
                      className="flex-col gap-1 h-auto py-3"
                    >
                      <span className="text-xs">{option.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareDialog;