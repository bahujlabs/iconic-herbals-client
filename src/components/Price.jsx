import React, { useEffect, useRef, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

export function Price({ ngn, className = '', animate = true, tag: Tag = 'span' }) {
  const { convert } = useCurrency();
  const [flash, setFlash] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!animate) return;

    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 400);
    return () => clearTimeout(timer);
  }, [convert, animate]);

  const flashStyle = flash
    ? { opacity: 0.5, transform: 'scale(0.97)', transition: 'opacity 0.2s, transform 0.2s' }
    : { opacity: 1, transform: 'scale(1)', transition: 'opacity 0.2s, transform 0.2s' };

  return (
    <Tag className={className} style={animate ? flashStyle : undefined}>
      {convert(ngn)}
    </Tag>
  );
}