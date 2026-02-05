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
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] bg-brand opacity-[0.03] rounded-full blur-3xl transform rotate-12"></div>
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[80%] bg-blue-400 opacity-[0.03] rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-floating border border-white/50 p-10 backdrop-blur-sm">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-2">Sign in to GERNAS PIL System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand focus:bg-white transition-all outline-none"
                  placeholder="Username"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand focus:bg-white transition-all outline-none"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 bg-brand hover:bg-brand-hover text-white font-bold rounded-full shadow-lg shadow-brand/25 hover:shadow-brand/40 transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">&copy; 2024 Gernas Systems</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;