import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Slider from '@/components/atoms/Slider';
import { formatCurrency, calculatePercentage } from '@/utils/formatters';

const SavingsGoalCard = ({ 
  goal, 
  current, 
  target, 
  onUpdateGoal,
  className 
}) => {
  const percentage = calculatePercentage(current, target);
  const remaining = Math.max(target - current, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-accent to-success bg-opacity-10">
                <ApperIcon name="Target" size={20} className="text-accent" />
              </div>
              <span>Savings Goal</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text">
                {percentage.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Progress</span>
                <span className="text-sm font-medium">{formatCurrency(current)} of {formatCurrency(target)}</span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-accent to-success h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining: {formatCurrency(remaining)}</span>
                <span className="text-success font-medium">
                  {percentage >= 100 ? 'Goal Achieved!' : `${(100 - percentage).toFixed(0)}% to go`}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Adjust Goal</span>
                <span className="text-sm text-gray-600">{formatCurrency(target)}</span>
              </div>
              
              <Slider
                value={target}
                min={100}
                max={50000}
                step={100}
                onChange={onUpdateGoal}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>$100</span>
                <span>$50,000</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavingsGoalCard;