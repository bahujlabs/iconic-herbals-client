import { useSyncExternalStore } from "react";

let state = {};
const listeners = new Set();

const emit = () => {
  listeners.forEach((l) => l());
};

export const cartStore = {
  get: () => state,

  set: (next) => {
    state = next;
    emit();
  },

  toggle: (i, defaultQty = 1) => {
    const next = { ...state };

    if (next[i]) {
      delete next[i];
    } else {
      next[i] = defaultQty;
    }

    cartStore.set(next);
  },

  setQty: (i, qty) => {
    const next = { ...state };

    if (qty < 1) {
      delete next[i];
    } else {
      next[i] = qty;
    }

    cartStore.set(next);
  },

  updateQty: (i, delta) => {
    const current = state[i] || 0;
    cartStore.setQty(i, current + delta);
  },

  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useCart = () =>
  useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.get);