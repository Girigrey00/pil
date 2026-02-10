import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2, ArrowRight, Loader2, Plus, FileCheck, FolderOpen, Database, AlertCircle, RefreshCw } from 'lucide-react';
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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); 
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...droppedFiles]);
      setResponse(null); 
      setStatus('idle');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Create a copy of files to avoid synthetic event issues
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setResponse(null); 
      setStatus('idle');
    }
    // Always clear the input value to allow selecting the same file again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => setSelectedFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!casId || selectedFiles.length === 0) return;
    setStatus('uploading');
    setResponse(null);
    try {
      const token = "mock-token-for-admin";
      setStatusMessage('Initializing secure storage...');
      const documentPaths = await Promise.all(selectedFiles.map(async (file, index) => {
        setStatusMessage(`Uploading ${index + 1}/${selectedFiles.length}: ${file.name}...`);
        const storagePath = `${casId}/${file.name}`;
        await uploadFileToAzure(storagePath, file);
        return storagePath;
      }));
      setStatus('processing');
      setStatusMessage('Processing verified documents...');
      
      const payload: UploadRequestPayload = { 
          cas_id: casId, 
          document_path: documentPaths,
          username: "admin"
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
      setStatusMessage(error instanceof Error ? error.message : "Unknown error");
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Form Section */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100 h-full flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm">1</span>
            Request Details
          </h3>
          
          <div className="space-y-8 flex-1">
            {/* Input with Material 3 Style */}
            <div className="relative group">
               <input
                id="casId"
                type="text"
                value={casId}
                onChange={(e) => setCasId(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 px-4 pt-4 rounded-t-lg border-b-2 border-slate-300 bg-slate-50 text-slate-900 focus:border-brand focus:bg-brand-light/20 outline-none transition-all placeholder-transparent"
                disabled={isWorking}
              />
              <label 
                htmlFor="casId"
                className="absolute left-4 top-4 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-brand peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-500"
              >
                Reference ID (CAS ID)
              </label>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Upload Documents</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isWorking && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                  isDragging ? 'border-brand bg-brand-light/50' : 'border-slate-300 hover:border-brand hover:bg-slate-50'
                } ${isWorking ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple disabled={isWorking} />
                <div className="w-16 h-16 bg-blue-50 text-brand rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Choose file or drag & drop</h4>
                <p className="text-slate-500 text-sm mt-1">Supported formats: PDF, DOCX (Max 25MB)</p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 mt-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand text-white rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{file.name}</p>
                           <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      {!isWorking && (
                        <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={handleSubmit}
              disabled={!casId || selectedFiles.length === 0 || isWorking}
              className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] ${
                !casId || selectedFiles.length === 0 || isWorking
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-brand text-white hover:bg-brand-hover shadow-brand/30'
              }`}
            >
              {isWorking ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              <span>{isWorking ? 'Processing...' : 'Submit Request'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status / Output Section */}
      <div className="xl:col-span-5">
        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100 h-full flex flex-col justify-center min-h-[500px] relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
          
          <div className="relative z-10 w-full">
            {isWorking ? (
              <div className="text-center space-y-6">
                 <div className="relative mx-auto w-24 h-24">
                    <svg className="animate-spin w-full h-full text-slate-200" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                       {status === 'uploading' ? <UploadCloud className="w-8 h-8 text-brand" /> : <Database className="w-8 h-8 text-brand" />}
                    </div>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800">{status === 'uploading' ? 'Uploading Files' : 'Analyzing Data'}</h3>
                   <p className="text-slate-500 mt-2">{statusMessage}</p>
                 </div>
              </div>
            ) : status === 'success' && response ? (
              <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <FileCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Processing Complete</h2>
                <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">SUCCESS</span>
                  </div>
                  <div className="space-y-1 mb-4">
                     <p className="text-xs text-slate-500">Reference ID</p>
                     <p className="text-lg font-mono font-bold text-brand">{response.cas_id}</p>
                  </div>
                   {response.download_url && (
                    <a href={response.download_url} className="flex items-center justify-center gap-2 w-full py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand-hover transition-colors">
                      <FolderOpen className="w-4 h-4" /> Download Report
                    </a>
                  )}
                </div>
                <button onClick={resetForm} className="text-slate-500 font-semibold hover:text-brand flex items-center justify-center gap-2 w-full">
                  <RefreshCw className="w-4 h-4" /> Process Another
                </button>
              </div>
            ) : status === 'failed' ? (
              <div className="text-center">
                 <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertCircle className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">Something went wrong</h3>
                 <p className="text-red-500 mt-2 bg-red-50 px-4 py-2 rounded-lg inline-block">{statusMessage}</p>
                 <button onClick={resetForm} className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-900 transition-colors">
                   Try Again
                 </button>
              </div>
            ) : (
               <div className="text-center space-y-6 opacity-60">
                  <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
                     <UploadCloud className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-400">Waiting for input...</h3>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;