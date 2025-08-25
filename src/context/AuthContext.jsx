
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Initialize user and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }

  }, []);

  const login = async ({ username, password, role }) => {
    try {
      const response = await axios.post(
        "https://gibsbrokersapi.newgibsonline.com/api/Users/login",
        { username, password, role }
      );


      const { token: authToken, user: userData } = response.data;
      
      // Store authentication data
      localStorage.setItem("token", authToken); // FIXED: store authToken, not token
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", role);

      setToken(authToken); // Set token in state
      
      const authenticatedUser = {
        ...userData,
        role,
        token: authToken // Include token in user object
      };

      setUser(authenticatedUser);
      
      return { 
        success: true,
        user: authenticatedUser // Return the complete user object with token
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
    setToken(null);
    return { success: true };
  };

  const updatePassword = async ({ oldPassword, newPassword }) => {
    try {
      // Make API call to update password
      await axios.post(
        "https://gibsbrokersapi.newgibsonline.com/api/Users/update-password", // FIXED: typo in endpoint
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}` // Use token from state
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
    token,
    isAuthenticated: !!token, // Better to check token existence
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