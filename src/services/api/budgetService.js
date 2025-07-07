import budgetsData from '@/services/mockData/budgets.json';

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.budgets.map(budget => ({ ...budget }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const budget = this.budgets.find(b => b.Id === id);
    if (!budget) {
      throw new Error('Budget not found');
    }
    return { ...budget };
  }

  async create(budgetData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.budgets.map(b => b.Id), 0) + 1;
    const newBudget = {
      ...budgetData,
      Id: newId,
      spent: 0,
      period: 'monthly'
    };
    
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, budgetData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }
    
    this.budgets[index] = { ...this.budgets[index], ...budgetData };
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }
    
    this.budgets.splice(index, 1);
    return true;
  }
}

export const budgetService = new BudgetService();