import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, days = 365 } = await req.json();
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform to our Candle format
    const candles = data.prices.map((price: [number, number], index: number) => {
      const timestamp = price[0];
      const close = price[1];
      const volume = data.total_volumes[index]?.[1] || 0;
      
      // Approximate OHLC from price points
      return {
        t: timestamp,
        o: close * (0.98 + Math.random() * 0.04),
        h: close * (1.00 + Math.random() * 0.02),
        l: close * (0.98 - Math.random() * 0.02),
        c: close,
        v: volume,
      };
    });

    return new Response(JSON.stringify({ candles }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
