import React, { useState, useEffect, useRef } from "react";
import { useCurrency } from "../context/CurrencyContext";

export function CurrencySelector() {
  const { selected, setSelected, currencies, rates, loading } = useCurrency();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleSelect(currency) {
    setSelected(currency);
    setOpen(false);
  }

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 ${
          open
            ? "bg-gray-100 dark:bg-[hsl(var(--primary))]/40"
            : "bg-white dark:bg-[hsl(var(--accent))]"
        }`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={loading}
      >
        <span className="text-lg">{selected.flag}</span>
        <span>{selected.code}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 rounded-lg bg-white dark:bg-[hsl(var(--primary))] shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="px-3 py-1 font-semibold text-gray-500 dark:text-gray-400 text-sm">
            Currency
          </div>
          {currencies.map((currency) => {
            const rate = rates[currency.code];
            const isSelected = currency.code === selected.code;
            return (
              <div
                key={currency.code}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded-md ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-200 font-semibold"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(currency)}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(currency)}
                tabIndex={0}
              >
                <span className="mr-2 text-lg">{currency.flag}</span>
                <span>{currency.code}</span>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  {rate &&
                    (rate < 10
                      ? rate.toFixed(4)
                      : Math.round(rate).toLocaleString())}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
