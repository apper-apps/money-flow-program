import React, { useEffect, useState } from "react";
import { budgetService } from "@/services/api/budgetService";
import { toast } from "react-toastify";
import { transactionService } from "@/services/api/transactionService";
import ApperIcon from "@/components/ApperIcon";
import BudgetManager from "@/components/organisms/BudgetManager";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { formatCurrency } from "@/utils/formatters";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [budgetsData, transactionsData] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll()
      ]);
      
      // Calculate spent amounts for each budget
      const budgetsWithSpent = budgetsData.map(budget => {
        const categoryExpenses = transactionsData
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          ...budget,
          spent: categoryExpenses
        };
      });
      
      setBudgets(budgetsWithSpent);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async (budgetData) => {
    try {
      const existingBudget = budgets.find(b => b.category === budgetData.category);
      
      if (existingBudget) {
        await budgetService.update(existingBudget.Id, budgetData);
        setBudgets(prev => 
          prev.map(b => b.category === budgetData.category ? { ...budgetData, Id: existingBudget.Id, spent: existingBudget.spent } : b)
        );
        toast.success('Budget updated successfully');
      } else {
        const newBudget = await budgetService.create(budgetData);
        setBudgets(prev => [...prev, { ...newBudget, spent: 0 }]);
        toast.success('Budget created successfully');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
// Calculate budget totals for summary
  const budgetSummary = budgets.reduce((acc, budget) => ({
    totalAllocated: acc.totalAllocated + budget.allocated,
    totalSpent: acc.totalSpent + budget.spent,
    totalRemaining: acc.totalRemaining + Math.max(budget.allocated - budget.spent, 0)
  }), { totalAllocated: 0, totalSpent: 0, totalRemaining: 0 });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBudgets} />;
  return (
<div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Management</h1>
        <p className="text-gray-600">Set and track your spending limits by category</p>
        
        {/* Budget Summary Cards */}
        {budgets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Allocated</p>
                  <p className="text-2xl font-bold">{formatCurrency(budgetSummary.totalAllocated)}</p>
                </div>
                <ApperIcon name="Target" size={32} className="text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(budgetSummary.totalSpent)}</p>
                </div>
                <ApperIcon name="TrendingUp" size={32} className="text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Remaining</p>
                  <p className="text-2xl font-bold">{formatCurrency(budgetSummary.totalRemaining)}</p>
                </div>
                <ApperIcon name="Wallet" size={32} className="text-green-200" />
              </div>
            </div>
          </div>
        )}
      </div>
<BudgetManager
        budgets={budgets}
        onSave={handleSaveBudget}
        onDelete={loadBudgets}
      />
    </div>
  );
};

export default Budget;