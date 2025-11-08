import { Quote, SignalResult } from '@/types/market';
import { SignalBadge } from './SignalBadge';
import { PriceTag } from './PriceTag';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

interface WatchlistCardProps {
  quote: Quote;
  signal?: SignalResult;
  sparklineData?: Array<{ value: number }>;
}

export function WatchlistCard({ quote, signal, sparklineData }: WatchlistCardProps) {
  const navigate = useNavigate();
  const { removeFromWatchlist } = useAppStore();
  const isPositive = quote.change > 0;
  const isNegative = quote.change < 0;

  return (
    <div
      className="group relative glass-card-hover p-5 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/symbol/${quote.symbol}`)}
    >
      {/* Background Gradient Effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        isPositive && "bg-gradient-to-br from-success/5 to-transparent",
        isNegative && "bg-gradient-to-br from-danger/5 to-transparent"
      )} />

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all h-7 w-7 hover:bg-danger/10 hover:text-danger z-10"
        onClick={(e) => {
          e.stopPropagation();
          removeFromWatchlist(quote.symbol);
        }}
      >
        <X className="h-3.5 w-3.5" />
      </Button>

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-xl tracking-tight">{quote.symbol}</h3>
              <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold",
                isPositive && "bg-success/15 text-success",
                isNegative && "bg-danger/15 text-danger",
                !isPositive && !isNegative && "bg-muted/30 text-muted-foreground"
              )}>
                {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : isNegative ? <TrendingDown className="h-2.5 w-2.5" /> : null}
                {isPositive && '+'}{quote.changePct.toFixed(2)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate font-medium">{quote.name}</p>
          </div>
          {signal && (
            <SignalBadge
              rating={signal.rating}
              confidence={signal.confidence}
              size="sm"
              showIcon={false}
            />
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-3xl tracking-tight">
              ${quote.price.toFixed(2)}
            </span>
          </div>
          <div className={cn(
            "font-mono text-sm font-medium flex items-center gap-1",
            isPositive && "text-success",
            isNegative && "text-danger",
            !isPositive && !isNegative && "text-muted-foreground"
          )}>
            {isPositive && '+'}${Math.abs(quote.change).toFixed(2)}
            <span className="text-xs opacity-75">today</span>
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-16 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`gradient-${quote.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))'}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))'}
                  strokeWidth={2}
                  fill={`url(#gradient-${quote.symbol})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Volume</p>
            <p className="font-mono text-xs font-semibold">{((quote.open || 0) * 1000000).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Market Cap</p>
            <p className="font-mono text-xs font-semibold">${((quote.marketCap || 0) / 1e9).toFixed(1)}B</p>
          </div>
        </div>
      </div>
    </div>
  );
}
