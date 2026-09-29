import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { User as UserIcon, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<Props> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const { showAlert } = useAlert();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password rule checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  const allRulesPass = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      showAlert('error', 'Name is required.');
      return;
    }
    if (!lastName.trim()) {
      showAlert('error', 'Last name is required.');
      return;
    }
    if (!email.trim()) {
      showAlert('error', 'Email is required.');
      return;
    }

    if (!allRulesPass) {
      showAlert('error', 'Password does not meet all the requirements. Please review the rules below the password field.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('error', 'Passwords do not match. Please make sure both fields are identical.');
      return;
    }

    setLoading(true);
    const success = await register(firstName.trim(), lastName.trim(), email.trim(), password);
    setLoading(false);
    if (!success) {
      showAlert('error', 'Account could not be created. The email address may already be in use.');
    } else {
      showAlert('success', 'Account created successfully! Welcome to Snail Races.');
    }
  };

  const RuleIndicator: React.FC<{ passed: boolean; label: string }> = ({ passed, label }) => (
    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${passed ? 'text-emerald-600' : 'text-slate-400'}`}>
      {passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md clean-panel rounded-3xl p-8 shadow-xl bg-white relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white mx-auto mb-3 shadow-md flex items-center justify-center text-2xl font-black">
            🐌
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create a Snail Races Account</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Enter your information to sign up</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full clean-input rounded-xl py-2.5 pl-9 pr-3 text-xs font-medium focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full clean-input rounded-xl py-2.5 px-3 text-xs font-medium focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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

            {/* Password Requirements Label */}
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">Password Requirements</p>
              <RuleIndicator passed={hasMinLength} label="Minimum 8 characters" />
              <RuleIndicator passed={hasUppercase} label="At least one uppercase letter (A-Z)" />
              <RuleIndicator passed={hasNumber} label="At least one number (0-9)" />
              <RuleIndicator passed={hasSpecial} label="At least one special character (!@#$...)" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full clean-input rounded-xl py-2.5 pl-9 pr-10 text-xs font-medium focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer link to login */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-emerald-600 hover:underline"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
