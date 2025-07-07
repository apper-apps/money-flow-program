import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { formatCurrency, formatDate } from '@/utils/formatters';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-success' : 'text-error';
  const amountPrefix = isIncome ? '+' : '-';

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food & Dining': 'UtensilsCrossed',
      'Transportation': 'Car',
      'Shopping': 'ShoppingBag',
      'Entertainment': 'Gamepad2',
      'Bills & Utilities': 'Receipt',
      'Healthcare': 'Heart',
      'Salary': 'Briefcase',
      'Investment': 'TrendingUp',
      'Other': 'DollarSign'
    };
    return iconMap[category] || 'DollarSign';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="premium-hover"
    >
      <Card className="premium-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${isIncome ? 'from-success to-accent' : 'from-error to-red-600'} bg-opacity-10`}>
                <ApperIcon 
                  name={getCategoryIcon(transaction.category)} 
                  size={20} 
                  className={isIncome ? 'text-success' : 'text-error'}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                <p className="text-sm text-gray-600">{transaction.category}</p>
                <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <p className={`text-lg font-bold ${amountColor}`}>
                {amountPrefix}{formatCurrency(Math.abs(transaction.amount))}
              </p>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-1 text-gray-400 hover:text-primary transition-colors"
                >
                  <ApperIcon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => onDelete(transaction.Id)}
                  className="p-1 text-gray-400 hover:text-error transition-colors"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionItem;