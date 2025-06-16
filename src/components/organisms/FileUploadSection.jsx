import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/molecules/DropZone';
import FileCard from '@/components/molecules/FileCard';
import UploadStats from '@/components/molecules/UploadStats';
import FilePreviewModal from '@/components/molecules/FilePreviewModal';
import { fileService, uploadService } from '@/services';

const FileUploadSection = () => {
  const [files, setFiles] = useState([]);
  const [uploadSession, setUploadSession] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFilesSelected = async (selectedFiles) => {
    const newFiles = selectedFiles.map(file => ({
      Id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      uploadProgress: 0,
      status: 'pending',
      file: file // Store the actual file object for upload
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Create upload session
    const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
    const session = await uploadService.create({
      totalFiles: newFiles.length,
      totalSize,
      uploadedSize: 0
    });
    setUploadSession(session);

    // Start uploading files
    uploadFiles(newFiles, session);
    
    toast.success(`${newFiles.length} file(s) added to upload queue`);
  };

  const uploadFiles = async (filesToUpload, session) => {
    for (const file of filesToUpload) {
      try {
        // Update file status to uploading
        setFiles(prev => prev.map(f => 
          f.Id === file.Id ? { ...f, status: 'uploading' } : f
        ));

        // Simulate upload with progress
        await fileService.uploadFile(file.file, (progress) => {
          setFiles(prev => prev.map(f => 
            f.Id === file.Id ? { ...f, uploadProgress: progress } : f
          ));
        });

        // Mark as completed
        setFiles(prev => prev.map(f => 
          f.Id === file.Id ? { 
            ...f, 
            status: 'completed', 
            uploadProgress: 100,
            url: `https://example.com/files/${file.name}`
          } : f
        ));

        // Update session stats
        if (session) {
          const uploadedSize = session.uploadedSize + file.size;
          await uploadService.update(session.Id, { uploadedSize });
          setUploadSession(prev => ({ ...prev, uploadedSize }));
        }

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.Id === file.Id ? { ...f, status: 'failed' } : f
        ));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.Id === fileId);
      if (fileToRemove?.status === 'uploading') {
        toast.warning('Cannot remove file during upload');
        return prev;
      }
      
      const newFiles = prev.filter(f => f.Id !== fileId);
      toast.info(`${fileToRemove?.name} removed from queue`);
      return newFiles;
    });
  };

  const handlePreviewFile = (file) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const calculateStats = () => {
    const totalFiles = files.length;
    const completedFiles = files.filter(f => f.status === 'completed').length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const uploadedSize = files
      .filter(f => f.status === 'completed')
      .reduce((sum, file) => sum + file.size, 0);
    
    return {
      totalFiles,
      completedFiles,
      totalSize,
      uploadedSize,
      averageSpeed: uploadSession?.averageSpeed || 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-8">
      {/* Upload Statistics */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UploadStats {...stats} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Zone */}
      <DropZone onFilesSelected={handleFilesSelected} />

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              Upload Queue
              <span className="text-sm font-normal text-gray-400">
                ({files.length} file{files.length !== 1 ? 's' : ''})
              </span>
            </h2>
            
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {files.map((file, index) => (
                  <motion.div
                    key={file.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <FileCard
                      file={file}
                      onRemove={handleRemoveFile}
                      onPreview={handlePreviewFile}
                      showActions={file.status !== 'uploading'}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default FileUploadSection;