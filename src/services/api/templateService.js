import templatesData from '@/services/mockData/templates.json';

class TemplateService {
  constructor() {
    this.templates = [...templatesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.templates].sort((a, b) => a.Id - b.Id);
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const template = this.templates.find(t => t.Id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  }

  async create(templateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.templates.map(t => t.Id), 0) + 1;
    const newTemplate = {
      ...templateData,
      Id: newId,
      createdAt: new Date().toISOString(),
      isActive: templateData.isActive !== undefined ? templateData.isActive : true
    };
    
    this.templates.push(newTemplate);
    return { ...newTemplate };
  }

  async update(id, templateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.templates.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    this.templates[index] = { 
      ...this.templates[index], 
      ...templateData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    return { ...this.templates[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.templates.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    this.templates.splice(index, 1);
    return true;
  }

  async getActiveTemplates() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.templates.filter(t => t.isActive);
  }

  calculateNextDate(template) {
    const startDate = new Date(template.startDate || template.nextDate);
    const frequency = template.frequency;
    
    switch (frequency) {
      case 'daily':
        startDate.setDate(startDate.getDate() + 1);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'yearly':
        startDate.setFullYear(startDate.getFullYear() + 1);
        break;
      default:
        throw new Error(`Unsupported frequency: ${frequency}`);
    }
    
    return startDate.toISOString().split('T')[0];
  }

  async processTemplate(template) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const transaction = {
      description: template.description,
      amount: template.amount,
      type: template.type,
      category: template.category,
      date: template.nextDate || template.startDate,
      templateId: template.Id
    };

    // Update template's next date
    const nextDate = this.calculateNextDate(template);
    await this.update(template.Id, { nextDate });

    return transaction;
  }
}

export const templateService = new TemplateService();