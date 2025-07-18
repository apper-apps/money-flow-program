import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  className, 
  children, 
  error,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
          error && 'border-error focus:ring-error',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = 'Select';

export default Select;