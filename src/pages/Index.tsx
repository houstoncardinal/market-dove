import { useAppStore } from '@/store/appStore';
import { WatchlistCard } from '@/components/WatchlistCard';
import { SymbolSearch } from '@/components/SymbolSearch';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { mockQuotes, generateMockCandles } from '@/lib/mockData';
import { generateSignal } from '@/lib/signals';
import { Button } from '@/components/ui/button';
import { Settings, PieChart, Bell, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Index() {
  const navigate = useNavigate();
  const { watchlist } = useAppStore();
  const [filter, setFilter] = useState<string>('all');

  // Generate signals for watchlist items
  const watchlistData = watchlist.map((item) => {
    const quote = mockQuotes[item.symbol] || {
      symbol: item.symbol,
      name: item.symbol,
      price: 100,
      change: 0,
      changePct: 0,
      lastUpdate: Date.now(),
    };

    const candles = generateMockCandles(item.symbol, 365);
    const signal = generateSignal(candles);
    const sparklineData = candles.slice(-30).map((c) => ({ value: c.c }));

    return { quote, signal, sparklineData };
  });

  // Filter watchlist based on selected filter
  const filteredData = watchlistData.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'bullish') return item.signal.rating === 'BUY';
    if (filter === 'bearish') return item.signal.rating === 'SELL';
    if (filter === 'oversold') {
      // Check if any flag mentions RSI
      return item.signal.flags.some(f => f.id === 'mean_reversion' && f.passed);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerModal />
      
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Cardinal Quant</h1>
                <p className="text-xs text-muted-foreground">Advanced Market Signals</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/alerts')}
                className="hover:bg-primary/10"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/portfolio')}
                className="hover:bg-primary/10"
              >
                <PieChart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/settings')}
                className="hover:bg-primary/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <SymbolSearch />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Watchlist</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-input/50 border-border/50">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Signals</SelectItem>
              <SelectItem value="bullish">Bullish Only</SelectItem>
              <SelectItem value="bearish">Bearish Only</SelectItem>
              <SelectItem value="oversold">Oversold (RSI)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredData.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">
              No symbols match your filter. Try a different filter or add more symbols to your watchlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <WatchlistCard
                key={item.quote.symbol}
                quote={item.quote}
                signal={item.signal}
                sparklineData={item.sparklineData}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
