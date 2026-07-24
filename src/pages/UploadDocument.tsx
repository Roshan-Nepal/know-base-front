import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CloudUpload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useDocumentUpload } from '../hooks/useDocumentUpload';

const PREDEFINED_TAGS = [
  'Finance',
  'Development',
  'SQL',
  'HR',
  'Marketing',
  'Operations',
  'Legal',
  'Sales',
  'IT'
];

export const UploadDocument: React.FC = () => {
  const {
    activeTab, setActiveTab,
    isDragging,
    selectedFile,
    selectedTags, toggleTag,
    status,
    errorMessage,
    pastedText, setPastedText,
    fileInputRef,
    handleDragOver, handleDragLeave, handleDrop, handleFileChange,
    handleUpload, handleManualSubmit, resetState
  } = useDocumentUpload();

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#a1a1aa] mb-4">
        <Link to="/documents" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Documents
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 dark:text-white">Upload</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2 tracking-tight">
          Upload a document
        </h1>
        <p className="text-slate-600 dark:text-[#a1a1aa] text-base">
          Add a file. We'll extract the text, chunk it, and index it for search automatically.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 border
            ${activeTab === 'file' 
              ? 'bg-brand-50 text-brand-700 border-brand-500 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-500 shadow-sm' 
              : 'bg-transparent text-slate-700 dark:text-[#e4e4e7] border-slate-300 dark:border-[#333] hover:bg-slate-50 dark:hover:bg-[#2a2a2a]'
            }
          `}
        >
          File upload
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 border
            ${activeTab === 'text' 
              ? 'bg-brand-50 text-brand-700 border-brand-500 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-500 shadow-sm' 
              : 'bg-transparent text-slate-700 dark:text-[#e4e4e7] border-slate-300 dark:border-[#333] hover:bg-slate-50 dark:hover:bg-[#2a2a2a]'
            }
          `}
        >
          Paste text
        </button>
      </div>

      {/* Tab Content Box */}
      <div 
        className={`rounded-2xl border-2 border-dashed p-12 transition-colors flex flex-col items-center justify-center mb-8
          ${activeTab === 'file' && isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-slate-300 dark:border-[#333] bg-white dark:bg-[#222222]'}
        `}
        style={{ minHeight: status === 'idle' || status === 'uploading' ? '300px' : '400px' }}
        onDragOver={activeTab === 'file' ? handleDragOver : undefined}
        onDragLeave={activeTab === 'file' ? handleDragLeave : undefined}
        onDrop={activeTab === 'file' ? handleDrop : undefined}
      >
        {activeTab === 'file' && (
          <div className="flex flex-col items-center text-center w-full max-w-lg mx-auto">
            {status === 'idle' || status === 'uploading' ? (
              <div className="w-full flex flex-col">
                {!selectedFile ? (
                  <div className="flex flex-col items-center text-center">
                    <CloudUpload className="h-12 w-12 text-slate-400 dark:text-[#71717a] mb-6" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Drag and drop files here
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-[#a1a1aa] mb-8">
                      PDF, Markdown, plain text, or code files up to 25 MB
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-[#444] bg-white dark:bg-transparent text-slate-900 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-colors"
                    >
                      Browse files
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-brand-200 dark:border-brand-900/30 bg-brand-50/50 dark:bg-brand-900/10 text-left">
                    <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                      <CloudUpload className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      onClick={resetState}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : status === 'success' ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Document Uploaded!
                </h3>
                <p className="text-slate-500 dark:text-[#a1a1aa] mb-8">
                  {selectedFile?.name} has been successfully indexed.
                </p>
                <button 
                  onClick={resetState}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-[#444] bg-white dark:bg-transparent text-slate-900 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  Upload another file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Upload Failed
                </h3>
                <p className="text-rose-600 dark:text-rose-400 mb-8 max-w-sm">
                  {errorMessage}
                </p>
                <button 
                  onClick={resetState}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-[#444] bg-white dark:bg-transparent text-slate-900 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div className="w-full flex flex-col items-start text-left h-full flex-1">
            <label className="text-sm font-medium text-slate-700 dark:text-[#e4e4e7] mb-2">
              Paste your content below
            </label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste plain text, markdown, or code here..."
              className="w-full flex-1 min-h-[200px] p-4 rounded-xl border border-slate-300 dark:border-[#333] bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Global Actions Area (Outside the Box) */}
      {(status === 'idle' || status === 'uploading') && (
        <div className="w-full">
          {activeTab === 'file' && (
            <div className="mb-8 text-left">
              <label className="block text-sm font-medium text-slate-700 dark:text-[#e4e4e7] mb-3">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_TAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                        ${isSelected 
                          ? 'bg-brand-50 text-brand-700 border-brand-500 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-500' 
                          : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#333] hover:bg-slate-50 dark:hover:bg-[#2a2a2a]'
                        }
                      `}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center w-full">
            {activeTab === 'file' ? (
              <button
                onClick={handleUpload}
                disabled={!selectedFile || status === 'uploading'}
                className="w-full px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'uploading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Document'
                )}
              </button>
            ) : (
              <button 
                onClick={handleManualSubmit}
                disabled={!pastedText.trim()}
                className="w-full px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-50"
              >
                Upload text
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
