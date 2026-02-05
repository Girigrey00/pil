import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2, ArrowRight, Loader2, Plus, FileCheck, FolderOpen, Database, AlertCircle } from 'lucide-react';
import { UploadRequestPayload, UploadResponsePayload } from '../types';
import { uploadFileToAzure, processUpload } from '../services/api';

interface UploadPageProps {
  onUploadSuccess: (response: UploadResponsePayload) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const [casId, setCasId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [response, setResponse] = useState<UploadResponsePayload | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setResponse(null);
      setStatus('idle');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setResponse(null);
      setStatus('idle');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getAuthToken = async (): Promise<string> => {
    return "mock-token-for-admin";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!casId || selectedFiles.length === 0) return;

    setStatus('uploading');
    setResponse(null);

    try {
      const token = await getAuthToken();
      setStatusMessage('Initializing secure storage...');
      
      const documentPaths = await Promise.all(
        selectedFiles.map(async (file, index) => {
          setStatusMessage(`Uploading ${index + 1}/${selectedFiles.length}: ${file.name}...`);
          const storagePath = `${casId}/${file.name}`;
          await uploadFileToAzure(storagePath, file);
          return storagePath;
        })
      );

      setStatus('processing');
      setStatusMessage('Processing verified documents...');

      const payload: UploadRequestPayload = {
        cas_id: casId,
        document_path: documentPaths
      };

      const res = await processUpload(token, payload);
      setResponse(res);
      
      if (res.status === 'success') {
        onUploadSuccess(res);
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error("Upload process failed", error);
      setStatusMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setStatus('failed');
    }
  };

  const resetForm = () => {
    setCasId('');
    setSelectedFiles([]);
    setResponse(null);
    setStatus('idle');
  };

  const isWorking = status === 'uploading' || status === 'processing';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-[#003da5] tracking-tight">New Request</h1>
        <p className="text-slate-500 mt-2 text-lg">Secure upload to Azure Blob Storage.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
            {/* Input Group */}
            <div className="space-y-3">
              <label htmlFor="casId" className="block text-sm font-bold text-[#003da5] uppercase tracking-wider">
                Reference ID (CAS ID)
              </label>
              <div className="relative">
                <input
                  id="casId"
                  type="text"
                  value={casId}
                  onChange={(e) => setCasId(e.target.value)}
                  placeholder="e.g. CAS-2023-8849"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 text-[#003da5] placeholder-slate-400 focus:ring-2 focus:ring-[#003da5] focus:bg-white transition-all outline-none text-lg font-medium"
                  disabled={isWorking}
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#003da5] uppercase tracking-wider">
                Attachments
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isWorking && fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-[#003da5] bg-blue-50/50'
                    : isWorking 
                      ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                      : 'border-slate-300 hover:border-[#003da5] hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                  disabled={isWorking}
                />
                <div className="w-16 h-16 bg-slate-100 text-[#003da5] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-[#003da5]">Drop files here</h3>
                <p className="text-slate-500 mt-1">or click to browse from computer</p>
                <div className="mt-4 flex gap-2">
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium border border-slate-200">PDF</span>
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium border border-slate-200">DOCX</span>
                </div>
              </div>

              {/* File List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-500">{selectedFiles.length} files selected</span>
                     {!isWorking && (
                       <button onClick={() => setSelectedFiles([])} className="text-xs font-semibold text-red-600 hover:text-red-800">Clear All</button>
                     )}
                  </div>
                  <div className="grid gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 bg-[#003da5] text-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#003da5] truncate">{file.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        {!isWorking && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={!casId || selectedFiles.length === 0 || isWorking}
                className={`w-full py-4 px-6 rounded-lg flex items-center justify-center space-x-3 font-bold text-lg transition-all duration-300 transform active:scale-[0.98] ${
                  !casId || selectedFiles.length === 0 || isWorking
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#003da5] hover:bg-[#002a72] text-white shadow-lg shadow-[#003da5]/20'
                }`}
              >
                {isWorking ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Start Upload & Process</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status / Info */}
        <div className="lg:col-span-5 space-y-6">
          {isWorking ? (
             <div className="h-full min-h-[400px] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <div className="relative mb-8">
                   {/* Animated Upload Icon */}
                   {status === 'uploading' ? (
                      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-[#003da5] animate-spin"></div>
                        <UploadCloud className="w-10 h-10 text-[#003da5] animate-pulse" />
                      </div>
                   ) : (
                      <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center relative">
                         <div className="absolute inset-0 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin"></div>
                         <Database className="w-10 h-10 text-amber-500 animate-pulse" />
                      </div>
                   )}
                </div>
                
                <h3 className="text-xl font-bold text-[#003da5]">
                  {status === 'uploading' ? 'Uploading to Storage' : 'Analyzing Documents'}
                </h3>
                <p className="text-slate-500 text-center max-w-xs mt-3 font-medium">
                  {statusMessage}
                </p>

                {/* Simulated Progress Steps */}
                <div className="mt-8 w-full max-w-xs space-y-3">
                   <div className="flex items-center gap-3 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'uploading' ? 'bg-[#003da5] text-white' : 'bg-green-600 text-white'}`}>
                        {status === 'uploading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      </div>
                      <span className={status === 'uploading' ? 'text-[#003da5] font-medium' : 'text-slate-500'}>Secure Cloud Upload</span>
                   </div>
                   <div className="w-0.5 h-4 bg-slate-200 ml-3"></div>
                   <div className="flex items-center gap-3 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'processing' ? 'bg-amber-500 text-white' : status === 'uploading' ? 'bg-slate-200' : 'bg-slate-200'}`}>
                         {status === 'processing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <span className="text-[10px] text-slate-500">2</span>}
                      </div>
                      <span className={status === 'processing' ? 'text-amber-900 font-medium' : 'text-slate-400'}>Data Extraction</span>
                   </div>
                </div>
             </div>
          ) : status === 'failed' ? (
             <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="bg-red-50/50 p-8 flex flex-col items-center justify-center text-center border-b border-red-100">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-red-50">
                     <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#003da5]">Processing Failed</h2>
                  <p className="text-red-700 mt-2 font-medium bg-red-100 px-4 py-1 rounded-full text-sm">
                    {response?.error_message || statusMessage || "An unexpected error occurred"}
                  </p>
               </div>
               
               <div className="p-8">
                 <button
                   onClick={resetForm}
                   className="w-full py-4 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-[#003da5] transition-all flex items-center justify-center gap-2"
                 >
                   <Plus className="w-5 h-5" />
                   <span>Try Again</span>
                 </button>
               </div>
             </div>
          ) : response && response.status === 'success' ? (
            <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-green-50/50 p-8 flex flex-col items-center justify-center text-center border-b border-green-100">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-green-50">
                    <FileCheck className="w-10 h-10 text-green-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-[#003da5]">Success</h2>
                 <p className="text-green-700 mt-2 font-medium bg-green-100 px-4 py-1 rounded-full text-sm">Report Generated</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-5">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference ID</span>
                        <p className="text-xl font-bold text-[#003da5] font-mono mt-1 tracking-tight">{response.cas_id}</p>
                    </div>
                    <div className="h-px bg-slate-200 w-full"></div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Output</span>
                        <div className="flex items-center gap-3 mt-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                             <div className="w-10 h-10 bg-[#003da5] rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-white" />
                             </div>
                             <span className="text-sm font-semibold text-slate-700 truncate flex-1">{response.report_path || 'Report Available'}</span>
                        </div>
                    </div>
                </div>

                {response.download_url && (
                  <a
                    href={response.download_url}
                    className="w-full py-4 bg-[#003da5] hover:bg-[#002a72] text-white font-bold rounded-lg text-center shadow-lg shadow-[#003da5]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                      <FolderOpen className="w-5 h-5" />
                      <span>Download Report</span>
                  </a>
                )}

                <button
                  onClick={resetForm}
                  className="w-full py-4 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-[#003da5] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Process New Request</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-gradient-to-b from-white to-slate-50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center p-10 relative overflow-hidden group transition-all">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-20"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-200 rounded-full blur-3xl -ml-20 -mb-20 opacity-30"></div>

               <div className="relative z-10 space-y-8 max-w-sm">
                   <div className="relative mx-auto">
                       <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 mx-auto relative z-10 transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                         <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-[#003da5] transition-colors duration-500" />
                       </div>
                   </div>

                   <div className="space-y-3">
                       <h3 className="text-2xl font-bold text-[#003da5]">Ready to Process</h3>
                       <p className="text-slate-500 leading-relaxed text-base">
                         Files will be securely uploaded to Azure Storage before processing.
                       </p>
                   </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for check icon in step indicator
const Check = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default UploadPage;