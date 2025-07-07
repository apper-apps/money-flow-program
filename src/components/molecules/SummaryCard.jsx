import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { formatCurrency } from '@/utils/formatters';

const SummaryCard = ({ 
  title, 
  amount, 
  icon, 
  trend, 
  trendValue,
  gradient = 'from-primary to-secondary',
  delay = 0
}) => {
  const isPositive = trend === 'up';
  const trendColor = isPositive ? 'text-success' : 'text-error';
  const trendIcon = isPositive ? 'TrendingUp' : 'TrendingDown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="premium-hover"
    >
      <Card className="premium-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-10`}>
              <ApperIcon name={icon} size={24} className="text-white" />
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 ${trendColor}`}>
                <ApperIcon name={trendIcon} size={16} />
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{title}</p>
            <motion.p 
              className="text-2xl font-bold text-gray-900"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.1 }}
            >
              {formatCurrency(amount)}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;