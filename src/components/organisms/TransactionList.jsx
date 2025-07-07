import { useState } from 'react';
import { motion } from 'framer-motion';
import TransactionItem from '@/components/molecules/TransactionItem';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Empty from '@/components/ui/Empty';

const TransactionList = ({ 
  transactions = [], 
  onEdit, 
  onDelete, 
  onAdd,
  showSearch = true,
  showAddButton = true,
  title = 'Recent Transactions'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(transactions.map(t => t.category))];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {showAddButton && (
            <Button onClick={onAdd} className="bg-gradient-to-r from-primary to-secondary">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Transaction
            </Button>
          )}
        </div>
        <Empty type="transactions" onAction={onAdd} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {showAddButton && (
          <Button onClick={onAdd} className="bg-gradient-to-r from-primary to-secondary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Transaction
          </Button>
        )}
      </div>

      {showSearch && (
        <SearchBar
          onSearch={setSearchTerm}
          onFilter={setSelectedCategory}
          categories={categories}
        />
      )}

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No transactions found matching your criteria</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TransactionItem
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;