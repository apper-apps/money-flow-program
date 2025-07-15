import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    return format(new Date(date), 'MMM dd, yyyy');
  }
  return format(date, 'MMM dd, yyyy');
};

export const formatShortDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    return format(new Date(date), 'MMM dd');
}
  return format(date, 'MMM dd');
};

export const formatDateForChart = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    return format(new Date(date), 'MMM dd');
  }
  return format(date, 'MMM dd');
};

export const formatPercentage = (value) => {
  if (typeof value !== 'number') return '0%';
  return `${Math.round(value)}%`;
};
export const calculatePercentage = (current, target) => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};