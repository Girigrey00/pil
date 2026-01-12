import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import { User, HistoryItem, UploadResponsePayload } from './types';
import { Bell, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      status: 'success',
      cas_id: 'sample_001',
      report_path: 'sample_report_001.csv',
      download_url: '#',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleUploadSuccess = (response: UploadResponsePayload) => {
    const newItem: HistoryItem = {
      ...response,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
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
                <p className="text-sm font-bold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500 font-medium">Administrator</p>
              </div>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm text-blue-700 font-bold hover:border-blue-300 transition-colors">
                AD
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 pt-2">
          {activeTab === 'dashboard' && <Dashboard history={history} />}
          {activeTab === 'upload' && <UploadPage onUploadSuccess={handleUploadSuccess} />}
        </div>
      </main>
    </div>
  );
};

export default App;