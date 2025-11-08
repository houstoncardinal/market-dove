import { useAppStore } from '@/store/appStore';
import { WatchlistCard } from '@/components/WatchlistCard';
import { Header } from '@/components/Header';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { mockQuotes, generateMockCandles } from '@/lib/mockData';
import { generateSignal } from '@/lib/signals';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, LayoutGrid, LayoutList } from 'lucide-react';

export default function Index() {
  const { watchlist } = useAppStore();
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      return item.signal.flags.some(f => f.id === 'mean_reversion' && f.passed);
    }
    return true;
  });

  // Stats calculation
  const stats = {
    total: watchlistData.length,
    bullish: watchlistData.filter(d => d.signal.rating === 'BUY').length,
    bearish: watchlistData.filter(d => d.signal.rating === 'SELL').length,
    gainers: watchlistData.filter(d => d.quote.change > 0).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerModal />
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'primary' },
            { label: 'Bullish', value: stats.bullish, color: 'success' },
            { label: 'Bearish', value: stats.bearish, color: 'danger' },
            { label: 'Gainers', value: stats.gainers, color: 'success' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl md:text-3xl font-bold font-mono tracking-tight text-${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold">Market Watch</h2>
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-input/50 border-border h-10">
                <SelectValue placeholder="Filter signals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Signals</SelectItem>
                <SelectItem value="bullish">🟢 Bullish Only</SelectItem>
                <SelectItem value="bearish">🔴 Bearish Only</SelectItem>
                <SelectItem value="oversold">📉 Oversold (RSI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Watchlist Grid */}
        {filteredData.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No symbols match your filter</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filter or add more symbols to your watchlist.
              </p>
              <Button onClick={() => setFilter('all')} variant="outline">
                Clear Filter
              </Button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredData.map((item, idx) => (
              <div
                key={item.quote.symbol}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <WatchlistCard
                  quote={item.quote}
                  signal={item.signal}
                  sparklineData={item.sparklineData}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
