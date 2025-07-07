import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { cn } from '@/utils/cn';

const FormField = ({ 
  label, 
  type = 'text', 
  error, 
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className={error ? 'text-error' : ''}>{label}</Label>
      )}
      {type === 'select' ? (
        <Select error={error} {...props}>
          {children}
        </Select>
      ) : (
        <Input type={type} error={error} {...props} />
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;