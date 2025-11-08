import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAppStore } from '@/store/appStore';
import { Trash2, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { mockQuotes } from '@/lib/mockData';
import { cn } from '@/lib/utils';

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
  const isPositive = totalPnL >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <PieChart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Portfolio</h1>
        </div>

        {/* Summary Card */}
        <Card className="glass-card p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className={cn(
            "absolute inset-0 opacity-5",
            isPositive ? "bg-gradient-to-br from-success to-transparent" : "bg-gradient-to-br from-danger to-transparent"
          )} />
          
          <div className="relative">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wide font-medium mb-3">
              Total Portfolio Value
            </h3>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl md:text-5xl font-bold font-mono tracking-tight">
                ${totalValue.toFixed(2)}
              </span>
              <div className={cn(
                "flex items-center gap-1 font-mono text-xl font-semibold",
                isPositive ? "text-success" : "text-danger"
              )}>
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {isPositive && '+'}{totalPnLPct.toFixed(2)}%
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border/30">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Cost Basis</p>
                <p className="font-mono font-bold text-lg">${totalCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Total P/L</p>
                <p className={cn(
                  "font-mono font-bold text-lg",
                  isPositive ? "text-success" : "text-danger"
                )}>
                  {isPositive && '+'}{totalPnL.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Positions</p>
                <p className="font-mono font-bold text-lg">{portfolio.length}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Positions */}
        {portfolio.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto">
                <PieChart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Your portfolio is empty</h3>
              <p className="text-muted-foreground text-sm">
                Add positions from the symbol detail page to start tracking your investments.
              </p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Browse Watchlist
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {portfolioWithQuotes.map((pos, idx) => {
              const isPosPositive = pos.pnl >= 0;
              return (
                <Card 
                  key={pos.symbol} 
                  className="glass-card-hover p-5 relative overflow-hidden group animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    isPosPositive ? "bg-gradient-to-br from-success/5 to-transparent" : "bg-gradient-to-br from-danger/5 to-transparent"
                  )} />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="flex-1 cursor-pointer" 
                        onClick={() => navigate(`/symbol/${pos.symbol}`)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-xl">{pos.symbol}</h3>
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase",
                            isPosPositive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                          )}>
                            {isPosPositive ? '+' : ''}{pos.pnlPct.toFixed(2)}%
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {pos.quantity} shares @ ${pos.avgCost.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePosition(pos.symbol)}
                        className="hover:bg-danger/10 hover:text-danger h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Current Value</p>
                        <p className="font-mono font-bold">${pos.currentValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Profit/Loss</p>
                        <p className={cn(
                          "font-mono font-bold",
                          isPosPositive ? "text-success" : "text-danger"
                        )}>
                          {isPosPositive && '+'}{pos.pnl.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Return</p>
                        <p className={cn(
                          "font-mono font-bold",
                          isPosPositive ? "text-success" : "text-danger"
                        )}>
                          {isPosPositive && '+'}{pos.pnlPct.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    {pos.notes && (
                      <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/30 italic">
                        {pos.notes}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
