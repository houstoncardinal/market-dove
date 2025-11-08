import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { mockQuotes, generateMockCandles } from '@/lib/mockData';
import { generateSignal } from '@/lib/signals';
import { SMA, EMA, RSI, MACD, BollingerBands, ATR, VWAP } from '@/lib/indicators';
import { PriceTag } from '@/components/PriceTag';
import { SignalBadge } from '@/components/SignalBadge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { TimeRange } from '@/types/market';

export default function SymbolDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');
  const [showIndicators, setShowIndicators] = useState({
    sma20: true,
    sma50: true,
    sma200: false,
    rsi: true,
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
        <Card className="glass-card p-8 text-center">
          <p className="text-muted-foreground">Symbol not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Watchlist
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{symbol}</h1>
                <SignalBadge rating={signal.rating} confidence={signal.confidence} />
              </div>
              <p className="text-sm text-muted-foreground">{quote.name} • {quote.exchange}</p>
            </div>
          </div>
          
          <PriceTag
            value={quote.price}
            change={quote.change}
            changePct={quote.changePct}
            size="xl"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'bg-primary' : ''}
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <Card className="glass-card p-4 mb-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  labelFormatter={(value) => format(new Date(value), 'PPP')}
                />
                <Legend />
                
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Price"
                />
                
                {showIndicators.sma20 && (
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="hsl(var(--success))"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="5 5"
                    name="SMA 20"
                  />
                )}
                
                {showIndicators.sma50 && (
                  <Line
                    type="monotone"
                    dataKey="sma50"
                    stroke="hsl(var(--warning))"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="5 5"
                    name="SMA 50"
                  />
                )}
                
                {showIndicators.sma200 && (
                  <Line
                    type="monotone"
                    dataKey="sma200"
                    stroke="hsl(var(--danger))"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="5 5"
                    name="SMA 200"
                  />
                )}

                {showIndicators.bb && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="bbUpper"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1}
                      dot={false}
                      name="BB Upper"
                    />
                    <Line
                      type="monotone"
                      dataKey="bbLower"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1}
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
                    label="Entry"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Indicator Toggles */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              size="sm"
              variant={showIndicators.sma20 ? 'default' : 'outline'}
              onClick={() => setShowIndicators({ ...showIndicators, sma20: !showIndicators.sma20 })}
            >
              SMA 20
            </Button>
            <Button
              size="sm"
              variant={showIndicators.sma50 ? 'default' : 'outline'}
              onClick={() => setShowIndicators({ ...showIndicators, sma50: !showIndicators.sma50 })}
            >
              SMA 50
            </Button>
            <Button
              size="sm"
              variant={showIndicators.sma200 ? 'default' : 'outline'}
              onClick={() => setShowIndicators({ ...showIndicators, sma200: !showIndicators.sma200 })}
            >
              SMA 200
            </Button>
            <Button
              size="sm"
              variant={showIndicators.bb ? 'default' : 'outline'}
              onClick={() => setShowIndicators({ ...showIndicators, bb: !showIndicators.bb })}
            >
              Bollinger Bands
            </Button>
          </div>
        </Card>

        {/* Signal Details */}
        <Card className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Signal Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {signal.levels.entry && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Entry Zone</p>
                <p className="font-mono font-semibold text-success">
                  ${signal.levels.entry[0].toFixed(2)} - ${signal.levels.entry[1].toFixed(2)}
                </p>
              </div>
            )}
            {signal.levels.stop && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stop Loss</p>
                <p className="font-mono font-semibold text-danger">
                  ${signal.levels.stop.toFixed(2)}
                </p>
              </div>
            )}
            {signal.levels.tp && signal.levels.tp.length > 0 && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Take Profit 1</p>
                  <p className="font-mono font-semibold text-success">
                    ${signal.levels.tp[0].toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Take Profit 2</p>
                  <p className="font-mono font-semibold text-success">
                    ${signal.levels.tp[1].toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Rule Checks</h4>
            {signal.flags.map((flag) => (
              <div
                key={flag.id}
                className={`p-3 rounded-lg border ${
                  flag.passed
                    ? 'bg-success/10 border-success/30'
                    : 'bg-muted/20 border-border/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      flag.passed ? 'bg-success' : 'bg-muted-foreground'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {flag.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
            <p className="font-mono font-bold">${((quote.marketCap || 0) / 1e9).toFixed(1)}B</p>
          </Card>
          <Card className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">P/E Ratio</p>
            <p className="font-mono font-bold">{quote.pe?.toFixed(2) || 'N/A'}</p>
          </Card>
          <Card className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Day High</p>
            <p className="font-mono font-bold">${quote.high?.toFixed(2) || 'N/A'}</p>
          </Card>
          <Card className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Day Low</p>
            <p className="font-mono font-bold">${quote.low?.toFixed(2) || 'N/A'}</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
