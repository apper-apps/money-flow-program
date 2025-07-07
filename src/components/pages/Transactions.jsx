import { useState, useEffect } from 'react';
import TransactionList from '@/components/organisms/TransactionList';
import TransactionModal from '@/components/organisms/TransactionModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { transactionService } from '@/services/api/transactionService';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load transactions');
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
    setShowModal(true);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  if (loading) return <Loading type="transactions" />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">Track and manage all your financial transactions</p>
      </div>

      <TransactionList
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onAdd={handleAddTransaction}
        showSearch={true}
        showAddButton={true}
        title="All Transactions"
      />

      <TransactionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;