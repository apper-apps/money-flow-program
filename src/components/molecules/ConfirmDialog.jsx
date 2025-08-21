import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-full ${
            type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <ApperIcon 
              name={type === 'danger' ? 'AlertTriangle' : 'Info'} 
              size={24} 
              className={type === 'danger' ? 'text-red-600' : 'text-yellow-600'} 
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex space-x-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`px-4 py-2 ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;