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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Top Action Bar */}
      <div className="flex justify-end">
         <button 
           onClick={() => fileInputRef.current?.click()}
           className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-900/10 flex items-center gap-2 transition-all"
         >
            <Plus className="w-4 h-4" />
            New Product
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
            <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-[#0B1E48]">Request Details</h3>
                <p className="text-sm text-slate-500">Enter the reference ID and attach documents.</p>
            </div>

            {/* Input Group */}
            <div className="space-y-3">
              <label htmlFor="casId" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Reference ID (CAS ID)
              </label>
              <div className="relative">
                <input
                  id="casId"
                  type="text"
                  value={casId}
                  onChange={(e) => setCasId(e.target.value)}
                  placeholder="e.g. CAS-2023-8849"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-base font-medium"
                  disabled={isWorking}
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Attachments
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isWorking && fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : isWorking 
                      ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                      : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
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
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Click to upload or drag and drop</h3>
                <p className="text-xs text-slate-500 mt-1">PDF, DOCX, XLSX (Max 10MB)</p>
              </div>

              {/* File List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-400 uppercase">{selectedFiles.length} files selected</span>
                     {!isWorking && (
                       <button onClick={() => setSelectedFiles([])} className="text-xs font-semibold text-red-500 hover:text-red-700">Clear All</button>
                     )}
                  </div>
                  <div className="grid gap-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 bg-white border border-slate-200 text-blue-600 rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        {!isWorking && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
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

            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={!casId || selectedFiles.length === 0 || isWorking}
                className={`w-full py-3.5 px-6 rounded-lg flex items-center justify-center space-x-2 font-bold text-sm transition-all duration-300 transform active:scale-[0.98] ${
                  !casId || selectedFiles.length === 0 || isWorking
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0B1E48] hover:bg-[#162e66] text-white shadow-lg shadow-blue-900/20'
                }`}
              >
                {isWorking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Start Processing</span>
                    <ArrowRight className="w-4 h-4" />
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
                <div className="relative mb-6">
                   {/* Animated Upload Icon */}
                   {status === 'uploading' ? (
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                        <UploadCloud className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                   ) : (
                      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center relative">
                         <div className="absolute inset-0 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin"></div>
                         <Database className="w-8 h-8 text-amber-500 animate-pulse" />
                      </div>
                   )}
                </div>
                
                <h3 className="text-lg font-bold text-[#0B1E48]">
                  {status === 'uploading' ? 'Uploading...' : 'Analyzing...'}
                </h3>
                <p className="text-slate-500 text-center text-sm mt-2 font-medium">
                  {statusMessage}
                </p>
             </div>
          ) : status === 'failed' ? (
             <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="bg-red-50/50 p-6 flex flex-col items-center justify-center text-center border-b border-red-100">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                     <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Failed</h2>
                  <p className="text-red-600 mt-2 text-sm font-medium">
                    {response?.error_message || statusMessage || "Error occurred"}
                  </p>
               </div>
               
               <div className="p-6">
                 <button
                   onClick={resetForm}
                   className="w-full py-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm transition-all"
                 >
                   Try Again
                 </button>
               </div>
             </div>
          ) : response && response.status === 'success' ? (
            <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-emerald-50/50 p-6 flex flex-col items-center justify-center text-center border-b border-emerald-100">
                 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <FileCheck className="w-8 h-8 text-emerald-600" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900">Success</h2>
                 <p className="text-emerald-700 mt-1 text-sm font-medium">Report Generated</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reference ID</span>
                        <p className="text-lg font-bold text-[#0B1E48] font-mono mt-0.5">{response.cas_id}</p>
                    </div>
                </div>

                {response.download_url && (
                  <a
                    href={response.download_url}
                    className="w-full py-3 bg-[#0B1E48] hover:bg-[#162e66] text-white font-bold rounded-lg text-center shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                      <FolderOpen className="w-4 h-4" />
                      <span>Download Report</span>
                  </a>
                )}

                <button
                  onClick={resetForm}
                  className="w-full py-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm transition-all"
                >
                  Process New Request
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-[#F8FAFC] rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                 <UploadCloud className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Ready to Process</h3>
               <p className="text-slate-500 text-sm mt-2 max-w-xs">
                 Select your files and reference ID to start the automated analysis.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;