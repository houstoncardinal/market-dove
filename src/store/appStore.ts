import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WatchlistItem, PortfolioPosition, Alert, DataSource, IndicatorConfig } from '@/types/market';

interface AppState {
  // Settings
  dataSource: DataSource;
  alphaVantageKey: string;
  indicatorConfig: IndicatorConfig;
  disclaimerAccepted: boolean;
  
  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  
  // Portfolio
  portfolio: PortfolioPosition[];
  addPosition: (position: Omit<PortfolioPosition, 'addedAt'>) => void;
  removePosition: (symbol: string) => void;
  updatePosition: (symbol: string, updates: Partial<PortfolioPosition>) => void;
  
  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  
  // Settings actions
  setDataSource: (source: DataSource) => void;
  setAlphaVantageKey: (key: string) => void;
  updateIndicatorConfig: (config: Partial<IndicatorConfig>) => void;
  acceptDisclaimer: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Default settings
      dataSource: 'yahoo',
      alphaVantageKey: '',
      indicatorConfig: {
        sma: [20, 50, 200],
        ema: [12, 26],
        macd: { fast: 12, slow: 26, signal: 9 },
        rsi: 14,
        bb: { period: 20, stdDev: 2 },
        atr: 14,
        showVolume: true,
      },
      disclaimerAccepted: false,
      
      // Default watchlist
      watchlist: [
        { symbol: 'AAPL', addedAt: Date.now() - 86400000 },
        { symbol: 'MSFT', addedAt: Date.now() - 86400000 },
        { symbol: 'TSLA', addedAt: Date.now() - 86400000 },
        { symbol: 'NVDA', addedAt: Date.now() - 86400000 },
        { symbol: 'SPY', addedAt: Date.now() - 86400000 },
      ],
      
      portfolio: [],
      alerts: [],
      
      // Actions
      addToWatchlist: (symbol) =>
        set((state) => ({
          watchlist: [
            ...state.watchlist.filter((item) => item.symbol !== symbol),
            { symbol: symbol.toUpperCase(), addedAt: Date.now() },
          ],
        })),
      
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter((item) => item.symbol !== symbol),
        })),
      
      addPosition: (position) =>
        set((state) => ({
          portfolio: [...state.portfolio, { ...position, addedAt: Date.now() }],
        })),
      
      removePosition: (symbol) =>
        set((state) => ({
          portfolio: state.portfolio.filter((pos) => pos.symbol !== symbol),
        })),
      
      updatePosition: (symbol, updates) =>
        set((state) => ({
          portfolio: state.portfolio.map((pos) =>
            pos.symbol === symbol ? { ...pos, ...updates } : pos
          ),
        })),
      
      addAlert: (alert) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              ...alert,
              id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: Date.now(),
            },
          ],
        })),
      
      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),
      
      toggleAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
          ),
        })),
      
      setDataSource: (source) => set({ dataSource: source }),
      setAlphaVantageKey: (key) => set({ alphaVantageKey: key }),
      updateIndicatorConfig: (config) =>
        set((state) => ({
          indicatorConfig: { ...state.indicatorConfig, ...config },
        })),
      acceptDisclaimer: () => set({ disclaimerAccepted: true }),
    }),
    {
      name: 'cardinal-quant-storage',
    }
  )
);
