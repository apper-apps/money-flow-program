import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';

const TemplateModal = ({ isOpen, onClose, onSave, template }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Business',
    'Personal Care',
    'Gifts & Donations',
    'Investments',
    'Other'
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  useEffect(() => {
    if (template) {
      setFormData({
        description: template.description || '',
        amount: template.amount?.toString() || '',
        type: template.type || 'expense',
        category: template.category || '',
        frequency: template.frequency || 'monthly',
        startDate: template.startDate ? template.startDate.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [template, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const templateData = {
        ...formData,
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        nextDate: formData.startDate,
        isActive: true
      };

      await onSave(templateData);
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {template ? 'Edit Template' : 'Create Template'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Description"
              error={errors.description}
              required
            >
              <Input
                type="text"
                placeholder="e.g., Monthly rent payment"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Amount"
                error={errors.amount}
                required
              >
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  error={!!errors.amount}
                />
              </FormField>

              <FormField label="Type">
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Select>
              </FormField>
            </div>

            <FormField
              label="Category"
              error={errors.category}
              required
            >
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                error={!!errors.category}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Frequency">
              <Select
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
              >
                {frequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Start Date"
              error={errors.startDate}
              required
            >
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={!!errors.startDate}
              />
            </FormField>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  template ? 'Update Template' : 'Create Template'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TemplateModal;