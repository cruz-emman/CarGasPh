import { create } from 'zustand';
import { UserProfile } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/auth.service';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(payload);
      await authService.saveTokens(response.access_token, response.refresh_token);
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Login failed. Please check your credentials.',
      });
      throw err;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(payload);
      await authService.saveTokens(response.access_token, response.refresh_token);
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Registration failed. Please try again.',
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.clearTokens();
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const token = await authService.getStoredAccessToken();
      if (token) {
        try {
          const profile = await authService.getProfile();
          set({
            user: profile,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        } catch {
          // Token expired or invalid, try refresh
          const refreshToken = await authService.getStoredRefreshToken();
          if (refreshToken) {
            try {
              const refreshed = await authService.refreshToken(refreshToken);
              await authService.saveTokens(refreshed.access_token, refreshed.refresh_token);
              set({
                user: refreshed.user,
                token: refreshed.access_token,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            } catch {
              // Refresh also failed
            }
          }
        }
      }
      await authService.clearTokens();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
