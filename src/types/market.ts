export type Candle = {
  t: number; // timestamp (epoch milliseconds)
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
};

export type Quote = {
  symbol: string;
  name?: string;
  exchange?: string;
  price: number;
  change: number;
  changePct: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  marketCap?: number;
  pe?: number;
  eps?: number;
  volume?: number;
  currency?: string;
  lastUpdate?: number;
};

export type AssetMode = 'stock' | 'crypto';

export type DataSource = 'stooq' | 'yahoo' | 'alphavantage';

export type TimeRange = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y';

export type SignalRating = 'BUY' | 'SELL' | 'HOLD';

export type RuleFlag = {
  id: string;
  passed: boolean;
  weight: number;
  note: string;
};

export type SignalResult = {
  rating: SignalRating;
  confidence: number; // 0-100
  flags: RuleFlag[];
  levels: {
    entry?: [number, number];
    stop?: number;
    tp?: number[];
  };
  timestamp: number;
};

export type WatchlistItem = {
  symbol: string;
  addedAt: number;
};

export type PortfolioPosition = {
  symbol: string;
  quantity: number;
  avgCost: number;
  addedAt: number;
  notes?: string;
};

export type Alert = {
  id: string;
  symbol: string;
  type: 'price_cross' | 'rsi_cross' | 'macd_cross' | 'sma_cross' | 'bb_breakout';
  condition: string;
  value: number;
  enabled: boolean;
  createdAt: number;
  lastTriggered?: number;
};

export type IndicatorConfig = {
  sma: number[];
  ema: number[];
  macd: { fast: number; slow: number; signal: number };
  rsi: number;
  bb: { period: number; stdDev: number };
  atr: number;
  showVolume: boolean;
};
