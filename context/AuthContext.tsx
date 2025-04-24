import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AuthState, User } from '@/types';

// Sample user data for demo
const DEMO_USERS = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
  }
];

// Auth context type definition
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Storage key
const USER_STORAGE_KEY = 'split-it-user';

// Use secure storage on native, localStorage on web
const storeUser = async (user: User) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

const getStoredUser = async (): Promise<User | null> => {
  try {
    if (Platform.OS === 'web') {
      const user = localStorage.getItem(USER_STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } else {
      const user = await SecureStore.getItemAsync(USER_STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    }
  } catch (error) {
    console.error('Failed to get stored user', error);
    return null;
  }
};

const removeStoredUser = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(USER_STORAGE_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  // Check for stored user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getStoredUser();
        
        setState({
          user,
          isLoading: false,
          error: null,
          isAuthenticated: !!user,
        });
        
        if (user) {
          // Navigate to main app if user is logged in
          router.replace('/(tabs)');
        } else {
          // Navigate to auth screens if no user
          router.replace('/(auth)/login');
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: 'Failed to restore session',
          isAuthenticated: false,
        });
        router.replace('/(auth)/login');
      }
    };
    
    checkUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // For demo: find user by email (in a real app, this would be an API call)
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user && password === 'password') { // In a real app, validate password properly
        await storeUser(user);
        
        setState({
          user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
        
        router.replace('/(tabs)');
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid email or password',
          isAuthenticated: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.',
        isAuthenticated: false,
      }));
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // For demo: Check if email is already taken
      const existingUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Email already in use',
          isAuthenticated: false,
        }));
        return;
      }
      
      // In a real app, this would create a new user via API
      // For demo, just use first demo user
      const user = DEMO_USERS[0];
      
      await storeUser(user);
      
      setState({
        user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.',
        isAuthenticated: false,
      }));
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await removeStoredUser();
      
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
      
      router.replace('/(auth)/login');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook
export const useAuth = () => useContext(AuthContext);