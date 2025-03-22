import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    size = 'md', 
    showValue = false,
    valueFormat = (value, max) => `${Math.round((value / max) * 100)}%`,
    ...props 
  }, ref) => {
    const percentage = (value / max) * 100;
    
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div className="w-full space-y-1.5">
        <div
          ref={ref}
          className={cn(
            "w-full overflow-hidden rounded-full bg-secondary",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div 
            className="h-full bg-primary transition-all" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <div className="text-xs text-muted-foreground text-right">
            {valueFormat(value, max)}
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
