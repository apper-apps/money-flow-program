import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import TemplateModal from '@/components/organisms/TemplateModal';
import { templateService } from '@/services/api/templateService';
import { transactionService } from '@/services/api/transactionService';
import { formatCurrency } from '@/utils/formatters';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [processingTemplate, setProcessingTemplate] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      if (editingTemplate) {
        await templateService.update(editingTemplate.Id, templateData);
        setTemplates(prev => 
          prev.map(t => t.Id === editingTemplate.Id ? { ...templateData, Id: editingTemplate.Id } : t)
        );
        toast.success('Template updated successfully');
      } else {
        const newTemplate = await templateService.create(templateData);
        setTemplates(prev => [newTemplate, ...prev]);
        toast.success('Template created successfully');
      }
      setEditingTemplate(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await templateService.delete(id);
      setTemplates(prev => prev.filter(t => t.Id !== id));
      toast.success('Template deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setShowModal(true);
  };

  const handleApplyTemplate = async (template) => {
    setProcessingTemplate(template.Id);
    try {
      const transaction = await transactionService.createFromTemplate(template);
      toast.success(`Transaction created from template: ${formatCurrency(transaction.amount)}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingTemplate(null);
    }
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly'
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyIcon = (frequency) => {
    const icons = {
      daily: 'Calendar',
      weekly: 'CalendarDays',
      monthly: 'CalendarRange',
      yearly: 'CalendarClock'
    };
    return icons[frequency] || 'Calendar';
  };

  if (loading) return <Loading type="templates" />;
  if (error) return <Error message={error} onRetry={loadTemplates} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Templates</h1>
          <p className="text-gray-600">Create recurring transaction templates for regular expenses</p>
        </div>
        <Button onClick={handleAddTemplate} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Empty
          title="No templates yet"
          description="Create your first recurring transaction template to automate regular expenses."
          action={{
            label: "Create Template",
            onClick: handleAddTemplate
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.Id} className="premium-hover">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      template.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <ApperIcon name={getFrequencyIcon(template.frequency)} size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.description}</CardTitle>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="h-8 w-8 p-0"
                    >
                      <ApperIcon name="Pencil" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.Id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className={`font-semibold ${
                      template.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {template.type === 'expense' ? '-' : '+'}{formatCurrency(template.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Frequency</span>
                    <span className="text-sm font-medium">{getFrequencyLabel(template.frequency)}</span>
                  </div>
                  {template.nextDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Due</span>
                      <span className="text-sm font-medium">
                        {new Date(template.nextDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyTemplate(template)}
                    disabled={processingTemplate === template.Id}
                    className="w-full"
                  >
                    {processingTemplate === template.Id ? (
                      <>
                        <ApperIcon name="Loader2" size={14} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Play" size={14} className="mr-2" />
                        Apply Template
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        template={editingTemplate}
      />
    </div>
  );
};

export default Templates;