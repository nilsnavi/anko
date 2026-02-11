import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_AUTH_URL = `${API_BASE_URL}/api`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('accessToken');

      if (storedUser && storedAccessToken) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify token is still valid
          await refreshToken();
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { username, password: '***' });
      const response = await axios.post(`${API_AUTH_URL}/auth/login`, {
        username,
        password
      });
      console.log('Login response:', response.data);

      const { accessToken, refreshToken, user: userData } = response.data;

      // Store in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    // Call logout endpoint
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      axios.post(`${API_AUTH_URL}/auth/logout`, { refreshToken }).catch(console.error);
    }

    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setUser(null);
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${API_AUTH_URL}/auth/refresh`, {
        refreshToken
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      // Set default authorization header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  // Set up axios interceptors
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await refreshToken();
            const newToken = localStorage.getItem('accessToken');
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};