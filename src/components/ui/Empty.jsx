import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  type = 'transactions', 
  onAction, 
  actionLabel = 'Get Started',
  title,
  description 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'transactions':
        return {
          icon: 'Receipt',
          title: title || 'No transactions yet',
          description: description || 'Start tracking your finances by adding your first transaction.',
          actionLabel: actionLabel || 'Add Transaction',
          gradient: 'from-primary/5 to-secondary/10',
        };
      case 'budget':
        return {
          icon: 'PiggyBank',
          title: title || 'No budget set',
          description: description || 'Create your first budget to start managing your spending.',
          actionLabel: actionLabel || 'Set Budget',
          gradient: 'from-accent/5 to-success/10',
        };
      case 'savings':
        return {
          icon: 'Target',
          title: title || 'No savings goals',
          description: description || 'Set a savings goal to start building your financial future.',
          actionLabel: actionLabel || 'Set Goal',
          gradient: 'from-secondary/5 to-accent/10',
        };
      default:
        return {
          icon: 'FileText',
          title: title || 'No data available',
          description: description || 'Get started by adding some information.',
          actionLabel: actionLabel,
          gradient: 'from-gray-100 to-gray-200',
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className={`bg-gradient-to-br ${emptyContent.gradient} rounded-full p-8 mb-6`}>
        <ApperIcon 
          name={emptyContent.icon} 
          size={64} 
          className="text-gray-400"
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {emptyContent.title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md text-lg">
        {emptyContent.description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 py-3"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          {emptyContent.actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;