import savingsGoalData from '@/services/mockData/savingsGoal.json';

class SavingsService {
  constructor() {
    this.savingsGoal = { ...savingsGoalData };
  }

  async getGoal() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.savingsGoal };
  }

  async updateGoal(newTarget) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    this.savingsGoal.target = newTarget;
    return { ...this.savingsGoal };
  }

  async updateCurrent(newCurrent) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    this.savingsGoal.current = newCurrent;
    return { ...this.savingsGoal };
  }

  async addToSavings(amount) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    this.savingsGoal.current += amount;
    return { ...this.savingsGoal };
  }
}

export const savingsService = new SavingsService();