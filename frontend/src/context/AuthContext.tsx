import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // BYPASS LOGIN: Start with a mock user already set
  const [user, setUser] = useState<User | null>({ id: 1, username: 'auto_admin' });

  useEffect(() => {
    // Optionally still sync with backend to get the real ID of the auto_admin
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        console.warn("Failed to get auto_admin info", error);
      }
    };
    checkAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    // For bypass, we'll just immediately set them back to auto_admin
    setUser({ id: 1, username: 'auto_admin' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
