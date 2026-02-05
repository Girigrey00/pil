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
    <aside className="w-72 bg-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-100 z-20 transition-all duration-300">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
          <FileText className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-slate-900 tracking-tight leading-none">GERNAS</span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">PIL</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'dashboard' && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap uppercase tracking-wide">
                  Coming Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-6 h-6" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;