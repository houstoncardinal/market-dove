import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/appStore';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { mockQuotes } from '@/lib/mockData';
import { PriceTag } from '@/components/PriceTag';

export default function Portfolio() {
  const navigate = useNavigate();
  const { portfolio, removePosition } = useAppStore();

  const portfolioWithQuotes = portfolio.map((pos) => {
    const quote = mockQuotes[pos.symbol] || {
      symbol: pos.symbol,
      price: pos.avgCost,
      change: 0,
      changePct: 0,
    };
    
    const currentValue = quote.price * pos.quantity;
    const costBasis = pos.avgCost * pos.quantity;
    const pnl = currentValue - costBasis;
    const pnlPct = (pnl / costBasis) * 100;

    return {
      ...pos,
      quote,
      currentValue,
      costBasis,
      pnl,
      pnlPct,
    };
  });

  const totalValue = portfolioWithQuotes.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalCost = portfolioWithQuotes.reduce((sum, pos) => sum + pos.costBasis, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Portfolio</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Summary Card */}
        <Card className="glass-card p-6 mb-6">
          <h3 className="text-sm text-muted-foreground mb-2">Total Portfolio Value</h3>
          <PriceTag value={totalValue} size="xl" showChange={false} className="mb-4" />
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cost Basis</p>
              <p className="font-mono font-semibold">${totalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">P/L</p>
              <p className={`font-mono font-semibold ${totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">P/L %</p>
              <p className={`font-mono font-semibold ${totalPnLPct >= 0 ? 'text-success' : 'text-danger'}`}>
                {totalPnLPct >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Positions */}
        {portfolio.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Your portfolio is empty. Add positions from the symbol detail page.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Watchlist
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {portfolioWithQuotes.map((pos) => (
              <Card key={pos.symbol} className="glass-card-hover p-4">
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => navigate(`/symbol/${pos.symbol}`)}
                  >
                    <h3 className="font-bold text-lg">{pos.symbol}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pos.quantity} shares @ ${pos.avgCost.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePosition(pos.symbol)}
                    className="hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                    <p className="font-mono font-semibold">${pos.currentValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">P/L</p>
                    <p className={`font-mono font-semibold ${pos.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                      {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">P/L %</p>
                    <p className={`font-mono font-semibold ${pos.pnlPct >= 0 ? 'text-success' : 'text-danger'}`}>
                      {pos.pnlPct >= 0 ? '+' : ''}{pos.pnlPct.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {pos.notes && (
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    {pos.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
