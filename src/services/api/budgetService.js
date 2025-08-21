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
    
    // Validate input
    if (!budgetData.category || !budgetData.allocated) {
      throw new Error('Category and allocated amount are required');
    }

    // Check for duplicate category
    const existingBudget = this.budgets.find(b => b.category === budgetData.category);
    if (existingBudget) {
      throw new Error(`Budget for ${budgetData.category} already exists`);
    }

    const newId = Math.max(...this.budgets.map(b => b.Id), 0) + 1;
    const newBudget = {
      ...budgetData,
      Id: newId,
      allocated: parseFloat(budgetData.allocated),
      spent: budgetData.spent || 0,
      period: budgetData.period || 'monthly'
    };
    
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

async update(id, budgetData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid budget ID');
    }

    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }

    // Validate allocated amount if provided
    if (budgetData.allocated !== undefined && (isNaN(budgetData.allocated) || budgetData.allocated < 0)) {
      throw new Error('Allocated amount must be a positive number');
    }

    // Process the update
    const updatedData = { ...budgetData };
    if (updatedData.allocated) {
      updatedData.allocated = parseFloat(updatedData.allocated);
    }
    
    this.budgets[index] = { ...this.budgets[index], ...updatedData };
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