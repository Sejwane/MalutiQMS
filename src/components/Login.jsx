import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Enter both your email address and password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // On success, your App.jsx onAuthStateChanged listener will automatically route the user
    } catch (err) {
      // Secure Error Handling: Hides exact reason from users to prevent enumeration
      console.error("Auth Error:", err);
      setError("Invalid email or password. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Mobile/Fallback Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/MalutiLogo.png" 
            alt="Maluti TVET College" 
            className="h-20 w-auto object-contain"
            onError={(e) => { e.target.src = 'https://placehold.co/100x100/00B5E2/white?text=M' }}
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
          
          <form className="space-y-6" onSubmit={handleLogin} noValidate>
            
            {/* Error Message Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <label className="block">
              <span className="text-sm font-bold text-[#141632]">Email address</span>
              <div className="mt-2 flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#00B5E2] focus-within:ring-1 focus-within:ring-[#00B5E2]">
                <Mail size={18} className="text-slate-400 mr-2" />
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  autoComplete="email" 
                  className="w-full outline-none sm:text-sm" 
                  placeholder="name@malutitvet.co.za"
                />
              </div>
            </label>
            
            {/* Password Input */}
            <label className="block">
              <span className="text-sm font-bold text-[#141632]">Password</span>
              <div className="mt-2 flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#00B5E2] focus-within:ring-1 focus-within:ring-[#00B5E2]">
                <Lock size={18} className="text-slate-400 mr-2" />
                <input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password" 
                  className="w-full outline-none sm:text-sm" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="text-[#141632] ml-2 hover:text-[#00B5E2] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            
            {/* Help Links */}
            <div className="flex items-center justify-between text-sm mt-2">
              <a className="font-bold text-[#00B5E2] hover:underline" href="#">
                Forgot Password?
              </a>
              <a className="font-bold text-[#00a651] hover:underline" href="mailto:ictsupport@malutitvet.co.za">
                Contact ICT Support
              </a>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading} 
              className="w-full mt-6 flex justify-center items-center gap-2 rounded-md bg-[#00B5E2] px-4 py-2.5 font-bold text-white transition hover:bg-[#009639] disabled:cursor-not-allowed disabled:opacity-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B5E2]"
            >
              {loading ? "Authenticating..." : (
                <>
                  <Shield size={18} />
                  SECURE SIGN IN
                </>
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <p className="mt-8 rounded-md bg-slate-50 p-4 text-xs leading-5 text-slate-600 border border-slate-200">
            <strong>Privacy Notice:</strong>MalutiQMS is for authorised Maluti TVET College users only. Activity may be monitored to protect college systems and data.
          </p>
          
        </div>
      </div>
    </div>
  );
}