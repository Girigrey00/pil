import React from 'react';
import { LayoutDashboard, UploadCloud, LogOut, FileText } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'upload';
  setActiveTab: (tab: 'dashboard' | 'upload') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'New Request', icon: UploadCloud },
  ] as const;

  return (
    <aside className="w-72 bg-[#0A2540] flex flex-col h-screen fixed left-0 top-0 shadow-xl z-20 transition-all duration-300 text-white">
      <div className="p-8 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md shrink-0">
          <FileText className="w-6 h-6 text-[#0A2540]" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-white tracking-tight leading-none">GERNAS</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">PIL</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-white text-[#0A2540] shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-[#0A2540]' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'dashboard' && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap uppercase tracking-wide ${isActive ? 'bg-[#0A2540] text-white' : 'bg-white/20 text-white'}`}>
                  Beta
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
        >
          <LogOut className="w-6 h-6" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;