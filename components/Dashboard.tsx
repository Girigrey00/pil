import React from 'react';
import { HistoryItem } from '../types';
import { Download, CheckCircle, Clock, Search, FileBarChart } from 'lucide-react';

interface DashboardProps {
  history: HistoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your report generation history.</p>
        </div>
        
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full md:w-80 pl-11 pr-4 py-3 bg-white border-0 ring-1 ring-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-sm transition-shadow"
            placeholder="Search Reference ID..."
          />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Requests', value: history.length, icon: FileBarChart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: history.filter(h => h.status === 'success').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Processing', value: 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference (CAS ID)</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Output Report</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileBarChart className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-lg font-medium text-slate-900">No records found</p>
                      <p className="text-sm mt-1">Submit a new request to see it here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5 align-middle">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        SUCCESS
                      </span>
                    </td>
                    <td className="px-8 py-5 align-middle">
                      <span className="font-semibold text-slate-700">{item.cas_id}</span>
                    </td>
                    <td className="px-8 py-5 align-middle">
                      <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{item.report_path}</code>
                    </td>
                    <td className="px-8 py-5 align-middle">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 align-middle text-right">
                      <a 
                        href={item.download_url}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                        title="Download Report"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;