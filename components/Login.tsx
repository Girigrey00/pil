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
    <div className="min-h-screen flex items-center justify-center bg-[#0B1E48] text-slate-900 font-sans relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="mb-10 text-center flex flex-col items-center">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 shadow-2xl shadow-blue-900/50">
             <span className="text-3xl font-black text-[#0B1E48]">G</span>
           </div>
           <h1 className="text-3xl font-bold tracking-tight text-white">GERNAS</h1>
           <span className="text-xs font-bold text-blue-300 tracking-[0.3em] mt-2 uppercase">ISOP System</span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 pt-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent sm:text-sm transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent sm:text-sm transition-all"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-xs font-semibold text-center bg-red-50 py-2.5 rounded-lg border border-red-100">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B1E48] hover:bg-[#162e66] text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] mt-4 text-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-blue-200/60 font-medium">
          &copy; 2024 Gernas Systems. Secured Access.
        </p>
      </div>
    </div>
  );
};

export default Login;