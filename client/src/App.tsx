import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { AlertContainer } from './components/Alert';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const MainContent: React.FC = () => {
  const { user } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex flex-col text-slate-100">
      <Navbar />

      <main className="flex-1">
        {user ? (
          <Dashboard />
        ) : authPage === 'login' ? (
          <Login onSwitchToRegister={() => setAuthPage('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthPage('login')} />
        )}
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🐌</span>
            <span className="font-bold text-slate-400">Snail Races</span>
          </div>
          <p>© 2026 Snail Races Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <MainContent />
        <AlertContainer />
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
