import React, { useState } from 'react';
import { LayoutDashboard, UploadCloud, LogOut, FileText, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'upload';
  setActiveTab: (tab: 'dashboard' | 'upload') => void;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isCollapsed, toggleCollapse }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'New Request', icon: UploadCloud },
  ] as const;

  return (
    <aside 
      className={`relative flex flex-col h-screen bg-surface-container border-r border-slate-200 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'px-6 gap-3'} transition-all`}>
        <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
          <FileText className="w-6 h-6" strokeWidth={2.5} />
        </div>
        
        <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <span className="text-xl font-bold text-slate-800 tracking-tight leading-none">GERNAS</span>
          <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mt-1">PIL System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex items-center w-full p-3 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-light text-brand font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`flex items-center justify-center shrink-0 w-8 h-8 ${isCollapsed ? 'mx-auto' : ''}`}>
                 <Icon className={`w-6 h-6 transition-colors ${isActive ? 'fill-current opacity-20' : ''} absolute`} />
                 <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-brand' : ''}`} />
              </div>
              
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ml-4 ${isCollapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100 text-left'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-brand hover:scale-110 z-50 hidden md:flex"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className={`flex items-center w-full p-3 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          title="Sign Out"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ml-4 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 font-medium'}`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;