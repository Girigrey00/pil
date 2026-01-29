import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import { HistoryItem, UploadResponsePayload } from './types';
import { fetchHistory } from './services/api';
import { Bell } from 'lucide-react';

// MSAL Imports
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { apiConfig } from "./authConfig";

const App: React.FC = () => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Get active user info
  const activeAccount = accounts[0];
  const userDisplayName = activeAccount?.name || 'Admin User';
  const userEmail = activeAccount?.username || 'user@example.com';
  const userInitials = activeAccount?.name 
    ? activeAccount.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  // Load history when user is authenticated
  useEffect(() => {
    if (isAuthenticated && activeAccount) {
      loadHistory();
    }
  }, [isAuthenticated, activeAccount]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: apiConfig.scopes,
        account: activeAccount
      });
      
      const data = await fetchHistory(tokenResponse.accessToken);
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history", error);
      // If silent token acquisition fails, interaction might be required.
      // In a production app, handle interaction required errors here.
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
      mainWindowRedirectUri: window.location.origin
    });
  };

  const handleUploadSuccess = (response: UploadResponsePayload) => {
    const newItem: HistoryItem = {
      ...response,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  // Show loading state while MSAL is processing
  if (inProgress === InteractionStatus.Startup || inProgress === InteractionStatus.HandleRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show Login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between shrink-0 bg-slate-50/80 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
             <span className="font-bold text-slate-600 tracking-tight">GERNAS</span>
             <span className="text-slate-300">/</span>
             <span className="text-slate-900 capitalize">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-slate-900">{userDisplayName}</p>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{userEmail}</p>
              </div>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm text-blue-700 font-bold hover:border-blue-300 transition-colors">
                {userInitials}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 pt-2">
          {activeTab === 'dashboard' && (
            isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Dashboard history={history} />
            )
          )}
          {activeTab === 'upload' && <UploadPage onUploadSuccess={handleUploadSuccess} />}
        </div>
      </main>
    </div>
  );
};

export default App;