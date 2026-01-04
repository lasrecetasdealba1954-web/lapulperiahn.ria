// /app/frontend/src/pages/LandingPage.js
// Updated to use ONLY Google OAuth, removing any Emergent references.
// Based on snippets from GOOGLE_OAUTH_SETUP.md and other docs.
// This ensures login with Google and redirects after auth.

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { BACKEND_URL } from '../config/api'; // From api.js

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Dynamic redirect URI based on current domain
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    // Redirect to backend to get Google auth URL
    window.location.href = `${BACKEND_URL}/api/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="landing-page">
      {/* Your landing page content, e.g., stars animation, etc. */}
      <button onClick={handleLogin}>Comenzar con Google</button>
      {/* Optional: Indicator */}
      <p>🔐 Usando Google OAuth</p>
    </div>
  );
};

export default LandingPage;
