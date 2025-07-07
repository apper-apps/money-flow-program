import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ message = 'Something went wrong', onRetry, type = 'general' }) => {
  const getErrorContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Connection Error',
          description: 'Please check your internet connection and try again.',
        };
      case 'data':
        return {
          icon: 'AlertCircle',
          title: 'Data Error',
          description: 'There was an issue loading your financial data.',
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Something went wrong',
          description: message,
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 px-6"
    >
      <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-full p-6 mb-6">
        <ApperIcon 
          name={errorContent.icon} 
          size={48} 
          className="text-error"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {errorContent.title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {errorContent.description}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;