import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Slider = forwardRef(({ 
  className, 
  value, 
  min = 0, 
  max = 100, 
  step = 1, 
  onChange,
  showValue = false,
  formatValue = (val) => val.toString(),
  ...htmlProps 
}, ref) => {
  // Separate valid HTML input attributes from custom component props
  const { 
    showValue: _showValue, 
    formatValue: _formatValue, 
    onChange: _onChange,
    ...validInputProps 
  } = { showValue, formatValue, onChange, ...htmlProps };
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative">
      {showValue && (
        <div 
          className="absolute -top-8 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
          style={{ left: `${percentage}%` }}
        >
          <div className="text-center font-medium">
            {formatValue(value)}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
        </div>
      )}
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        className={cn(
          'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb',
          className
        )}
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #7c3aed ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
        }}
{...validInputProps}
      />
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;