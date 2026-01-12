import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin({ username: 'admin', role: 'admin' });
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-md p-6">
        <div className="mb-10 text-center flex flex-col items-center">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-200">
             <ShieldCheck className="w-8 h-8" />
           </div>
           <div className="flex flex-col items-center">
             <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">GERNAS</h1>
             <span className="text-sm font-bold text-blue-600 tracking-[0.3em] mt-1.5">PIL</span>
           </div>
           <p className="text-slate-500 mt-4 font-medium">Secure Access Gateway</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium text-slate-900 placeholder-slate-400"
                  placeholder="ID / Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
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