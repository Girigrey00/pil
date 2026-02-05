import React from 'react';
import { HistoryResponse } from '../types';
import { Download, CheckCircle, Search, FileBarChart, XCircle, Clock } from 'lucide-react';

interface DashboardProps {
  data: HistoryResponse;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const history = data.data || [];
  const totalCount = data.Total_Count || 0;
  const rejectedCount = data.Rejected || 0;
  const successCount = totalCount - rejectedCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-2 text-lg">Overview of file processing performance.</p>
        </div>
        
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-brand placeholder-slate-400 focus:ring-2 focus:ring-brand focus:border-transparent focus:outline-none shadow-sm transition-shadow"
            placeholder="Search Reference ID..."
          />
        </div>
      </header>

      {/* Stats Cards - Simplified Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Requests', value: totalCount, icon: FileBarChart },
          { label: 'Successful', value: successCount, icon: CheckCircle },
          { label: 'Rejected', value: rejectedCount, icon: XCircle },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-4xl font-bold text-brand mt-2">{stat.value}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-brand" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-brand">Recent Transactions</h2>
          <button className="text-sm font-semibold text-brand hover:underline">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">User ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">CAS ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Summary</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Files</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Latency</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileBarChart className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-lg font-medium text-brand">No records found</p>
                      <p className="text-sm mt-1">Submit a new request to see it here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 align-middle">
                      {item.status === 'complete' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle className="w-3.5 h-3.5" />
                          SUCCESS
                        </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                          <XCircle className="w-3.5 h-3.5" />
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span className="text-sm text-slate-600 font-medium">{item.user_id}</span>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <span className="font-bold text-brand">{item.cas_id}</span>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <div className="max-w-[200px]" title={item.summary}>
                        <p className="text-xs text-slate-600 truncate">{item.summary || 'No summary available'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-slate-700">{item.accepted_files}</span>
                        <span className="text-xs text-slate-400">/ {item.total_files}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-sm font-mono">{item.latency_ms}ms</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-brand">
                          {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(item.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-middle text-right">
                      {item.download_url && item.download_url !== "N.A" ? (
                        <a 
                          href={item.download_url}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-brand hover:bg-brand hover:text-white transition-all shadow-sm"
                          title="Download Report"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-300 cursor-not-allowed">
                          <Download className="w-4 h-4" />
                        </span>
                      )}
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