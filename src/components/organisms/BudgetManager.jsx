import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { budgetService } from "@/services/api/budgetService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Budget from "@/components/pages/Budget";
import FormField from "@/components/molecules/FormField";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { calculatePercentage, formatCurrency } from "@/utils/formatters";

const BudgetManager = ({ budgets = [], onSave, onDelete }) => {
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({ category: '', allocated: '' });
  const [deletingBudget, setDeletingBudget] = useState(null);
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

  const handleDeleteBudget = async (budget) => {
    try {
      await budgetService.delete(budget.Id);
      toast.success(`${budget.category} budget deleted successfully`);
      setDeletingBudget(null);
      if (onDelete) onDelete();
    } catch (err) {
      toast.error('Failed to delete budget');
    }
  };

  const getBudgetStatus = (budget) => {
    const percentage = calculatePercentage(budget.spent, budget.allocated);
    if (percentage >= 100) return { 
      color: 'error', 
      status: 'Over Budget',
      bgClass: 'from-red-50 to-red-100 border-red-200',
      textClass: 'text-red-700',
      iconClass: 'text-red-600'
    };
    if (percentage >= 80) return { 
      color: 'warning', 
      status: 'Near Limit',
      bgClass: 'from-yellow-50 to-yellow-100 border-yellow-200',
      textClass: 'text-yellow-700',
      iconClass: 'text-yellow-600'
    };
    return { 
      color: 'success', 
      status: 'On Track',
      bgClass: 'from-green-50 to-green-100 border-green-200',
      textClass: 'text-green-700',
      iconClass: 'text-green-600'
    };
  };

  const getBudgetRecommendation = (budget) => {
    const percentage = calculatePercentage(budget.spent, budget.allocated);
    const remaining = budget.allocated - budget.spent;
    
    if (percentage >= 100) {
      return {
        type: 'error',
        message: `You've exceeded your ${budget.category} budget by ${formatCurrency(Math.abs(remaining))}`
      };
    }
    if (percentage >= 80) {
      return {
        type: 'warning',
        message: `You have ${formatCurrency(remaining)} left in ${budget.category}. Consider reducing spending.`
      };
    }
    if (percentage < 50) {
      return {
        type: 'success',
        message: `Great job! You're well within your ${budget.category} budget.`
      };
    }
    return null;
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
          const recommendation = getBudgetRecommendation(budget);
          
          return (
            <motion.div
              key={budget.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`premium-shadow premium-hover bg-gradient-to-br ${status.bgClass} border-2`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                        <ApperIcon name="PiggyBank" size={24} className={status.iconClass} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{budget.category}</h3>
                        <p className={`text-sm font-semibold ${status.textClass}`}>{status.status}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBudget(budget)}
                        className="hover:bg-white/60"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingBudget(budget)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Budget Recommendation Alert */}
                  {recommendation && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      recommendation.type === 'error' ? 'bg-red-100 border border-red-200' :
                      recommendation.type === 'warning' ? 'bg-yellow-100 border border-yellow-200' :
                      'bg-green-100 border border-green-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        recommendation.type === 'error' ? 'text-red-800' :
                        recommendation.type === 'warning' ? 'text-yellow-800' :
                        'text-green-800'
                      }`}>
                        {recommendation.message}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="text-sm text-gray-600 font-medium">Spent</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(budget.spent)}</p>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="text-sm text-gray-600 font-medium">Budget</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(budget.allocated)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                          percentage >= 100 ? 'bg-red-200 text-red-800' :
                          percentage >= 80 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/80 rounded-full h-3 shadow-inner">
                        <motion.div
                          className={`h-3 rounded-full bg-gradient-to-r shadow-sm ${
                            status.color === 'error' ? 'from-red-500 to-red-600' :
                            status.color === 'warning' ? 'from-yellow-500 to-yellow-600' :
                            'from-green-500 to-green-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 font-medium">Remaining</p>
                      <p className={`text-lg font-bold ${
                        budget.allocated - budget.spent < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(Math.abs(budget.allocated - budget.spent))}
                        {budget.allocated - budget.spent < 0 && ' over budget'}
                      </p>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        onConfirm={() => handleDeleteBudget(deletingBudget)}
        title="Delete Budget"
        message={`Are you sure you want to delete the ${deletingBudget?.category} budget? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
/>
    </div>
  );
};

export default BudgetManager;