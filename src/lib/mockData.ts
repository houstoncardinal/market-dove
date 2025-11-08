import { Candle, Quote } from '@/types/market';

// Generate realistic mock candlestick data
export function generateMockCandles(symbol: string, days: number = 365): Candle[] {
  const candles: Candle[] = [];
  let basePrice = 150 + Math.random() * 200;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = days; i >= 0; i--) {
    const t = now - i * dayMs;
    const volatility = 0.02;
    const trend = 0.0005;

    const change = (Math.random() - 0.48) * basePrice * volatility + basePrice * trend;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * basePrice * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * basePrice * volatility * 0.5;
    const volume = Math.floor(5000000 + Math.random() * 15000000);

    candles.push({
      t,
      o: Number(open.toFixed(2)),
      h: Number(high.toFixed(2)),
      l: Number(low.toFixed(2)),
      c: Number(close.toFixed(2)),
      v: volume,
    });

    basePrice = close;
  }

  return candles;
}

export const mockQuotes: Record<string, Quote> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    price: 178.42,
    change: 2.35,
    changePct: 1.33,
    open: 176.50,
    high: 179.20,
    low: 175.80,
    prevClose: 176.07,
    marketCap: 2800000000000,
    pe: 29.5,
    eps: 6.05,
    currency: 'USD',
    lastUpdate: Date.now(),
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    price: 412.65,
    change: -1.85,
    changePct: -0.45,
    open: 414.00,
    high: 415.30,
    low: 411.20,
    prevClose: 414.50,
    marketCap: 3100000000000,
    pe: 36.2,
    eps: 11.40,
    currency: 'USD',
    lastUpdate: Date.now(),
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    price: 242.84,
    change: 8.92,
    changePct: 3.81,
    open: 235.50,
    high: 245.60,
    low: 234.20,
    prevClose: 233.92,
    marketCap: 770000000000,
    pe: 72.4,
    eps: 3.35,
    currency: 'USD',
    lastUpdate: Date.now(),
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    price: 875.28,
    change: 15.42,
    changePct: 1.79,
    open: 862.00,
    high: 880.50,
    low: 858.30,
    prevClose: 859.86,
    marketCap: 2150000000000,
    pe: 68.9,
    eps: 12.70,
    currency: 'USD',
    lastUpdate: Date.now(),
  },
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    exchange: 'NYSE',
    price: 505.12,
    change: 1.28,
    changePct: 0.25,
    open: 504.20,
    high: 506.50,
    low: 503.80,
    prevClose: 503.84,
    marketCap: 465000000000,
    currency: 'USD',
    lastUpdate: Date.now(),
  },
};
