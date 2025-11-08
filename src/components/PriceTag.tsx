import { Quote } from '@/types/market';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  value: number;
  change?: number;
  changePct?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showChange?: boolean;
  className?: string;
}

export function PriceTag({
  value,
  change,
  changePct,
  size = 'md',
  showChange = true,
  className,
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const isPositive = change ? change > 0 : false;
  const isNegative = change ? change < 0 : false;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-mono font-bold', sizeClasses[size])}>
        ${value.toFixed(2)}
      </span>
      {showChange && change !== undefined && changePct !== undefined && (
        <span
          className={cn(
            'font-mono text-sm font-medium',
            isPositive && 'text-success',
            isNegative && 'text-danger'
          )}
        >
          {isPositive && '+'}
          {change.toFixed(2)} ({isPositive && '+'}
          {changePct.toFixed(2)}%)
        </span>
      )}
    </div>
  );
}
