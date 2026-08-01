import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../services/api';
import type { ApiResponse, UserResponse } from '../types';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, roles: string[]) => Promise<void>;
  logout: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode JWT payload without external library
const decodeJwt = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const logoutLocal = React.useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    setUser(null);
    setError(null);
  }, []);

  // Listen for unauthorized events dispatched by API interceptors
  useEffect(() => {
    const handleUnauthorized = () => {
      logoutLocal();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logoutLocal]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      let validToken = token;
      
      if (token) {
        const decoded = decodeJwt(token);
        if (decoded) {
          // Check expiration
          const exp = decoded.exp * 1000;
          if (Date.now() >= exp) {
            console.warn('Access token expired. Attempting token refresh...');
            validToken = null;
          } else {
            const email = decoded.sub || '';
            const username = localStorage.getItem('username') || email.split('@')[0] || 'User';
            setUser({
              id: decoded.userId || 'unknown-id',
              email: email,
              username: username,
              roles: decoded.roles || [],
            });
          }
        } else {
          validToken = null;
          localStorage.removeItem('accessToken');
        }
      }

      // If no valid token, try to refresh using cookie
      if (!validToken) {
        try {
          const res = await axiosInstance.post<ApiResponse<string>>('/api/v1/auth/refresh');
          const refreshResponse = res.data;
          if (refreshResponse.success && refreshResponse.data) {
            const newAccessToken = refreshResponse.data;
            localStorage.setItem('accessToken', newAccessToken);
            const decoded = decodeJwt(newAccessToken);
            if (decoded) {
              const email = decoded.sub || '';
              const username = email.split('@')[0] || 'User';
              localStorage.setItem('username', username);
              setUser({
                id: decoded.userId || 'unknown-id',
                email: email,
                username: username,
                roles: decoded.roles || [],
              });
            } else {
              logoutLocal();
            }
          } else {
            logoutLocal();
          }
        } catch (e) {
          logoutLocal();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logoutLocal]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await axiosInstance.post<ApiResponse<string>>('/api/v1/auth/login', { email, password });
      const response = res.data;
      if (response.success && response.data) {
        const accessToken = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        const decoded = decodeJwt(accessToken);
        if (!decoded) {
          throw new Error('Failed to decode the received access token.');
        }
        const userEmail = decoded.sub || email;
        const derivedUsername = userEmail.split('@')[0] || 'User';
        localStorage.setItem('username', derivedUsername);

        setUser({
          id: decoded.userId || 'unknown-uuid',
          email: userEmail,
          username: derivedUsername,
          roles: decoded.roles || [],
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      const msg = err.message || 'An error occurred during login';
      setError('Invalid Credentials.');
      throw new Error(msg);
    }
  };

  const register = async (username: string, email: string, password: string, roles: string[]) => {
    setError(null);
    try {
      const res = await axiosInstance.post<ApiResponse<UserResponse>>('/api/v1/auth/register', { username, email, password, roles });
      const response = res.data;
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      const msg = err.message || 'An error occurred during registration';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    axiosInstance.post('/api/v1/auth/logout').catch((e: any) => console.error('Backend logout failed', e));
    logoutLocal();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        register,
        logout,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
