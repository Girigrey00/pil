import React from 'react';
import { HistoryResponse } from '../types';
import { Download, CheckCircle2, AlertCircle, FileBarChart2, Clock, MoreHorizontal, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  data: HistoryResponse;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const history = data.data || [];
  const totalCount = data.Total_Count || 0;
  const rejectedCount = data.Rejected || 0;
  const successCount = totalCount - rejectedCount;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Total Requests', 
            value: totalCount, 
            icon: FileBarChart2, 
            color: 'text-brand', 
            bg: 'bg-brand-light',
            desc: 'All time processed'
          },
          { 
            label: 'Successful', 
            value: successCount, 
            icon: CheckCircle2, 
            color: 'text-green-600', 
            bg: 'bg-green-50',
            desc: 'Completed without errors'
          },
          { 
            label: 'Action Required', 
            value: rejectedCount, 
            icon: AlertCircle, 
            color: 'text-red-600', 
            bg: 'bg-red-50',
            desc: 'Failed or rejected items'
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group">
            <div className="flex items-start justify-between z-10">
              <div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <h3 className={`text-4xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="z-10 mt-auto">
               <p className="text-xs text-slate-400 font-medium">{stat.desc}</p>
            </div>
            {/* Decorative Background blob */}
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-10 ${stat.bg.replace('bg-', 'bg-current ')} ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden flex flex-col">
        <div className="px-8 py-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time status of your file uploads</p>
          </div>
          <button className="text-sm font-bold text-brand bg-brand-light px-5 py-2.5 rounded-full hover:bg-brand hover:text-white transition-colors flex items-center gap-2">
            View All Report
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference ID</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Latency</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                         <FileBarChart2 className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-lg font-semibold text-slate-600">No records found</p>
                      <p className="text-sm">Requests will appear here once processed.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6 align-middle">
                      {item.status === 'complete' ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                          <span>SUCCESS</span>
                        </div>
                      ) : (
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <AlertCircle className="w-3.5 h-3.5 fill-current" />
                          <span>FAILED</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-brand font-mono text-sm">{item.cas_id}</span>
                        <span className="text-xs text-slate-400">{item.user_id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 align-middle">
                      <div className="max-w-[250px]">
                        <p className="text-sm font-medium text-slate-700 truncate">{item.summary || 'Processed successfully'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.accepted_files} of {item.total_files} files accepted</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 align-middle">
                      <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.latency_ms}ms</span>
                    </td>
                    <td className="px-8 py-6 align-middle">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.download_url && item.download_url !== "N.A" ? (
                          <a 
                            href={item.download_url}
                            className="p-2 rounded-full bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors"
                            title="Download Report"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : null}
                        <button className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
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