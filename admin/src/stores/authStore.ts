import { create } from 'zustand';
import authService from '../services/authService';

export type UserRole = 'manager' | 'receptionist' | 'admin';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  staffId: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl: string;
  department: string;
  hotelBranch: string;
  shift: string;
  terminalId: string;
  permissions: string[];
  lastLogin: string;
  phone: string;
}

// Fallback user shown before API responds — no credentials, just UI structure
const FALLBACK_USER: StaffUser = {
  id: '',
  name: 'Staff Member',
  email: '',
  staffId: '',
  role: 'manager',
  roleTitle: 'Loading...',
  avatarUrl: '',
  department: '',
  hotelBranch: 'KEO Experience Hotel & Suites',
  shift: '',
  terminalId: '',
  permissions: [],
  lastLogin: '',
  phone: '',
};

interface AuthState {
  isAuthenticated: boolean;
  currentUser: StaffUser;
  isLocked: boolean;
  selectedShift: string;
  login: (email: string, role: UserRole, shift?: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  lockTerminal: () => void;
  unlockTerminal: (pin: string) => Promise<boolean>;
  updateShift: (shift: string) => void;
  setAuthToken: (token: string) => void;
  getAuthToken: () => string | null;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: !!sessionStorage.getItem('auth_token'),
  currentUser: FALLBACK_USER,
  isLocked: false,
  selectedShift: '',

  login: async (email, role, shift, password) => {
    try {
      // Call the backend — credentials validated server-side with bcrypt
      const result = await authService.login({ email, username: email, password: password || '', role }) as any;
      const u = result?.user;

      if (!u) return false;

      const user: StaffUser = {
        id: u.id || '',
        name: u.name,
        email: u.email,
        staffId: u.staffId || u.staff_id || '',
        role: (u.role as UserRole) || role,
        roleTitle: u.roleTitle || u.role_title || '',
        avatarUrl: u.avatarUrl || u.avatar_url || '',
        department: u.department || '',
        hotelBranch: u.hotelBranch || u.hotel_branch || 'KEO Experience Hotel & Suites',
        shift: shift || u.shift || '',
        terminalId: u.terminalId || u.terminal_id || '',
        permissions: u.permissions || [],
        lastLogin: new Date().toLocaleString(),
        phone: u.phone || '',
      };

      sessionStorage.setItem('auth_token', result?.token || 'keo-session');
      set({ isAuthenticated: true, currentUser: user, isLocked: false, selectedShift: user.shift });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    sessionStorage.removeItem('auth_token');
    set({ isAuthenticated: false, isLocked: false, currentUser: FALLBACK_USER });
  },

  switchRole: async (role: UserRole) => {
    // Re-login is required after switching roles — clear session
    sessionStorage.removeItem('auth_token');
    set({ isAuthenticated: false, isLocked: false, currentUser: { ...FALLBACK_USER, role } });
  },

  lockTerminal: () => set({ isLocked: true }),

  unlockTerminal: async (pin: string) => {
    const state = get();
    // Send PIN verification to API
    try {
      const res = await fetch(
        `/admin/staff/${state.currentUser.id}/verify-pin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('auth_token')}` },
          body: JSON.stringify({ pin }),
        }
      );
      if (res.ok) { set({ isLocked: false }); return true; }
    } catch { /* fall through */ }
    return false;
  },

  updateShift: (shift: string) => {
    set((state) => ({ selectedShift: shift, currentUser: { ...state.currentUser, shift } }));
  },

  setAuthToken: (token: string) => sessionStorage.setItem('auth_token', token),
  getAuthToken: () => sessionStorage.getItem('auth_token'),
}));