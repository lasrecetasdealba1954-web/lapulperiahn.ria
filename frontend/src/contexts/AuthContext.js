// /app/frontend/src/contexts/AuthContext.js
// Basic AuthContext for storing session after login.

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(localStorage.getItem('session_token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionToken) {
      // Optional: Validate token with backend
      // fetch(`${BACKEND_URL}/api/validate`, { headers: { Authorization: `Bearer ${sessionToken}` } })
    }
  }, [sessionToken]);

  const login = (userData, token) => {
    setUser(userData);
    setSessionToken(token);
    localStorage.setItem('session_token', token);
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('session_token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
