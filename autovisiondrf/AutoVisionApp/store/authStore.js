import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, getTokens } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    (async () => {
      try {
        const { access } = await getTokens();
        if (access) {
          const savedUser = await AsyncStorage.getItem('user_info');
          setUser(savedUser ? JSON.parse(savedUser) : { authenticated: true });
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const login = async (username, password) => {
    const data = await authAPI.login(username, password);
    const userInfo = { username, authenticated: true };
    await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
    setUser(userInfo);
    return data;
  };

  const logout = async () => {
    await authAPI.logout();
    await AsyncStorage.removeItem('user_info');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};