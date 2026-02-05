import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import { HistoryResponse, UploadResponsePayload } from './types';
import { fetchHistory } from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [historyData, setHistoryData] = useState<HistoryResponse>({
    status: '',
    Total_Count: 0,
    Rejected: 0,
    data: []
  });
  
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const userDisplayName = 'Admin User';
  const userInitials = 'AD';

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAuthenticated) {
      loadHistory();
      intervalId = setInterval(() => {
        loadHistory(true);
      }, 3000);
    }
    return () => clearInterval(intervalId);
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
    loadHistory(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-surface font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - behaves as a flex item now */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Floating Header Look */}
        <header className="h-20 px-8 flex items-center justify-between shrink-0 bg-surface z-10">
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
               {activeTab === 'dashboard' ? 'Overview' : 'Upload Files'}
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center shadow-md font-bold text-sm hover:scale-105 transition-transform">
                {userInitials}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-2">
          <div className="max-w-[1600px] mx-auto w-full">
            {activeTab === 'dashboard' && (
              isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-500 font-medium">Loading data...</p>
                </div>
              ) : (
                <Dashboard data={historyData} />
              )
            )}
            {activeTab === 'upload' && <UploadPage onUploadSuccess={handleUploadSuccess} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;