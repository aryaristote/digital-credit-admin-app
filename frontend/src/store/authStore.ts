import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  admin: Admin | null;
  setAuth: (token: string, refreshToken: string, admin: Admin) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      admin: null,
      setAuth: (token, refreshToken, admin) =>
        set({ token, refreshToken, admin }),
      clearAuth: () => set({ token: null, refreshToken: null, admin: null }),
    }),
    {
      name: "admin-auth-storage",
    }
  )
);

