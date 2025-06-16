import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

// Configure PDF.js worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

export default function FilePreviewModal({ file, isOpen, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

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

  // Reset page number when file changes
  useEffect(() => {
    setPageNumber(1);
    setNumPages(null);
  }, [file]);

  if (!file) return null;

  const getFileType = () => {
    const type = file.type?.toLowerCase() || '';
    const name = file.name?.toLowerCase() || '';
    
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.json')) return 'text';
    return 'unknown';
  };

  const fileType = getFileType();
  const fileUrl = file.url || (file.file ? URL.createObjectURL(file.file) : null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const renderPreviewContent = () => {
    switch (fileType) {
      case 'image':
        return (
          <img
            src={fileUrl}
            alt={file.name}
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
            onLoad={(e) => {
              if (file.url) return;
              setTimeout(() => {
                URL.revokeObjectURL(e.target.src);
              }, 1000);
            }}
          />
        );

      case 'pdf':
        return (
          <div className="w-full">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <ApperIcon name="Loader" size={32} className="text-primary" />
                  </motion.div>
                  <span className="ml-3 text-gray-400">Loading PDF...</span>
                </div>
              }
              error={
                <div className="text-center py-12">
                  <ApperIcon name="FileX" size={64} className="text-error mx-auto mb-4" />
                  <p className="text-error">Failed to load PDF</p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                width={Math.min(800, window.innerWidth - 100)}
                className="mx-auto"
                loading={
                  <div className="flex justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <ApperIcon name="Loader" size={24} className="text-primary" />
                    </motion.div>
                  </div>
                }
              />
            </Document>
            
            {numPages && numPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-slate-800/50 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="ChevronLeft"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                />
                <span className="text-sm text-gray-300 min-w-[100px] text-center">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="ChevronRight"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                />
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <video
            src={fileUrl}
            controls
            className="max-w-full max-h-[60vh] rounded-lg"
            onLoadedData={() => {
              if (file.url) return;
              setTimeout(() => {
                URL.revokeObjectURL(fileUrl);
              }, 1000);
            }}
          >
            Your browser does not support video playback.
          </video>
        );

      case 'audio':
        return (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <ApperIcon name="Music" size={64} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">{file.name}</h3>
            </div>
            <audio
              src={fileUrl}
              controls
              className="w-full"
              onLoadedData={() => {
                if (file.url) return;
                setTimeout(() => {
                  URL.revokeObjectURL(fileUrl);
                }, 1000);
              }}
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        );

      case 'text':
        return (
          <div className="w-full">
            <div className="bg-slate-900/50 rounded-lg p-4 max-h-[60vh] overflow-auto">
              <iframe
                src={fileUrl}
                className="w-full min-h-[400px] bg-white rounded"
                title={file.name}
                onLoad={() => {
                  if (file.url) return;
                  setTimeout(() => {
                    URL.revokeObjectURL(fileUrl);
                  }, 1000);
                }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <ApperIcon name="File" size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Preview not available for this file type</p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: Images, PDF, Video, Audio, Text
            </p>
          </div>
        );
    }
  };

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
            <div className="glass rounded-2xl p-6 max-w-5xl max-h-[95vh] overflow-auto w-full">
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
              
              <div className="flex items-center justify-center min-h-[200px] bg-slate-800/50 rounded-lg p-4">
                {renderPreviewContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
