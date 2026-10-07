import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSkinSense } from '../context/SkinSenseContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, loginGoogle, authError, clearAuthError, isAuthLoading, setCurrentPage } =
    useSkinSense();

  const prefersReduced = useReducedMotion();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation & errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Mouse Parallax coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    clearAuthError();
    setFormErrors({});
  }, [mode, clearAuthError]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReduced) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = (clientX - centerX) / centerX;
    const y = (clientY - centerY) / centerY;
    setMousePos({ x, y });
  };

  // Password Strength Calculation
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-transparent' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-[#C86D51]' };
    if (score === 3) return { score: 2, label: 'Fair', color: 'bg-[#D4A373]' };
    if (score === 4) return { score: 3, label: 'Good', color: 'bg-[#8FBC8F]' };
    return { score: 4, label: 'Strong', color: 'bg-[#3D5440]' };
  };

  const strength = calculateStrength(password);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (mode === 'signup' && (!name || name.trim().length < 2)) {
      errors.name = 'Please provide your full name (min 2 characters).';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (mode === 'signup' && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'signin') {
      await login(email, password, rememberMe);
    } else {
      await register(name, email, password);
    }
  };

  const handleGoogleAuth = async () => {
    await loginGoogle();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #FAF6F0 0%, #F3EDE2 50%, #E8DFC8 100%)',
      }}
    >
      {/* ================= BACKGROUND GRAPHICS & TEXTURES ================= */}

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(90, 75, 65, 0.08) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(90, 75, 65, 0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Subtle Film Grain Noise SVG filter */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035] mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Soft Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(60,50,40,0.12)_100%)]" />

      {/* ================= FLOATING 3D GLASS TILES (PARALLAX) ================= */}

      {/* Tile 1: Top-Left Floating Tilted Glass Tile with Travertine Texture & Rose-Gold Wave */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                y: [0, -18, 0],
                rotateZ: [-14, -11, -14],
              }
        }
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:block absolute -top-4 left-6 lg:left-24 w-52 h-64 rounded-3xl p-4 border border-white/70 shadow-2xl backdrop-blur-xl pointer-events-none z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(245,235,225,0.2) 100%)',
          boxShadow: '0 30px 60px -12px rgba(90,70,50,0.15), inset 0 1px 1px rgba(255,255,255,0.9)',
          transform: `perspective(1000px) rotateX(${15 + mousePos.y * 4}deg) rotateY(${-12 + mousePos.x * 5}deg) rotateZ(-12deg) translate3d(${mousePos.x * -35}px, ${mousePos.y * -30}px, 20px)`,
        }}
      >
        {/* Travertine speckled dots */}
        <div className="absolute inset-0 rounded-3xl opacity-30 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:12px_12px]" />
        {/* Rose-Gold Organic Wave Line */}
        <svg className="w-full h-full" viewBox="0 0 200 240" fill="none">
          <path
            d="M -20 180 C 40 100, 100 220, 220 130"
            stroke="url(#roseGoldGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="roseGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2A78F" />
              <stop offset="50%" stopColor="#C5856B" />
              <stop offset="100%" stopColor="#ECC4B2" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Tile 2: Top-Right Glass Tile with Clean Refraction & Curved Arch Wave */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                y: [0, 16, 0],
                rotateZ: [16, 13, 16],
              }
        }
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,250,245,0.18) 100%)',
          boxShadow: '0 25px 50px -10px rgba(90,70,50,0.12), inset 0 1px 1px rgba(255,255,255,0.95)',
          transform: `perspective(1000px) rotateX(${12 - mousePos.y * 5}deg) rotateY(${16 - mousePos.x * 6}deg) rotateZ(15deg) translate3d(${mousePos.x * 40}px, ${mousePos.y * 32}px, 10px)`,
        }}
        className="hidden md:block absolute top-12 right-8 lg:right-28 w-48 h-56 rounded-3xl p-3 border border-white/80 shadow-2xl backdrop-blur-xl pointer-events-none z-10"
      >
        <svg className="w-full h-full" viewBox="0 0 180 200" fill="none">
          <path
            d="M 10 30 C 80 120, 110 50, 170 170"
            stroke="url(#roseGoldGrad2)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="roseGoldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D0C0" />
              <stop offset="100%" stopColor="#C88265" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Tile 3: Bottom-Left Frosted Speckled Travertine Tile */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                y: [0, -14, 0],
                rotateZ: [10, 13, 10],
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(240,230,220,0.22) 100%)',
          boxShadow: '0 20px 45px -8px rgba(70,50,30,0.1), inset 0 1px 1px rgba(255,255,255,0.85)',
          transform: `perspective(1000px) rotateX(${-10 + mousePos.y * 4}deg) rotateY(${-14 + mousePos.x * 4}deg) rotateZ(8deg) translate3d(${mousePos.x * -25}px, ${mousePos.y * -20}px, 0px)`,
        }}
        className="hidden sm:block absolute -bottom-6 left-12 lg:left-36 w-52 h-48 rounded-3xl p-4 border border-white/60 shadow-xl backdrop-blur-lg pointer-events-none z-10"
      >
        <div className="absolute inset-0 rounded-3xl opacity-20 bg-[radial-gradient(#A67C52_1px,transparent_1px)] [background-size:10px_10px]" />
        <svg className="w-full h-full" viewBox="0 0 200 180" fill="none">
          <path
            d="M 0 90 Q 90 20, 200 120"
            stroke="url(#roseGoldGrad3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="roseGoldGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECC4B2" />
              <stop offset="100%" stopColor="#A86249" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Tile 4: Bottom-Right Skewed Tile with Curved Accent */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                y: [0, 12, 0],
                rotateZ: [-18, -15, -18],
              }
        }
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          background: 'linear-gradient(150deg, rgba(255,255,255,0.42) 0%, rgba(245,238,230,0.2) 100%)',
          boxShadow: '0 24px 50px -10px rgba(90,70,50,0.12), inset 0 1px 1px rgba(255,255,255,0.85)',
          transform: `perspective(1000px) rotateX(${-8 - mousePos.y * 4}deg) rotateY(${14 - mousePos.x * 5}deg) rotateZ(-16deg) translate3d(${mousePos.x * 30}px, ${mousePos.y * 25}px, 15px)`,
        }}
        className="hidden md:block absolute -bottom-10 right-14 lg:right-40 w-48 h-56 rounded-3xl p-3 border border-white/70 shadow-2xl backdrop-blur-xl pointer-events-none z-10"
      >
        <svg className="w-full h-full" viewBox="0 0 180 200" fill="none">
          <path
            d="M 180 60 C 100 10, 80 180, 0 150"
            stroke="url(#roseGoldGrad4)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="roseGoldGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DCA48E" />
              <stop offset="100%" stopColor="#8E523A" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ================= ORGANIC PROPS (SPHERES, ARCH, LEAVES, STONE) ================= */}

      {/* Prop 1: Large Terracotta / Peach Sphere with Radial Lighting (Top Right) */}
      <motion.div
        animate={prefersReduced ? {} : { y: [0, -12, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 18}px, 0)`,
          background: 'radial-gradient(circle at 35% 30%, #F5C6B0 0%, #E29E80 40%, #B86749 85%, #8B4329 100%)',
          boxShadow: '0 25px 50px rgba(139, 67, 41, 0.28), inset -8px -8px 20px rgba(70, 25, 10, 0.35)',
        }}
        className="absolute top-20 right-6 sm:right-20 lg:right-48 w-24 h-24 sm:w-32 sm:h-32 rounded-full pointer-events-none z-0"
      />

      {/* Prop 2: Small Warm Peach Sphere (Bottom Left) */}
      <motion.div
        animate={prefersReduced ? {} : { y: [0, 10, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{
          transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -14}px, 0)`,
          background: 'radial-gradient(circle at 38% 32%, #FFD8C4 0%, #EEAA8C 45%, #C26C4E 90%)',
          boxShadow: '0 16px 36px rgba(160, 80, 50, 0.22), inset -4px -4px 10px rgba(90, 40, 20, 0.25)',
        }}
        className="absolute bottom-24 left-8 sm:left-24 lg:left-56 w-16 h-16 sm:w-20 sm:h-20 rounded-full pointer-events-none z-0"
      />

      {/* Prop 3: Rose-Gold Ring / Arch on the Right */}
      <motion.div
        animate={prefersReduced ? {} : { rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-8 w-56 h-80 rounded-[60px] border-[6px] border-[#DE9E87]/40 shadow-xl pointer-events-none z-0"
        style={{
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 10}px, 0)`,
          borderImage: 'linear-gradient(to bottom, rgba(240,190,170,0.7), rgba(180,100,75,0.25)) 1',
          filter: 'drop-shadow(0 15px 30px rgba(180,110,85,0.18))',
        }}
      />

      {/* Prop 4: Blurred Soft Stone Shape (Bottom Left Floor) */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 40% 40%, #E6DCD1 0%, #D8CABE 60%, #BCAC9F 100%)',
          boxShadow: '0 20px 40px rgba(70,60,50,0.15)',
        }}
        className="absolute -bottom-8 left-4 w-44 h-28 rounded-[50%_40%_60%_35%] blur-[2px] opacity-75 pointer-events-none z-0"
      />

      {/* Prop 5: Soft Green Organic Plant Leaves (Bottom Right Corner, Partly Out of Focus) */}
      <div className="absolute -bottom-6 -right-6 w-52 h-52 pointer-events-none opacity-85 blur-[1.5px] z-20">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <path
            d="M 170 190 C 130 140, 110 90, 150 40 C 180 80, 190 140, 170 190 Z"
            fill="url(#leafGrad1)"
            opacity="0.9"
          />
          <path
            d="M 190 180 C 120 150, 70 110, 80 50 C 120 70, 160 120, 190 180 Z"
            fill="url(#leafGrad2)"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7E9F83" />
              <stop offset="100%" stopColor="#435B48" />
            </linearGradient>
            <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3BEA8" />
              <stop offset="100%" stopColor="#55715B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ================= CENTER FROSTED GLASS LOGIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: prefersReduced
            ? 'none'
            : `perspective(1000px) rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 3}deg)`,
        }}
        className="relative z-30 w-full max-w-md mx-auto"
      >
        <div
          className="rounded-[28px] p-8 sm:p-10 border border-white/80 shadow-[0_25px_60px_rgba(60,45,30,0.12)] relative overflow-hidden transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.28)',
            backdropFilter: 'blur(24px) saturate(170%)',
            WebkitBackdropFilter: 'blur(24px) saturate(170%)',
          }}
        >
          {/* Subtle Glass Card Top Highlight Reflection */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

          {/* Card Header */}
          <div className="text-center space-y-2 mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 border border-white/60 text-[10px] font-mono tracking-wider text-[#554A42] uppercase shadow-sm mb-1">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>SkinSense Member Access</span>
            </div>

            <h1 className="editorial-heading text-3xl sm:text-4xl font-light text-[#2A2420]">
              {mode === 'signin' ? 'Welcome back' : 'Create profile'}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#554A42]">
              {mode === 'signin'
                ? 'Sign in to access your digital consultation and tailored regimens.'
                : 'Join SkinSense AI for clinical biometric skin insights.'}
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-2xl bg-[#FDF2EE] border border-[#F0D1C6] text-xs text-[#85341E] flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </motion.div>
          )}

          {/* Social Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isAuthLoading}
            className="w-full py-2.5 px-4 rounded-full bg-white/60 hover:bg-white/90 border border-white/90 text-xs font-sans font-medium text-[#2A2420] flex items-center justify-center gap-2.5 shadow-sm transition-all duration-300 active:scale-[0.98] mb-5 focus:outline-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/60" />
            </div>
            <span className="relative px-3 bg-white/40 backdrop-blur-md rounded-full text-[10px] font-mono text-[#554A42] uppercase">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  <label className="block text-[11px] font-mono text-[#554A42] uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D2B]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 border border-white/80 focus:border-[#C5856B] focus:bg-white/80 text-xs text-[#2A2420] placeholder-[#554A42]/50 transition-all outline-none"
                    />
                  </div>
                  {formErrors.name && (
                    <span className="text-[10px] text-[#85341E] block">{formErrors.name}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-[#554A42] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D2B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 border border-white/80 focus:border-[#C5856B] focus:bg-white/80 text-xs text-[#2A2420] placeholder-[#554A42]/50 transition-all outline-none"
                />
              </div>
              {formErrors.email && (
                <span className="text-[10px] text-[#85341E] block">{formErrors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono text-[#554A42] uppercase tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email.')}
                    className="text-[11px] font-sans text-[#8C6D2B] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D2B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/50 border border-white/80 focus:border-[#C5856B] focus:bg-white/80 text-xs text-[#2A2420] placeholder-[#554A42]/50 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#554A42] hover:text-[#2A2420]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {formErrors.password && (
                <span className="text-[10px] text-[#85341E] block">{formErrors.password}</span>
              )}

              {/* Password Strength Meter for Sign Up */}
              {mode === 'signup' && password.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#554A42]">Security:</span>
                    <span className="font-semibold text-[#2A2420]">{strength.label}</span>
                  </div>
                  <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden flex gap-1 p-0.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          strength.score >= step ? strength.color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="confirm-password-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  <label className="block text-[11px] font-mono text-[#554A42] uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D2B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 border border-white/80 focus:border-[#C5856B] focus:bg-white/80 text-xs text-[#2A2420] placeholder-[#554A42]/50 transition-all outline-none"
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <span className="text-[10px] text-[#85341E] block">
                      {formErrors.confirmPassword}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me Checkbox */}
            {mode === 'signin' && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-[#2A2420] cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-[#554A42] cursor-pointer">
                  Remember me on this browser (30 days)
                </label>
              </div>
            )}

            {/* Submit Pill Button with Soft Peach Glow */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3.5 px-6 rounded-full font-sans font-medium text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #2A2420 0%, #3F3630 100%)',
                  boxShadow: '0 10px 25px -4px rgba(226, 158, 128, 0.45), 0 0 15px rgba(245, 198, 176, 0.35)',
                }}
              >
                {/* Subtle Pulsing Peach Glow underlay */}
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-[#E2A78F]/20 via-[#F5C6B0]/30 to-[#E2A78F]/20 pointer-events-none"
                />

                {isAuthLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign in to Profile' : 'Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-6 text-center pt-4 border-t border-white/60">
            <span className="text-xs text-[#554A42]">
              {mode === 'signin' ? "Don't have a profile yet? " : 'Already registered with SkinSense? '}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-xs font-semibold text-[#2A2420] underline hover:text-[#8C6D2B] transition-colors"
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in here'}
            </button>
          </div>

          {/* Quick Demo Fill Pill */}
          <div className="mt-4 pt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('elena@skinsense.ai');
                setPassword('SkinSense@2026');
                setMode('signin');
              }}
              className="text-[10px] font-mono text-[#8C6D2B] bg-white/40 hover:bg-white/70 px-2.5 py-1 rounded-full border border-white/60 transition-all flex items-center gap-1"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-[#3D5440]" />
              <span>Fill Demo Credentials (Elena)</span>
            </button>
          </div>
        </div>

        {/* Security badge below card */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-[#554A42]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3D5440]" />
          <span>Bcrypt 256-Bit Hashing • HTTP-Only Cookie Tokens</span>
        </div>
      </motion.div>
    </div>
  );
};
