import { Candle, SignalResult, RuleFlag } from '@/types/market';
import { SMA, RSI, MACD, BollingerBands, ATR } from './indicators';

export function generateSignal(candles: Candle[]): SignalResult {
  if (candles.length < 200) {
    return {
      rating: 'HOLD',
      confidence: 0,
      flags: [],
      levels: {},
      timestamp: Date.now(),
    };
  }

  const closes = candles.map(c => c.c);
  const current = closes[closes.length - 1];
  
  const sma50 = SMA(candles, 50);
  const sma200 = SMA(candles, 200);
  const rsi = RSI(candles, 14);
  const macd = MACD(candles, 12, 26, 9);
  const bb = BollingerBands(candles, 20, 2);
  const atr = ATR(candles, 14);

  const idx = candles.length - 1;
  const flags: RuleFlag[] = [];
  let score = 0;

  // Trend filter (+0.25)
  const aboveSMA50 = current > sma50[idx];
  const sma50AboveSMA200 = sma50[idx] > sma200[idx];
  const trendBullish = aboveSMA50 && sma50AboveSMA200;
  flags.push({
    id: 'trend_filter',
    passed: trendBullish,
    weight: 0.25,
    note: trendBullish
      ? 'Price above 50-SMA and 50-SMA above 200-SMA (bullish trend)'
      : 'Trend filter not met',
  });
  if (trendBullish) score += 0.25;

  // Momentum confirm (+0.25)
  const macdBullish = macd.line[idx] > macd.signal[idx];
  const histRising =
    idx >= 3 &&
    macd.histogram[idx] > macd.histogram[idx - 1] &&
    macd.histogram[idx - 1] > macd.histogram[idx - 2] &&
    macd.histogram[idx - 2] > macd.histogram[idx - 3];
  const momentumConfirm = macdBullish && histRising;
  flags.push({
    id: 'momentum_confirm',
    passed: momentumConfirm,
    weight: 0.25,
    note: momentumConfirm
      ? 'MACD line above signal with rising histogram (momentum confirmed)'
      : 'MACD momentum not confirmed',
  });
  if (momentumConfirm) score += 0.25;

  // Volatility context (+0.1)
  const atrPct = (atr[idx] / current) * 100;
  const volatilityOK = atrPct >= 1 && atrPct <= 3;
  flags.push({
    id: 'volatility_context',
    passed: volatilityOK,
    weight: 0.1,
    note: volatilityOK
      ? `ATR ${atrPct.toFixed(2)}% - tradable volatility`
      : `ATR ${atrPct.toFixed(2)}% - outside ideal range`,
  });
  if (volatilityOK) score += 0.1;

  // Mean-reversion entry (+0.2)
  let meanReversionEntry = false;
  for (let i = idx - 5; i < idx; i++) {
    if (i < 0) continue;
    const touchedLower = candles[i].l <= bb.lower[i];
    const rsiCrossUp = rsi[i] <= 30 && rsi[idx] > 30;
    if (touchedLower && rsiCrossUp) {
      meanReversionEntry = true;
      break;
    }
  }
  flags.push({
    id: 'mean_reversion',
    passed: meanReversionEntry,
    weight: 0.2,
    note: meanReversionEntry
      ? 'Price touched lower BB and RSI crossed above 30 (mean-reversion setup)'
      : 'No mean-reversion signal',
  });
  if (meanReversionEntry) score += 0.2;

  // Breakout alternative (+0.2)
  const avgVolume20 =
    candles
      .slice(idx - 20, idx)
      .reduce((sum, c) => sum + c.v, 0) / 20;
  const volumeExpansion = candles[idx].v > avgVolume20 * 1.2;
  const breakout = current > bb.upper[idx] && volumeExpansion;
  flags.push({
    id: 'breakout',
    passed: breakout,
    weight: 0.2,
    note: breakout
      ? 'Price broke above upper BB with volume expansion (breakout)'
      : 'No breakout signal',
  });
  if (breakout) score += 0.2;

  // Bearish penalties (-0.3)
  const bearishTrend = current < sma50[idx] || sma50[idx] < sma200[idx];
  const macdBearish = macd.line[idx] < macd.signal[idx];
  const bearishPenalty = bearishTrend || macdBearish;
  flags.push({
    id: 'bearish_penalty',
    passed: !bearishPenalty,
    weight: -0.3,
    note: bearishPenalty
      ? 'Bearish trend or MACD crossover detected (penalty applied)'
      : 'No bearish signals',
  });
  if (bearishPenalty) score -= 0.3;

  // Overheated penalty (-0.15)
  const overheated = rsi[idx] > 70 && current > bb.upper[idx] && !volumeExpansion;
  flags.push({
    id: 'overheated',
    passed: !overheated,
    weight: -0.15,
    note: overheated
      ? 'RSI > 70 and price above upper BB without volume (overbought)'
      : 'Not overbought',
  });
  if (overheated) score -= 0.15;

  const confidence = Math.max(0, Math.min(100, score * 100));

  // Determine rating
  let rating: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  if (confidence >= 60) rating = 'BUY';
  else if (confidence <= 30) rating = 'SELL';

  // Calculate levels
  const swingLow = Math.min(...candles.slice(idx - 20, idx + 1).map(c => c.l));
  const stop = Math.min(swingLow, current - 1.5 * atr[idx]);
  const entryLow = current - 0.5 * atr[idx];
  const entryHigh = current + 0.5 * atr[idx];
  const tp1 = current + 1 * atr[idx];
  const tp2 = current + 2 * atr[idx];
  const tp3 = current + 3 * atr[idx];

  return {
    rating,
    confidence: Math.round(confidence),
    flags,
    levels: {
      entry: [entryLow, entryHigh],
      stop,
      tp: [tp1, tp2, tp3],
    },
    timestamp: Date.now(),
  };
}
