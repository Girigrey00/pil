import React from 'react';
import { HistoryResponse } from '../types';
import { Download, CheckCircle, FileBarChart, XCircle, Clock, BarChart3 } from 'lucide-react';

interface DashboardProps {
  data: HistoryResponse;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const history = data.data || [];
  const totalCount = data.Total_Count || 0;
  const rejectedCount = data.Rejected || 0;
  const successCount = totalCount - rejectedCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Requests', value: totalCount, icon: FileBarChart, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Successful', value: successCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Rejected/Failed', value: rejectedCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-xl shadow-sm border ${stat.border} flex items-center justify-between hover:shadow-md transition-all duration-300`}>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#0B1E48]">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
             <BarChart3 className="w-5 h-5 text-[#0B1E48]" />
             <h2 className="text-lg font-bold text-[#0B1E48]">Recent Transactions</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CAS ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Summary</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Files</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Latency</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileBarChart className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium text-slate-900">No records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      {item.status === 'complete' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle className="w-3 h-3" />
                          SUCCESS
                        </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                          <XCircle className="w-3 h-3" />
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-xs text-slate-600 font-semibold">{item.user_id}</span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-xs font-bold text-[#0B1E48] font-mono">{item.cas_id}</span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="max-w-[180px]" title={item.summary}>
                        <p className="text-xs text-slate-600 truncate">{item.summary || '-'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-700">{item.accepted_files}</span>
                        <span className="text-[10px] text-slate-400">/ {item.total_files}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-mono">{item.latency_ms}ms</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">
                          {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      {item.download_url && item.download_url !== "N.A" ? (
                        <a 
                          href={item.download_url}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                          title="Download Report"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed">
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