import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      // In a real app, you would call your API here
      const mockUser = {
        id: '123',
        name: 'Test User',
        type: credentials.userType
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    return { success: true };
  };

  const updatePassword = async ({ oldPassword, newPassword }) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Password update failed' };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}