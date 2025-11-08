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
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const ratingConfig = {
    BUY: {
      bg: 'bg-success/20',
      border: 'border-success/30',
      text: 'text-success-foreground',
      glow: 'hover:shadow-[0_0_20px_hsl(var(--success-glow)/0.3)]',
      icon: TrendingUp,
    },
    SELL: {
      bg: 'bg-danger/20',
      border: 'border-danger/30',
      text: 'text-danger-foreground',
      glow: 'hover:shadow-[0_0_20px_hsl(var(--danger-glow)/0.3)]',
      icon: TrendingDown,
    },
    HOLD: {
      bg: 'bg-warning/20',
      border: 'border-warning/30',
      text: 'text-warning-foreground',
      glow: 'hover:shadow-[0_0_20px_hsl(var(--warning)/0.2)]',
      icon: Minus,
    },
  };

  const config = ratingConfig[rating];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold transition-all',
        config.bg,
        config.border,
        config.text,
        config.glow,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span>{rating}</span>
      {confidence !== undefined && (
        <span className="opacity-75 font-normal">
          {confidence}%
        </span>
      )}
    </div>
  );
}
