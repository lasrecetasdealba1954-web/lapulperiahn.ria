// /app/frontend/src/pages/GoogleCallback.js
// Handles the callback from Google, exchanges code for token.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext exists
import { BACKEND_URL } from '../config/api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (!code) {
        console.error('[GoogleCallback] No code in URL');
        navigate('/');
        return;
      }

      const redirectUri = `${window.location.origin}/auth/callback`;

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/google/callback?code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`, {
          method: 'GET', // Or POST if backend expects POST
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Auth failed');
        }

        const data = await response.json();
        // Assuming data has user and session_token
        login(data.user, data.session_token); // Store in context/localStorage
        navigate(data.user.is_new ? '/select-type' : '/map'); // Or /dashboard
      } catch (error) {
        console.error('[GoogleCallback] Error:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, login]);

  return <div>Loading...</div>; // Or a spinner
};

export default GoogleCallback;
