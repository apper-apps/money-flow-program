import transactionsData from '@/services/mockData/transactions.json';

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Sort by date, newest first
    return this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const transaction = this.transactions.find(t => t.Id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return { ...transaction };
  }

  async create(transactionData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.transactions.map(t => t.Id), 0) + 1;
    const newTransaction = {
      ...transactionData,
      Id: newId,
      date: transactionData.date || new Date().toISOString()
    };
    
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.transactions.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    this.transactions[index] = { ...this.transactions[index], ...transactionData };
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.transactions.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    this.transactions.splice(index, 1);
    return true;
  }
}

export const transactionService = new TransactionService();