import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import { HistoryResponse, UploadResponsePayload } from './types';
import { fetchHistory } from './services/api';
import { Bell } from 'lucide-react';

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
    // Optional: switch to dashboard to see result
    // setActiveTab('dashboard'); 
  };

  // Show Login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between shrink-0 bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
             <span className="font-bold text-[#003da5] tracking-tight">GERNAS</span>
             <span className="text-slate-300">/</span>
             <span className="text-[#003da5] capitalize">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-[#003da5] hover:bg-slate-100 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-[#003da5]">{userDisplayName}</p>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{userEmail}</p>
              </div>
              <button className="w-10 h-10 bg-[#003da5] text-white rounded-full flex items-center justify-center shadow-sm font-bold transition-colors">
                {userInitials}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 pt-6">
          {activeTab === 'dashboard' && (
            isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-[#003da5] border-t-transparent rounded-full animate-spin"></div>
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