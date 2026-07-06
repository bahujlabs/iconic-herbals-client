import React from 'react';
import { CurrencyContext } from '../context/CurrencyContext';
import { useCurrencyProvider } from '../hooks/useCurrencyProvider';

export function CurrencyProvider({ defaultCurrency = 'NGN', children }) {
  const value = useCurrencyProvider(defaultCurrency);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export default CurrencyProvider;