import React from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
        console.error(e);
    });
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

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100 flex flex-col items-center gap-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Please sign in with your organization account to access the dashboard.</p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 px-6 bg-[#2F2F2F] hover:bg-[#1a1a1a] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {/* Microsoft Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            <span>Sign in with Microsoft</span>
          </button>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          &copy; 2024 Gernas Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;