import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Copy, Check, ExternalLink, ShoppingBag, Store, Bell, MapPin, Sparkles } from 'lucide-react';
import DisclaimerModal from '../components/DisclaimerModal';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../contexts/AuthContext';

// Iconos de redes sociales
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Logo de La Pulpería
const PulperiaLogo = () => (
  <div className="relative">
    <svg viewBox="0 0 100 100" className="w-20 h-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626"/>
          <stop offset="50%" stopColor="#B91C1C"/>
          <stop offset="100%" stopColor="#7F1D1D"/>
        </linearGradient>
        <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7"/>
          <stop offset="100%" stopColor="#FDE68A"/>
        </linearGradient>
        <linearGradient id="doorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#92400E"/>
          <stop offset="100%" stopColor="#78350F"/>
        </linearGradient>
      </defs>
     
      <rect x="10" y="15" width="80" height="14" rx="3" fill="url(#roofGrad)" filter="url(#glow)"/>
      <rect x="15" y="18" width="70" height="8" rx="2" fill="#B91C1C" opacity="0.7"/>
     
      <path d="M10 32 Q22 24 34 32 Q46 40 58 32 Q70 24 82 32 Q88 28 90 32"
            fill="none" stroke="url(#roofGrad)" strokeWidth="5" strokeLinecap="round" filter="url(#glow)"/>
     
      <rect x="15" y="38" width="70" height="48" rx="3" fill="url(#wallGrad)"/>
      <rect x="15" y="38" width="70" height="48" rx="3" fill="none" stroke="#B45309" strokeWidth="1.5"/>
     
      <rect x="22" y="46" width="18" height="16" rx="2" fill="#1F2937"/>
      <rect x="22" y="46" width="18" height="16" rx="2" fill="none" stroke="#FCD34D" strokeWidth="0.5"/>
      <line x1="31" y1="46" x2="31" y2="62" stroke="#FCD34D" strokeWidth="1.5"/>
      <line x1="22" y1="54" x2="40" y2="54" stroke="#FCD34D" strokeWidth="1.5"/>
      <rect x="23" y="47" width="6" height="6" rx="1" fill="rgba(253, 224, 71, 0.3)"/>
     
      <rect x="60" y="46" width="18" height="16" rx="2" fill="#1F2937"/>
      <rect x="60" y="46" width="18" height="16" rx="2" fill="none" stroke="#FCD34D" strokeWidth="0.5"/>
      <line x1="69" y1="46" x2="69" y2="62" stroke="#FCD34D" strokeWidth="1.5"/>
      <line x1="60" y1="54" x2="78" y2="54" stroke="#FCD34D" strokeWidth="1.5"/>
      <rect x="61" y="47" width="6" height="6" rx="1" fill="rgba(253, 224, 71, 0.3)"/>
     
      <path d="M42 86 L42 58 Q50 46 58 58 L58 86 Z" fill="url(#doorGrad)"/>
      <path d="M44 86 L44 60 Q50 50 56 60 L56 86" fill="none" stroke="#D4AF37" strokeWidth="1"/>
      <circle cx="54" cy="72" r="2.5" fill="#FCD34D"/>
     
      <rect x="10" y="86" width="80" height="6" rx="2" fill="#78350F"/>
      <rect x="10" y="86" width="80" height="2" rx="1" fill="#92400E"/>
    </svg>
   
    <div className="absolute -top-1 -right-1">
      <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
 
  const hasSeenDisclaimer = localStorage.getItem('disclaimer_seen') === 'true';
 
  const [showDisclaimer, setShowDisclaimer] = useState(!hasSeenDisclaimer);
  const [copied, setCopied] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (!user.user_type) {
        navigate('/select-type', { replace: true });
      } else {
        navigate('/map', { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleLogin = () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
   
    // Emergent Auth - Funciona inmediatamente sin configuración
    const returnUrl = window.location.origin;
    const emergentAuthUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(returnUrl)}`;
   
    window.location.href = emergentAuthUrl;
  };

  const handleDisclaimerClose = () => {
    localStorage.setItem('disclaimer_seen', 'true');
    setShowDisclaimer(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'La Pulpería',
          text: '¡Descubre La Pulpería! Conectando comunidades hondureñas',
          url: window.location.origin
        });
      } catch (e) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="w-14 h-14 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-500 mt-4 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <AnimatedBackground />
     
      {showDisclaimer && <DisclaimerModal onClose={handleDisclaimerClose} />}
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="text-center max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6 animate-scale-in">
              <PulperiaLogo />
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-black text-white leading-none">
                  La <span className="gradient-text">Pulpería</span>
                </h1>
              </div>
            </div>
           
            <p className="text-stone-400 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              ¿Qué deseaba?
            </p>
           
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="group relative overflow-hidden galactic-button text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-scale-in mb-4"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
             
              {!isLoggingIn ? (
                <span className="relative flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Comenzar con Google
                  <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </span>
              ) : (
                <span className="relative flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Conectando...
                </span>
              )}
            </button>
            
            {/* Indicador de Emergent Auth */}
            <p className="text-sm text-stone-400 mb-10">
              ⚡ Emergent Auth (funciona en todos los dominios)
            </p>

            {/* Resto del contenido igual */}
            <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-stone-500 text-sm mb-4 uppercase tracking-wider">Cómo funciona</p>
             
              <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-2xl p-4 text-center group hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20 mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Explora</h3>
                  <p className="text-stone-500 text-xs leading-tight">Encuentra pulperías cerca de ti</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center group hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Ordena</h3>
                  <p className="text-stone-500 text-xs leading-tight">Agrega productos y haz tu pedido</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center group hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg shadow-green-500/20 mb-3 group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Recibe</h3>
                  <p className="text-stone-500 text-xs leading-tight">Te avisamos cuando esté listo</p>
                </div>
              </div>
              
              <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">¿Tienes una pulpería?</p>
                  <p className="text-stone-500 text-xs">Registra tu negocio gratis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-8 animate-slide-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex justify-center gap-3 mb-4">
            <a
              href="https://x.com/LaPul_periaHN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 glass hover:bg-white/10 text-white py-2.5 px-4 rounded-xl transition-all duration-300 hover-lift"
            >
              <XIcon />
              <span className="text-sm font-medium">X</span>
            </a>
            <a
              href="https://www.instagram.com/lapulperiah?igsh=MXJlemJzaTl4NDIxdQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2.5 px-4 rounded-xl transition-all duration-300 hover-lift"
            >
              <InstagramIcon />
              <span className="text-sm font-medium">Instagram</span>
            </a>
          </div>
          
          <div className="max-w-sm mx-auto">
            <div className="glass rounded-2xl p-3">
              <p className="text-stone-500 text-xs text-center mb-2">Comparte La Pulpería</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-black/30 rounded-xl px-3 py-2 text-xs text-stone-500 truncate border border-white/5">
                  {window.location.host}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded-xl transition-all duration-300 hover-lift ${copied ? 'bg-green-600' : 'bg-stone-800 hover:bg-stone-700'} text-white`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleShare}
                  className="px-3 py-2 rounded-xl galactic-button text-white transition-all duration-300 hover-lift"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-stone-600 text-xs mt-4 flex items-center justify-center gap-2">
            <span>🇭🇳</span>
            <span>Conectando comunidades hondureñas</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
