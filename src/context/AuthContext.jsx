import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ username, password, role }) => {
    try {
      const response = await axios.post(
        "http://gibsbrokersapi.newgibsonline.com/api/Users/login",
        { username, password, role }
      );

      const { token, user: userData } = response.data;
      
      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", role);

      const authenticatedUser = {
        ...userData,
        role,
        token
      };

      setUser(authenticatedUser);
      
      return { 
        success: true,
        user: authenticatedUser
      };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const logout = () => {
    // Clear all auth-related storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    return { success: true };
  };

  const updatePassword = async ({ oldPassword, newPassword }) => {
    try {
      // Make API call to update password
      await axios.post(
        "http://gibsbrokersapi.newgibsonline.com/api/Users/update-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return { success: true };
    } catch (error) {
      console.error("Password update error:", error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password update failed' 
      };
    }
  };

  // Initialize user from localStorage if exists
  const initializeUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  // Call initialize when AuthProvider mounts
  useState(() => {
    initializeUser();
  }, []);

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