import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const API_BASE = 'http://192.168.1.38:8000/api'; // 🔧 change to your IP

// ─── Token Helpers ─────────────────────────────────────────────
const saveTokens = async (access, refresh) => {
  await AsyncStorage.setItem('access_token', access);
  await AsyncStorage.setItem('refresh_token', refresh);
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
  await AsyncStorage.removeItem('user_info');
};

export const getTokens = async () => {
  const access  = await AsyncStorage.getItem('access_token');
  const refresh = await AsyncStorage.getItem('refresh_token');
  return { access, refresh };
};

// ─── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const { access } = await getTokens();
        if (access) {
          const saved = await AsyncStorage.getItem('user_info');
          if (saved) setUser(JSON.parse(saved));
        }
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, []);

  // ── Login ───────────────────────────────────────────────────
  const login = async (username, password) => {
    let res;
    try {
      res = await fetch(`${API_BASE}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
    } catch (_) {
      throw new Error('Network request failed. Check your connection and IP address.');
    }

    if (!res.ok) {
      let msg = 'Invalid username or password.';
      try {
        const err = await res.json();
        msg = err?.detail || err?.non_field_errors?.[0] || msg;
      } catch (_) {}
      throw new Error(msg);
    }

    const data = await res.json();
    await saveTokens(data.access, data.refresh);

    const userInfo = { username: username.trim(), authenticated: true };
    await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
    setUser(userInfo);
    return data;
  };

  // ── Register ────────────────────────────────────────────────
  const register = async (username, password, email = '') => {
    let res;
    try {
      res = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password, email: email.trim() }),
      });
    } catch (_) {
      throw new Error('Network request failed. Check your connection and IP address.');
    }

    if (!res.ok) {
      let msg = 'Registration failed.';
      try {
        const err = await res.json();
        msg = Object.values(err).flat().join('\n') || msg;
      } catch (_) {}
      throw new Error(msg);
    }

    return res.json();
  };

  // ── Logout ──────────────────────────────────────────────────
  const logout = async () => {
    await clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};