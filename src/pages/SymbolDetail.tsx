import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, Activity, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { mockQuotes, generateMockCandles } from '@/lib/mockData';
import { generateSignal } from '@/lib/signals';
import { SMA, EMA, RSI, MACD, BollingerBands } from '@/lib/indicators';
import { PriceTag } from '@/components/PriceTag';
import { SignalBadge } from '@/components/SignalBadge';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { TimeRange } from '@/types/market';
import { cn } from '@/lib/utils';

export default function SymbolDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');
  const [showIndicators, setShowIndicators] = useState({
    sma20: true,
    sma50: true,
    sma200: false,
    rsi: false,
    macd: false,
    bb: false,
  });

  const quote = symbol ? mockQuotes[symbol] : null;
  
  const candles = useMemo(() => {
    if (!symbol) return [];
    const days: Record<TimeRange, number> = {
      '1D': 1,
      '5D': 5,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '5Y': 1825,
    };
    return generateMockCandles(symbol, days[timeRange]);
  }, [symbol, timeRange]);

  const signal = useMemo(() => generateSignal(candles), [candles]);

  const chartData = useMemo(() => {
    const sma20 = SMA(candles, 20);
    const sma50 = SMA(candles, 50);
    const sma200 = SMA(candles, 200);
    const rsi = RSI(candles, 14);
    const macd = MACD(candles, 12, 26, 9);
    const bb = BollingerBands(candles, 20, 2);

    return candles.map((candle, i) => ({
      date: candle.t,
      price: candle.c,
      volume: candle.v,
      sma20: sma20[i],
      sma50: sma50[i],
      sma200: sma200[i],
      rsi: rsi[i],
      macd: macd.line[i],
      macdSignal: macd.signal[i],
      macdHist: macd.histogram[i],
      bbUpper: bb.upper[i],
      bbMiddle: bb.middle[i],
      bbLower: bb.lower[i],
    }));
  }, [candles]);

  if (!quote || !symbol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card p-8 text-center max-w-md">
          <p className="text-muted-foreground mb-4">Symbol not found</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Watchlist
          </Button>
        </Card>
      </div>
    );
  }

  const isPositive = quote.change > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left: Symbol Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{symbol}</h1>
                <SignalBadge rating={signal.rating} confidence={signal.confidence} size="md" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                {quote.name} • {quote.exchange}
              </p>
              
              <div className="flex items-baseline gap-4">
                <PriceTag
                  value={quote.price}
                  change={quote.change}
                  changePct={quote.changePct}
                  size="xl"
                  showChange={false}
                />
                <div className={cn(
                  "flex items-center gap-1 font-mono text-lg font-semibold",
                  isPositive ? "text-success" : "text-danger"
                )}>
                  {isPositive && '+'}{quote.change.toFixed(2)} ({isPositive && '+'}{quote.changePct.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="grid grid-cols-2 gap-3 md:min-w-[300px]">
              {[
                { label: 'Market Cap', value: `$${((quote.marketCap || 0) / 1e9).toFixed(1)}B`, icon: DollarSign },
                { label: 'P/E Ratio', value: quote.pe?.toFixed(2) || 'N/A', icon: Activity },
                { label: 'Day High', value: `$${quote.high?.toFixed(2) || 'N/A'}`, icon: TrendingUp },
                { label: 'Day Low', value: `$${quote.low?.toFixed(2) || 'N/A'}`, icon: BarChart3 },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                      {stat.label}
                    </p>
                  </div>
                  <p className="font-mono font-bold text-sm">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={cn(
                "font-mono font-semibold min-w-[60px]",
                timeRange === range && 'bg-primary shadow-lg shadow-primary/20'
              )}
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <Card className="glass-card p-4 md:p-6 mb-6">
          <div className="h-[400px] md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  domain={['auto', 'auto']}
                  style={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    padding: '12px',
                  }}
                  labelFormatter={(value) => format(new Date(value), 'PPP')}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#colorPrice)"
                  name="Price"
                />
                
                {showIndicators.sma20 && (
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={false}
                    name="SMA 20"
                  />
                )}
                
                {showIndicators.sma50 && (
                  <Line
                    type="monotone"
                    dataKey="sma50"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    dot={false}
                    name="SMA 50"
                  />
                )}
                
                {showIndicators.sma200 && (
                  <Line
                    type="monotone"
                    dataKey="sma200"
                    stroke="hsl(var(--danger))"
                    strokeWidth={2}
                    dot={false}
                    name="SMA 200"
                  />
                )}

                {showIndicators.bb && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="bbUpper"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                      name="BB Upper"
                    />
                    <Line
                      type="monotone"
                      dataKey="bbLower"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                      name="BB Lower"
                    />
                  </>
                )}

                {signal.levels.entry && (
                  <ReferenceLine
                    y={signal.levels.entry[0]}
                    stroke="hsl(var(--success))"
                    strokeDasharray="3 3"
                    label={{ value: 'Entry', fill: 'hsl(var(--success))', fontSize: 12 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Indicator Toggles */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/30">
            {[
              { key: 'sma20', label: 'SMA 20', color: 'success' },
              { key: 'sma50', label: 'SMA 50', color: 'warning' },
              { key: 'sma200', label: 'SMA 200', color: 'danger' },
              { key: 'bb', label: 'Bollinger Bands', color: 'muted' },
            ].map((indicator) => (
              <Button
                key={indicator.key}
                size="sm"
                variant={showIndicators[indicator.key as keyof typeof showIndicators] ? 'default' : 'outline'}
                onClick={() => setShowIndicators({ 
                  ...showIndicators, 
                  [indicator.key]: !showIndicators[indicator.key as keyof typeof showIndicators] 
                })}
                className={cn(
                  "font-mono text-xs",
                  showIndicators[indicator.key as keyof typeof showIndicators] && `bg-${indicator.color} hover:bg-${indicator.color}/90`
                )}
              >
                {indicator.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Signal Details */}
        <Card className="glass-card p-6 mb-6">
          <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Signal Analysis
          </h3>
          
          {/* Trade Levels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {signal.levels.entry && (
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Entry Zone</p>
                <p className="font-mono font-bold text-lg text-success">
                  ${signal.levels.entry[0].toFixed(2)} - ${signal.levels.entry[1].toFixed(2)}
                </p>
              </div>
            )}
            {signal.levels.stop && (
              <div className="p-4 rounded-lg bg-danger/10 border border-danger/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Stop Loss</p>
                <p className="font-mono font-bold text-lg text-danger">
                  ${signal.levels.stop.toFixed(2)}
                </p>
              </div>
            )}
            {signal.levels.tp && signal.levels.tp.length > 0 && (
              <>
                <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Take Profit 1</p>
                  <p className="font-mono font-bold text-lg text-success">
                    ${signal.levels.tp[0].toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Take Profit 2</p>
                  <p className="font-mono font-bold text-lg text-success">
                    ${signal.levels.tp[1].toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Rule Checks */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Rule Analysis</h4>
            {signal.flags.map((flag, idx) => (
              <div
                key={flag.id}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  flag.passed
                    ? 'bg-success/10 border-success/30 hover:bg-success/15'
                    : 'bg-muted/10 border-border/30 hover:bg-muted/15'
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                      flag.passed ? 'bg-success shadow-lg shadow-success/50' : 'bg-muted-foreground'
                    )}
                  />
                  <p className="text-sm flex-1">
                    {flag.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
