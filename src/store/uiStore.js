import { create } from "zustand";

const TOAST_DURATION_MS = 4000;

export const useUiStore = create((set) => ({
  toasts: [],
  modal: null,

  toast: (message, type = "info") => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, TOAST_DURATION_MS);
    return id;
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
