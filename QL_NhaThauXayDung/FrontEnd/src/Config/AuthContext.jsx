import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Khởi tạo state từ sessionStorage nếu có
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('user');
  });

  // Hàm cập nhật state và sessionStorage
  const updateAuthState = (userData) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } else {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('user');
    }
  };

  const login = (userData) => {
    updateAuthState(userData);
  };

  const logout = () => {
    updateAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 