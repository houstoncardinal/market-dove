import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { WatchlistCard } from '@/components/WatchlistCard';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { useAppStore } from '@/store/appStore';
import { fetchQuotes } from '@/lib/api';
import { Quote } from '@/types/market';
import { TrendingUp, TrendingDown, Activity, Filter, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Index() {
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { watchlist, assetMode } = useAppStore();

  useEffect(() => {
    loadQuotes();
  }, [watchlist, assetMode]);

  async function loadQuotes() {
    setLoading(true);
    const symbols = assetMode === 'crypto' 
      ? ['bitcoin', 'ethereum', 'solana', 'matic-network', 'avalanche-2']
      : watchlist.map(w => w.symbol);
    
    const fetchedQuotes = await fetchQuotes(symbols, assetMode);
    setQuotes(fetchedQuotes);
    setLoading(false);
  }

  // Calculate stats
  const stats = {
    total: quotes.length,
    gainers: quotes.filter(q => q.changePct > 0).length,
    losers: quotes.filter(q => q.changePct < 0).length,
    avgChange: quotes.length > 0 
      ? (quotes.reduce((sum, q) => sum + q.changePct, 0) / quotes.length).toFixed(2)
      : '0.00',
  };

  // Filter quotes
  const filteredQuotes = quotes.filter((quote) => {
    if (filter === 'all') return true;
    if (filter === 'gainers') return quote.changePct > 0;
    if (filter === 'losers') return quote.changePct < 0;
    if (filter === 'volatile') return Math.abs(quote.changePct) > 5;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerModal />
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="glass-card glass-card-hover p-4 md:p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total {assetMode === 'crypto' ? 'Coins' : 'Stocks'}</div>
              <Activity className="h-4 w-4 text-primary opacity-50" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-mono">{stats.total}</div>
          </div>

          <div className="glass-card glass-card-hover p-4 md:p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Gainers</div>
              <TrendingUp className="h-4 w-4 text-success opacity-50" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-success">{stats.gainers}</div>
          </div>

          <div className="glass-card glass-card-hover p-4 md:p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-danger/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Losers</div>
              <TrendingDown className="h-4 w-4 text-danger opacity-50" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-danger">{stats.losers}</div>
          </div>

          <div className="glass-card glass-card-hover p-4 md:p-5 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br from-${parseFloat(stats.avgChange) >= 0 ? 'success' : 'danger'}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Avg Change</div>
              <Activity className="h-4 w-4 opacity-50" />
            </div>
            <div className={`text-2xl md:text-3xl font-bold font-mono ${parseFloat(stats.avgChange) >= 0 ? 'text-success' : 'text-danger'}`}>
              {parseFloat(stats.avgChange) >= 0 ? '+' : ''}{stats.avgChange}%
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold">
              {assetMode === 'crypto' ? 'Top Cryptocurrencies' : 'Market Watch'}
            </h2>
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-input/50 border-border h-10">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="gainers">🟢 Gainers Only</SelectItem>
                <SelectItem value="losers">🔴 Losers Only</SelectItem>
                <SelectItem value="volatile">📊 Volatile (±5%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Watchlist */}
        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 mx-auto" />
              <div className="h-4 bg-muted/30 rounded w-48 mx-auto" />
            </div>
            <p className="text-muted-foreground mt-4">
              Loading {assetMode === 'crypto' ? 'crypto' : 'stock'} data...
            </p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No assets match your filter</h3>
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
            {filteredQuotes.map((quote, index) => (
              <div
                key={quote.symbol}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <WatchlistCard
                  quote={quote}
                  sparklineData={[]}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
