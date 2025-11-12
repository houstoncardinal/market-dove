import { supabase } from "@/integrations/supabase/client";
import { Quote, Candle, AssetMode, TimeRange } from "@/types/market";

// Map crypto symbols to CoinGecko IDs
const CRYPTO_ID_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
};

const DAYS_MAP: Record<TimeRange, number> = {
  '1D': 1,
  '5D': 5,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  '5Y': 1825,
};

export async function fetchQuotes(symbols: string[], mode: AssetMode): Promise<Quote[]> {
  try {
    const functionName = mode === 'crypto' ? 'crypto-quote' : 'stock-quote';
    const querySymbols = mode === 'crypto' 
      ? symbols.map(s => CRYPTO_ID_MAP[s] || s.toLowerCase())
      : symbols;

    const { data, error } = await supabase.functions.invoke(functionName, {
      body: { symbols: querySymbols },
    });

    if (error) throw error;
    return data.quotes || [];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}

export async function fetchHistory(
  symbol: string,
  mode: AssetMode,
  range: TimeRange = '1Y'
): Promise<Candle[]> {
  try {
    const functionName = mode === 'crypto' ? 'crypto-history' : 'stock-history';
    const querySymbol = mode === 'crypto' 
      ? CRYPTO_ID_MAP[symbol] || symbol.toLowerCase()
      : symbol;

    const { data, error } = await supabase.functions.invoke(functionName, {
      body: { 
        symbol: querySymbol,
        ...(mode === 'crypto' ? { days: DAYS_MAP[range] } : { range }),
      },
    });

    if (error) throw error;
    return data.candles || [];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}
