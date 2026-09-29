import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, setIsSnailPayOpen } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-lg font-black shadow-md shadow-emerald-500/20">
            🐌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                SNAIL RACES
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Betting Platform</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">

            {/* User Profile / Logout */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[130px]">{user.email}</span>
              </div>

              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </header>
  );
};
