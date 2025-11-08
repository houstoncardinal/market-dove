import { Quote, SignalResult } from '@/types/market';
import { SignalBadge } from './SignalBadge';
import { PriceTag } from './PriceTag';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';

interface WatchlistCardProps {
  quote: Quote;
  signal?: SignalResult;
  sparklineData?: Array<{ value: number }>;
}

export function WatchlistCard({ quote, signal, sparklineData }: WatchlistCardProps) {
  const navigate = useNavigate();
  const { removeFromWatchlist } = useAppStore();
  const isPositive = quote.change > 0;

  return (
    <div
      className="glass-card-hover p-4 cursor-pointer relative group"
      onClick={() => navigate(`/symbol/${quote.symbol}`)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
        onClick={(e) => {
          e.stopPropagation();
          removeFromWatchlist(quote.symbol);
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">{quote.symbol}</h3>
          <p className="text-xs text-muted-foreground">{quote.name}</p>
        </div>
        {signal && (
          <SignalBadge
            rating={signal.rating}
            confidence={signal.confidence}
            size="sm"
          />
        )}
      </div>

      <PriceTag
        value={quote.price}
        change={quote.change}
        changePct={quote.changePct}
        size="lg"
      />

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Vol: {(quote.open || 0).toFixed(2)}</span>
        <span>Mkt Cap: ${((quote.marketCap || 0) / 1e9).toFixed(1)}B</span>
      </div>
    </div>
  );
}
