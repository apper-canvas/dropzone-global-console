import ApperIcon from '@/components/ApperIcon';

const FileIcon = ({ type, size = 20, className = '' }) => {
  const getIconForType = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType.startsWith('video/')) return 'Video';
    if (fileType.startsWith('audio/')) return 'Music';
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('zip') || fileType.includes('archive')) return 'Archive';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'Table';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'Presentation';
    return 'File';
  };

  const iconName = getIconForType(type);

  return (
    <ApperIcon 
      name={iconName} 
      size={size} 
      className={`text-gray-400 ${className}`} 
    />
  );
};

export default FileIcon;