import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useAuthStore = create(
  devtools(
    (set, get) => ({
      user: null,
      isRefreshing: false,

      login: (user) =>
        set({ user }, false, "auth/login"),

      setRefreshing: (isRefreshing) =>
        set({ isRefreshing }, false, "auth/setRefreshing"),

      logout: () =>
        set({ user: null }, false, "auth/logout"),
    }),
    { name: "AuthStore" }
  )
);

export const selectUser            = (s) => s.user;
export const selectIsAuthenticated = (s) => s.user !== null;
export const selectIsRefreshing    = (s) => s.isRefreshing;