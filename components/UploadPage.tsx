import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Check, ArrowRight, Loader2, Plus, Trash2, FolderOpen, FileCheck } from 'lucide-react';
import { UploadRequestPayload, UploadResponsePayload } from '../types';
import { processUpload } from '../services/mockApi';

interface UploadPageProps {
  onUploadSuccess: (response: UploadResponsePayload) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const [casId, setCasId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setResponse(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!casId || selectedFiles.length === 0) return;

    setIsLoading(true);
    setResponse(null);

    const payload: UploadRequestPayload = {
      cas_id: casId,
      files: selectedFiles.map(file => ({
        file_name: file.name,
        content_type: file.type || 'application/octet-stream',
        source: 'binary_upload'
      }))
    };

    try {
      const res = await processUpload(payload);
      setResponse(res);
      onUploadSuccess(res);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCasId('');
    setSelectedFiles([]);
    setResponse(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Request</h1>
        <p className="text-slate-500 mt-2 text-lg">Upload documents for bulk processing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">
            {/* Input Group */}
            <div className="space-y-3">
              <label htmlFor="casId" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Reference ID (CAS ID)
              </label>
              <div className="relative">
                <input
                  id="casId"
                  type="text"
                  value={casId}
                  onChange={(e) => setCasId(e.target.value)}
                  placeholder="e.g. CAS-2023-8849"
                  className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-lg font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Attachments
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                />
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Drop files here</h3>
                <p className="text-slate-500 mt-1">or click to browse from computer</p>
                <div className="mt-4 flex gap-2">
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">PDF</span>
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">DOCX</span>
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">Images</span>
                </div>
              </div>

              {/* File List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-500">{selectedFiles.length} files selected</span>
                     <button onClick={() => setSelectedFiles([])} className="text-xs font-semibold text-red-500 hover:text-red-700">Clear All</button>
                  </div>
                  <div className="grid gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={!casId || selectedFiles.length === 0 || isLoading}
                className={`w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-3 font-bold text-lg transition-all duration-300 transform active:scale-[0.98] ${
                  !casId || selectedFiles.length === 0 || isLoading
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status / Info */}
        <div className="lg:col-span-5 space-y-6">
          {isLoading ? (
             <div className="h-full min-h-[400px] bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                  <Loader2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Processing Documents</h3>
                <p className="text-slate-500 text-center max-w-xs mt-2">
                  Verifying CAS ID and generating reports. This may take a few moments.
                </p>
             </div>
          ) : response ? (
            <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-emerald-50/50 p-8 flex flex-col items-center justify-center text-center border-b border-emerald-100">
                 <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-emerald-50">
                    <FileCheck className="w-10 h-10 text-emerald-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900">Success</h2>
                 <p className="text-emerald-700 mt-2 font-medium bg-emerald-100 px-4 py-1 rounded-full text-sm">Verification Complete</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference ID</span>
                        <p className="text-xl font-bold text-slate-900 font-mono mt-1 tracking-tight">{response.cas_id}</p>
                    </div>
                    <div className="h-px bg-slate-200 w-full"></div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Output</span>
                        <div className="flex items-center gap-3 mt-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                             <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-blue-600" />
                             </div>
                             <span className="text-sm font-semibold text-slate-700 truncate flex-1">{response.report_path}</span>
                        </div>
                    </div>
                </div>

                <a
                  href={response.download_url}
                  onClick={e => e.preventDefault()}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    <FolderOpen className="w-5 h-5" />
                    <span>Download Report</span>
                </a>

                <button
                  onClick={resetForm}
                  className="w-full py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Process New Request</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center p-10 relative overflow-hidden group transition-all">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-40"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100 rounded-full blur-3xl -ml-20 -mb-20 opacity-40"></div>

               <div className="relative z-10 space-y-8 max-w-sm">
                   <div className="relative mx-auto">
                       <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-slate-200/50 mx-auto relative z-10 transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                         <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-blue-600 transition-colors duration-500" />
                       </div>
                       {/* Pulsing ring */}
                       <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-400 rounded-3xl animate-ping opacity-10 duration-1000"></div>
                   </div>

                   <div className="space-y-3">
                       <h3 className="text-2xl font-bold text-slate-900">Ready to Process</h3>
                       <p className="text-slate-500 leading-relaxed text-base">
                         Fill out the form and upload your documents to begin the secure verification process.
                       </p>
                   </div>
                   
                   <div className="pt-4 flex justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;