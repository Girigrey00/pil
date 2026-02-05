import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid credentials. Please use admin/admin.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-brand font-sans">
      <div className="w-full max-w-md p-6">
        <div className="mb-10 text-center flex flex-col items-center">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand text-white mb-6 shadow-xl shadow-brand/20">
             <ShieldCheck className="w-8 h-8" />
           </div>
           <div className="flex flex-col items-center">
             <h1 className="text-4xl font-black tracking-tight text-brand leading-none">GERNAS</h1>
             <span className="text-sm font-bold text-slate-400 tracking-[0.3em] mt-1.5">PIL</span>
           </div>
           <p className="text-slate-500 mt-4 font-medium">Secure Access Gateway</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 p-10 border border-slate-200 flex flex-col gap-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-brand">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Please sign in to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent sm:text-sm transition-all text-brand"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent sm:text-sm transition-all text-brand"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-semibold text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-brand hover:bg-brand-dark text-white font-bold rounded-lg shadow-lg shadow-brand/20 transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          &copy; 2024 Gernas Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;