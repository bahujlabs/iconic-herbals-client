import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useAuthStore = create(
  devtools(
    (set) => ({
      user: null,
      isRefreshing: false,

      login: (user) => set({ user }, false, "auth/login"),

      setRefreshing: (isRefreshing) =>
        set({ isRefreshing }, false, "auth/setRefreshing"),

      logout: () => set({ user: null }, false, "auth/logout"),
    }),
    {
      name: "AuthStore",
    },
  ),
);

export const selectUser = (state) => state.user;

export const selectIsAuthenticated = (state) => state.user !== null;

export const selectIsRefreshing = (state) => state.isRefreshing;
