import { useState, useEffect, useCallback, useRef } from 'react';

export const CURRENCIES = [
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira',  flag: '🇳🇬' }, // default first
  { code: 'USD', symbol: '$',  name: 'US Dollar',        flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',  name: 'Euro',             flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',  name: 'British Pound',    flag: '🇬🇧' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',  flag: '🇨🇦' },
];

const ZERO_DECIMAL = new Set(['NGN', 'CLP']);

const FALLBACK_RATES = {
  NGN: 1,
  USD: 0.00065,
  EUR: 0.00060,
  GBP: 0.00051,
  CAD: 0.00088,
};

export function useCurrencyProvider(defaultCurrencyCode = 'NGN') {
  const defaultCurrency =
    CURRENCIES.find(c => c.code === defaultCurrencyCode) ?? CURRENCIES[0];

  const [selected, setSelected]       = useState(defaultCurrency);
  const [rates, setRates]             = useState({});
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const cache = useRef({});

  const fetchRates = useCallback(async (baseCurrency = 'NGN') => {
    if (cache.current[baseCurrency]) {
      setRates(cache.current[baseCurrency]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `const res = await fetch('/api/rates?from=USD&to=NGN')`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const usdToNgn = data.rates.NGN;
      const normalized = {
        NGN: 1,
        USD: 1 / usdToNgn,
        EUR: data.rates.EUR / usdToNgn,
        GBP: data.rates.GBP / usdToNgn,
        CAD: data.rates.CAD / usdToNgn,
      };

      cache.current[baseCurrency] = normalized;
      setRates(normalized);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('[CurrencyProvider] Rate fetch failed:', err);
      setError('Prices are approximate. Rates will refresh shortly.');
      setRates(FALLBACK_RATES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates('NGN');
  }, [fetchRates]);

  const convert = useCallback((ngnPrice) => {
    if (ngnPrice == null) return '';
    const rate = rates[selected.code] ?? 1;
    const converted = ngnPrice * rate;
    const isZeroDecimal = ZERO_DECIMAL.has(selected.code);
    try {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: selected.code,
        minimumFractionDigits: isZeroDecimal ? 0 : 2,
        maximumFractionDigits: isZeroDecimal ? 0 : 2,
      }).format(converted);
    } catch {
      const formatted = isZeroDecimal
        ? Math.round(converted).toLocaleString()
        : converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `${selected.symbol}${formatted}`;
    }
  }, [rates, selected]);

  const refreshRates = useCallback(() => {
    cache.current = {};
    fetchRates('NGN');
  }, [fetchRates]);

  return {
    selected, setSelected,
    rates, convert,
    loading, error, lastUpdated,
    refreshRates,
    currencies: CURRENCIES,
  };
}