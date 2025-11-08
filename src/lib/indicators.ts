import { Candle } from '@/types/market';

export function SMA(candles: Candle[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += candles[i - j].c;
    }
    result.push(sum / period);
  }
  return result;
}

export function EMA(candles: Candle[], period: number): number[] {
  const result: number[] = [];
  const k = 2 / (period + 1);
  let ema = candles[0].c;
  
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      result.push(candles[0].c);
      continue;
    }
    ema = candles[i].c * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

export function RSI(candles: Candle[], period: number = 14): number[] {
  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      result.push(NaN);
      continue;
    }
    
    const change = candles[i].c - candles[i - 1].c;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
    
    if (i < period) {
      result.push(NaN);
      continue;
    }
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) {
      result.push(100);
      continue;
    }
    
    const rs = avgGain / avgLoss;
    result.push(100 - (100 / (1 + rs)));
  }
  
  return result;
}

export type MACDResult = {
  line: number[];
  signal: number[];
  histogram: number[];
};

export function MACD(
  candles: Candle[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const fastEMA = EMA(candles, fastPeriod);
  const slowEMA = EMA(candles, slowPeriod);
  
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  
  // Calculate signal line (EMA of MACD line)
  const signalLine: number[] = [];
  const k = 2 / (signalPeriod + 1);
  let ema = macdLine[slowPeriod - 1] || 0;
  
  for (let i = 0; i < macdLine.length; i++) {
    if (i < slowPeriod - 1) {
      signalLine.push(NaN);
      continue;
    }
    if (i === slowPeriod - 1) {
      signalLine.push(macdLine[i]);
      ema = macdLine[i];
      continue;
    }
    ema = macdLine[i] * k + ema * (1 - k);
    signalLine.push(ema);
  }
  
  const histogram = macdLine.map((line, i) => line - signalLine[i]);
  
  return { line: macdLine, signal: signalLine, histogram };
}

export type BollingerBandsResult = {
  upper: number[];
  middle: number[];
  lower: number[];
};

export function BollingerBands(
  candles: Candle[],
  period: number = 20,
  stdDev: number = 2
): BollingerBandsResult {
  const middle = SMA(candles, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }
    
    const slice = candles.slice(i - period + 1, i + 1);
    const mean = middle[i];
    const variance = slice.reduce((sum, candle) => sum + Math.pow(candle.c - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    
    upper.push(mean + stdDev * std);
    lower.push(mean - stdDev * std);
  }
  
  return { upper, middle, lower };
}

export function ATR(candles: Candle[], period: number = 14): number[] {
  const result: number[] = [];
  const trueRanges: number[] = [];
  
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      result.push(NaN);
      continue;
    }
    
    const high = candles[i].h;
    const low = candles[i].l;
    const prevClose = candles[i - 1].c;
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    
    trueRanges.push(tr);
    
    if (i < period) {
      result.push(NaN);
      continue;
    }
    
    const atr = trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
    result.push(atr);
  }
  
  return result;
}

export function VWAP(candles: Candle[]): number[] {
  const result: number[] = [];
  let cumulativePV = 0;
  let cumulativeVolume = 0;
  
  for (let i = 0; i < candles.length; i++) {
    const typical = (candles[i].h + candles[i].l + candles[i].c) / 3;
    cumulativePV += typical * candles[i].v;
    cumulativeVolume += candles[i].v;
    
    result.push(cumulativeVolume === 0 ? typical : cumulativePV / cumulativeVolume);
  }
  
  return result;
}
