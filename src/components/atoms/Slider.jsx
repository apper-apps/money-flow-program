import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Slider = forwardRef(({ 
  className, 
  value, 
  min = 0, 
  max = 100, 
  step = 1, 
  onChange,
  ...props 
}, ref) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative">
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
        {...props}
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