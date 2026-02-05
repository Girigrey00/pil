import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import { HistoryResponse, UploadResponsePayload } from './types';
import { fetchHistory } from './services/api';
import { Bell, Search, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  // Simple state-based auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');
  
  // State for history data matching the new API response structure
  const [historyData, setHistoryData] = useState<HistoryResponse>({
    status: '',
    Total_Count: 0,
    Rejected: 0,
    data: []
  });
  
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Mock User Info
  const userDisplayName = 'Admin User';
  const userEmail = 'admin@gernas.com';
  const userInitials = 'AD';

  useEffect(() => {
    // Check local storage for persistent login (optional for "as of now")
    const storedAuth = localStorage.getItem('isAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAuthenticated) {
      // Initial load with spinner
      loadHistory();

      // Poll every 3 seconds silently (no spinner) to update status
      intervalId = setInterval(() => {
        loadHistory(true);
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
    setHistoryData({ status: '', Total_Count: 0, Rejected: 0, data: [] });
  };

  const loadHistory = async (silent = false) => {
    if (!silent) setIsLoadingHistory(true);
    try {
      // Use a mock token since we are in admin/admin mode
      const dummyToken = "mock-token"; 
      const data = await fetchHistory(dummyToken);
      setHistoryData(data);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      if (!silent) setIsLoadingHistory(false);
    }
  };

  const handleUploadSuccess = (response: UploadResponsePayload) => {
    // Refresh history immediately
    loadHistory(true);
    // Stay on upload page or show success message there
  };

  // Show Login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F4F7FC] text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between shrink-0 bg-white border-b border-slate-200 z-10 sticky top-0 shadow-sm">
          <div className="flex flex-col">
             <h1 className="text-xl font-bold text-[#0B1E48] tracking-tight">
               {activeTab === 'dashboard' ? 'Overview' : 'Procedures'}
             </h1>
             <p className="text-xs text-slate-500 font-medium mt-0.5">
               {activeTab === 'dashboard' ? 'View Operational Metrics' : 'Manage Operational Procedures and Flows'}
             </p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative hidden md:block group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search products..." 
                 className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white w-64 transition-all"
               />
            </div>

            <div className="w-px h-8 bg-slate-100 mx-2"></div>
            
            <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 bg-[#0B1E48] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-900/20">
                {userInitials}
              </div>
              <div className="hidden sm:block leading-tight cursor-pointer hover:opacity-80">
                 <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{userDisplayName}</p>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-[#F4F7FC]">
          {activeTab === 'dashboard' && (
            isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Dashboard data={historyData} />
            )
          )}
          {activeTab === 'upload' && <UploadPage onUploadSuccess={handleUploadSuccess} />}
        </div>
      </main>
    </div>
  );
};

export default App;