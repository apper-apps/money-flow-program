import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SummaryCard from '@/components/molecules/SummaryCard';
import SpendingChart from '@/components/organisms/SpendingChart';
import TransactionList from '@/components/organisms/TransactionList';
import SavingsGoalCard from '@/components/molecules/SavingsGoalCard';
import TransactionModal from '@/components/organisms/TransactionModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { transactionService } from '@/services/api/transactionService';
import { savingsService } from '@/services/api/savingsService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, savingsData] = await Promise.all([
        transactionService.getAll(),
        savingsService.getGoal()
      ]);
      
      setTransactions(transactionsData);
      setSavingsGoal(savingsData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(prev => 
          prev.map(t => t.Id === editingTransaction.Id ? { ...transactionData, Id: editingTransaction.Id } : t)
        );
        toast.success('Transaction updated successfully');
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions(prev => [newTransaction, ...prev]);
        toast.success('Transaction added successfully');
      }
      setEditingTransaction(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.Id !== id));
      toast.success('Transaction deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleUpdateSavingsGoal = async (newTarget) => {
    try {
      const updatedGoal = await savingsService.updateGoal(newTarget);
      setSavingsGoal(updatedGoal);
      toast.success('Savings goal updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const calculateSummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const summary = calculateSummary();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Monthly Income"
          amount={summary.income}
          icon="TrendingUp"
          trend="up"
          trendValue="12%"
          gradient="from-success to-accent"
          delay={0}
        />
        <SummaryCard
          title="Monthly Expenses"
          amount={summary.expenses}
          icon="TrendingDown"
          trend="down"
          trendValue="8%"
          gradient="from-error to-red-600"
          delay={0.1}
        />
        <SummaryCard
          title="Net Balance"
          amount={summary.balance}
          icon="DollarSign"
          trend={summary.balance >= 0 ? "up" : "down"}
          trendValue={summary.balance >= 0 ? "5%" : "3%"}
          gradient="from-primary to-secondary"
          delay={0.2}
        />
        <SummaryCard
          title="Savings Progress"
          amount={savingsGoal?.current || 0}
          icon="Target"
          trend="up"
          trendValue="15%"
          gradient="from-secondary to-accent"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Chart */}
        <div className="lg:col-span-2">
          <SpendingChart transactions={transactions} />
        </div>

        {/* Savings Goal */}
        <div>
          {savingsGoal && (
            <SavingsGoalCard
              goal={savingsGoal.name}
              current={savingsGoal.current}
              target={savingsGoal.target}
              onUpdateGoal={handleUpdateSavingsGoal}
            />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <TransactionList
          transactions={recentTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAdd={() => setShowTransactionModal(true)}
          showSearch={false}
          title="Recent Transactions"
        />
      </motion.div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Dashboard;