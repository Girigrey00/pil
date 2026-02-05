import React from 'react';
import { LayoutDashboard, Layers, LogOut, Settings, Shield, FileText } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'upload';
  setActiveTab: (tab: 'dashboard' | 'upload') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="w-64 bg-[#0B1E48] flex flex-col h-screen fixed left-0 top-0 z-30 transition-all duration-300 text-white border-r border-[#1a3675]">
      {/* Brand Section */}
      <div className="flex flex-col items-center py-10">
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 mb-4 border-4 border-[#162e66]">
          <span className="text-2xl font-black text-white">G</span>
        </div>
        <h1 className="text-xl font-bold tracking-wider text-white">GERNAS</h1>
        <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] mt-1">ISOP SYSTEM</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div className="px-4 mb-3 text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-80">Menu</div>
        
        <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                activeTab === 'dashboard'
                ? 'bg-[#1D4ED8] text-white shadow-lg shadow-blue-900/20'
                : 'text-blue-100/70 hover:bg-[#162e66] hover:text-white'
            }`}
        >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
        </button>

        <button
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                activeTab === 'upload'
                ? 'bg-[#1D4ED8] text-white shadow-lg shadow-blue-900/20'
                : 'text-blue-100/70 hover:bg-[#162e66] hover:text-white'
            }`}
        >
            <Layers className="w-4 h-4" />
            <span>Procedures</span>
        </button>
         
         {/* Static items for theme matching */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100/70 hover:bg-[#162e66] hover:text-white transition-all duration-200 font-medium text-sm">
            <Shield className="w-4 h-4" />
            <span>Policy Standards</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100/70 hover:bg-[#162e66] hover:text-white transition-all duration-200 font-medium text-sm">
            <FileText className="w-4 h-4" />
            <span>Process Lineage</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100/70 hover:bg-[#162e66] hover:text-white transition-all duration-200 font-medium text-sm">
            <Settings className="w-4 h-4" />
            <span>Impact Assessment</span>
        </button>

      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#162e66] bg-[#08183a]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-300 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;