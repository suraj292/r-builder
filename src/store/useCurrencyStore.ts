import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface CurrencyConfig {
  country: string;
  country_code: string;
  currency: 'USD' | 'INR' | 'EUR';
  symbol: string;
  locale: string;
}

interface CurrencyState {
  config: CurrencyConfig;
  isAutoDetected: boolean;
  
  // Actions
  detectCurrency: () => Promise<void>;
  setCurrency: (currency: 'USD' | 'INR' | 'EUR') => void;
  formatPrice: (amountInCents: number) => string;
}

const CURRENCY_MAP: Record<string, Partial<CurrencyConfig>> = {
  USD: { country: 'United States', country_code: 'US', currency: 'USD', symbol: '$', locale: 'en-US' },
  INR: { country: 'India', country_code: 'IN', currency: 'INR', symbol: '₹', locale: 'en-IN' },
  EUR: { country: 'Europe', country_code: 'EU', currency: 'EUR', symbol: '€', locale: 'de-DE' },
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      config: CURRENCY_MAP.USD as CurrencyConfig,
      isAutoDetected: false,

      detectCurrency: async () => {
        // If already auto-detected or manually set, maybe skip? 
        // For now, always detect on first load if not manually set.
        try {
          const data = await api.get<CurrencyConfig>('/v1/location/currency');
          set({ config: data, isAutoDetected: true });
        } catch (err) {
          console.error('Failed to detect currency', err);
        }
      },

      setCurrency: (currency) => {
        const partialConfig = CURRENCY_MAP[currency];
        if (partialConfig) {
          set({ config: { ...get().config, ...partialConfig }, isAutoDetected: false });
        }
      },

      formatPrice: (amountInCents) => {
        const { currency, locale } = get().config;
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(amountInCents / 100);
      }
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ config: state.config, isAutoDetected: state.isAutoDetected }),
    }
  )
);
