import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface Props {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<Props> = ({ onSwitchToRegister }) => {
  const { login, commitLogin, isLoggingIn } = useAuth();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // After login succeeds isLoggingIn becomes true; wait 3s then commitLogin
  useEffect(() => {
    if (isLoggingIn) {
      const timer = setTimeout(() => {
        commitLogin();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoggingIn, commitLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showAlert('error', 'Email is required.');
      return;
    }
    if (!password) {
      showAlert('error', 'Password is required.');
      return;
    }

    setLoading(true);
    const success = await login(email.trim(), password);
    setLoading(false);

    if (!success) {
      showAlert('error', 'Invalid credentials. The email or password you entered is incorrect.');
    }
    // If success, isLoggingIn will become true and the effect above handles the 3s delay
  };

  // Show loading screen while waiting the 3 seconds
  if (isLoggingIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md clean-panel rounded-3xl p-8 shadow-xl bg-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white mx-auto mb-4 shadow-md flex items-center justify-center text-3xl font-black animate-pulse">
            🐌
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Preparing your dashboard…</h2>
          <p className="text-xs text-slate-500 font-medium mb-6">Setting up your session. Please wait.</p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-emerald-600">Loading…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md clean-panel rounded-3xl p-8 shadow-xl bg-white relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white mx-auto mb-3 shadow-md flex items-center justify-center text-2xl font-black">
            🐌
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SNAIL RACES</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Log in to your betting account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full clean-input rounded-xl py-2.5 pl-9 pr-3 text-xs font-medium focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full clean-input rounded-xl py-2.5 pl-9 pr-10 text-xs font-medium focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging in…</span>
              </>
            ) : (
              <>
                <span>Go to the Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer switch to register */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-bold text-emerald-600 hover:underline"
          >
            Create a new account
          </button>
        </div>

      </div>
    </div>
  );
};
