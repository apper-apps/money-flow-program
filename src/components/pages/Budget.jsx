import { useState, useEffect } from 'react';
import BudgetManager from '@/components/organisms/BudgetManager';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { budgetService } from '@/services/api/budgetService';
import { transactionService } from '@/services/api/transactionService';
import { toast } from 'react-toastify';

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBudgets} />;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Budget Management</h1>
        <p className="text-gray-600">Set and track your spending limits by category</p>
      </div>

      <BudgetManager
        budgets={budgets}
        onSave={handleSaveBudget}
      />
    </div>
  );
};

export default Budget;