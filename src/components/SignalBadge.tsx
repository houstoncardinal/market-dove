import { SignalRating } from '@/types/market';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SignalBadgeProps {
  rating: SignalRating;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function SignalBadge({ rating, confidence, size = 'md', showIcon = true }: SignalBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-1 gap-1',
    md: 'text-xs px-3 py-1.5 gap-1.5',
    lg: 'text-sm px-4 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
  };

  const ratingConfig = {
    BUY: {
      bg: 'bg-success/15',
      border: 'border-success/30',
      text: 'text-success',
      glow: 'shadow-[0_0_12px_hsl(var(--success)/0.2)]',
      icon: TrendingUp,
    },
    SELL: {
      bg: 'bg-danger/15',
      border: 'border-danger/30',
      text: 'text-danger',
      glow: 'shadow-[0_0_12px_hsl(var(--danger)/0.2)]',
      icon: TrendingDown,
    },
    HOLD: {
      bg: 'bg-neutral/15',
      border: 'border-neutral/30',
      text: 'text-neutral',
      glow: 'shadow-[0_0_12px_hsl(var(--neutral)/0.15)]',
      icon: Minus,
    },
  };

  const config = ratingConfig[rating];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border font-mono font-bold uppercase tracking-wide transition-all',
        config.bg,
        config.border,
        config.text,
        config.glow,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} strokeWidth={2.5} />}
      <span>{rating}</span>
      {confidence !== undefined && (
        <span className="opacity-60 font-semibold">
          {confidence}%
        </span>
      )}
    </div>
  );
}
