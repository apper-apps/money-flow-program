import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { formatCurrency, calculatePercentage } from '@/utils/formatters';

const BudgetManager = ({ budgets = [], onSave }) => {
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({ category: '', allocated: '' });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Other'
  ];

  const handleSaveBudget = (budget) => {
    const budgetData = {
      category: budget.category,
      allocated: parseFloat(budget.allocated),
      spent: budget.spent || 0,
      period: 'monthly'
    };
    onSave(budgetData);
    setEditingBudget(null);
  };

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.allocated) return;
    
    handleSaveBudget({
      category: newBudget.category,
      allocated: newBudget.allocated,
      spent: 0
    });
    setNewBudget({ category: '', allocated: '' });
  };

  const getBudgetStatus = (budget) => {
    const percentage = calculatePercentage(budget.spent, budget.allocated);
    if (percentage >= 100) return { color: 'error', status: 'Over Budget' };
    if (percentage >= 80) return { color: 'warning', status: 'Near Limit' };
    return { color: 'success', status: 'On Track' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Budget Management</h2>
      </div>

      {/* Add New Budget */}
      <Card className="premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={20} className="text-primary" />
            <span>Add New Budget</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Category"
              type="select"
              value={newBudget.category}
              onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Select Category</option>
              {categories.filter(cat => !budgets.find(b => b.category === cat)).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FormField>
            
            <FormField
              label="Monthly Budget"
              type="number"
              value={newBudget.allocated}
              onChange={(e) => setNewBudget(prev => ({ ...prev, allocated: e.target.value }))}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            
            <div className="flex items-end">
              <Button
                onClick={handleAddBudget}
                className="bg-gradient-to-r from-primary to-secondary w-full"
                disabled={!newBudget.category || !newBudget.allocated}
              >
                Add Budget
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget, index) => {
          const status = getBudgetStatus(budget);
          const percentage = calculatePercentage(budget.spent, budget.allocated);
          
          return (
            <motion.div
              key={budget.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="premium-shadow premium-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${
                        status.color === 'error' ? 'from-error to-red-600' :
                        status.color === 'warning' ? 'from-warning to-yellow-600' :
                        'from-success to-accent'
                      } bg-opacity-10`}>
                        <ApperIcon name="PiggyBank" size={20} className={`text-${status.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                        <p className={`text-sm text-${status.color}`}>{status.status}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingBudget(budget)}
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Spent</span>
                      <span className="font-semibold">{formatCurrency(budget.spent)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Budget</span>
                      <span className="font-semibold">{formatCurrency(budget.allocated)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            status.color === 'error' ? 'from-error to-red-600' :
                            status.color === 'warning' ? 'from-warning to-yellow-600' :
                            'from-success to-accent'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Remaining: {formatCurrency(Math.max(budget.allocated - budget.spent, 0))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="PiggyBank" size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No budgets set</h3>
          <p className="text-gray-600">Create your first budget to start managing your spending.</p>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;