import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Security & Rate Limiting State ---
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // --- Forgot Password Modal State ---
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ loading: false, success: '', error: '' });

  // Countdown timer for Rate Limit Lockout
  useEffect(() => {
    let timer;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockoutTimer === 0 && failedAttempts >= 5) {
      // Reset attempts after cooldown expires
      setFailedAttempts(0);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer, failedAttempts]);

  // Handle Login Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Rate Limit Enforcement
    if (lockoutTimer > 0) {
      setError(`Too many failed login attempts. Please wait ${lockoutTimer} seconds.`);
      return;
    }

    // 2. Strict Input Validation & Sanitization
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !password) {
      setError('Both email and password are required.');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);

      // 3. Configure Session Persistence (Caching)
      // 'Local' keeps user logged in after browser close; 'Session' clears on tab close.
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      // 4. Authenticate User
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      
      // Reset rate limit counter on success
      setFailedAttempts(0);

    } catch (err) {
      console.error('Auth Error:', err.code);

      // Increment failed attempt counter
      const newAttemptCount = failedAttempts + 1;
      setFailedAttempts(newAttemptCount);

      // Lockout trigger: 5 failed attempts = 60-second cooldown
      if (newAttemptCount >= 5) {
        setLockoutTimer(60);
        setError('Too many failed attempts. Account login temporarily locked for 60 seconds.');
      } else {
        // Generic error message to prevent account enumeration attacks
        setError('Invalid email address or password. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Form
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetStatus({ loading: true, success: '', error: '' });

    const trimmedResetEmail = resetEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedResetEmail)) {
      setResetStatus({ loading: false, success: '', error: 'Please enter a valid email address.' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, trimmedResetEmail);
      setResetStatus({
        loading: false,
        success: `If an account exists for ${trimmedResetEmail}, a password reset link has been dispatched.`,
        error: ''
      });
      setResetEmail('');
    } catch (err) {
      console.error('Reset Password Error:', err);
      // Neutral response to protect user privacy
      setResetStatus({
        loading: false,
        success: 'If an account exists with this email, a password reset link has been dispatched.',
        error: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Logo Header */}
        <div className="flex justify-center mb-6">
          <img 
            src="/MalutiLogo.png" 
            alt="Maluti TVET College" 
            className="h-20 w-auto object-contain"
            onError={(e) => { e.target.src = 'https://placehold.co/100x100/00B5E2/white?text=M'; }}
          />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#141632]">
          QMS Intranet Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with your staff or student credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border-t-4 border-[#F2A900]">
          
          <form className="space-y-6" onSubmit={handleLogin} noValidate aria-live="polite">
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-red-700">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-bold text-[#141632]">
                Email address
              </label>
              <div className="mt-2 flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#00B5E2] focus-within:ring-1 focus-within:ring-[#00B5E2]">
                <Mail size={18} className="text-slate-400 mr-2 shrink-0" />
                <input 
                  id="login-email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  autoComplete="username"
                  className="w-full outline-none sm:text-sm bg-transparent" 
                  placeholder="name@malutitvet.co.za"
                  disabled={lockoutTimer > 0}
                  required
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-bold text-[#141632]">
                Password
              </label>
              <div className="mt-2 flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#00B5E2] focus-within:ring-1 focus-within:ring-[#00B5E2]">
                <Lock size={18} className="text-slate-400 mr-2 shrink-0" />
                <input 
                  id="login-password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="current-password" 
                  className="w-full outline-none sm:text-sm bg-transparent" 
                  disabled={lockoutTimer > 0}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="text-[#141632] ml-2 hover:text-[#00B5E2] transition-colors focus:outline-none"
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help Links */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#00B5E2] focus:ring-[#00B5E2]"
                />
                <span className="text-xs font-semibold text-gray-600">Remember session</span>
              </label>

              <button 
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="font-bold text-xs text-[#00B5E2] hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading || lockoutTimer > 0} 
              className="w-full mt-6 flex justify-center items-center gap-2 rounded-md bg-[#00B5E2] px-4 py-2.5 font-bold text-white transition hover:bg-[#009639] disabled:cursor-not-allowed disabled:opacity-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B5E2]"
            >
              {loading ? (
                'Authenticating...'
              ) : lockoutTimer > 0 ? (
                `Locked (${lockoutTimer}s)`
              ) : (
                <>
                  <Shield size={18} />
                  SECURE SIGN IN
                </>
              )}
            </button>
          </form>

          {/* Contact Support Link */}
          <div className="mt-4 text-center">
            <a 
              className="font-bold text-xs text-[#00a651] hover:underline" 
              href="mailto:ictsupport@malutitvet.co.za"
            >
              Contact ICT Support
            </a>
          </div>

          {/* Privacy Notice */}
          <p className="mt-6 rounded-md bg-slate-50 p-4 text-xs leading-5 text-slate-600 border border-slate-200">
            <strong>Privacy Notice:</strong> MalutiQMS is for authorised Maluti TVET College users only. Activity may be monitored to protect college systems and data.
          </p>
          
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL --- */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border-t-4 border-[#00B5E2] relative">
            <button 
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-extrabold text-[#141632] mb-2">Reset Your Password</h3>
            <p className="text-xs text-gray-500 mb-6">
              Enter your college email address and we will dispatch a password reset link to your inbox.
            </p>

            {resetStatus.success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-md font-bold flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{resetStatus.success}</span>
              </div>
            )}

            {resetStatus.error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-md font-bold flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{resetStatus.error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. staff@malutitvet.co.za"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00B5E2]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  disabled={resetStatus.loading}
                  className="px-4 py-2 bg-[#00B5E2] hover:bg-[#009639] text-white text-xs font-bold rounded-md transition-colors disabled:opacity-50"
                >
                  {resetStatus.loading ? 'Dispatching...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}