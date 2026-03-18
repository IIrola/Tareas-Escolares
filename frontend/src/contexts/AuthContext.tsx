import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import type { User, LoginRequest, RegisterRequest, LoginResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        // Decode JWT payload to check expiration
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        const expTime = payload.exp * 1000;
        
        if (Date.now() >= expTime) {
          // Token expired -> clean up
          localStorage.clear();
          sessionStorage.clear();
        } else {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        // Invalid token format
        localStorage.clear();
        sessionStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await apiClient.post<LoginResponse>('/auth/login', data);
    const { token: newToken, usuario } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(usuario));
    setToken(newToken);
    setUser(usuario);
  };

  const register = async (data: RegisterRequest) => {
    await apiClient.post('/auth/register', data);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
