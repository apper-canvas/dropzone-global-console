import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const colors = {
    primary: 'from-primary to-accent',
    success: 'from-success to-emerald-400',
    warning: 'from-warning to-orange-400',
    error: 'from-error to-red-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-slate-700 rounded-full overflow-hidden ${heights[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} shadow-lg shadow-${color}/30`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-400 mt-1 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;