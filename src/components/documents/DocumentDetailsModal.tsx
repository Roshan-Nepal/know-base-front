import React from 'react';
import { X, FileText, Tag } from 'lucide-react';
import type { DocumentDetailResponse } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';

interface DocumentDetailsModalProps {
  isOpen: boolean;
  document: DocumentDetailResponse | null;
  onClose: () => void;
}

export const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  isOpen,
  document,
  onClose
}) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#333] flex items-center justify-between bg-slate-50 dark:bg-[#222222]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] rounded-lg shadow-sm">
              <FileText className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                {document.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uploaded {formatTimeAgo(document.createdAt)} • {(document.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-[#333] dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#1a1a1a]">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                document.status === 'READY' || document.status === 'INDEXED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
              }`}>
                {document.status === 'READY' || document.status === 'INDEXED' ? 'Indexed and Ready' : 'Processing'}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-[#333] dark:text-slate-300">
                {document.type}
              </span>
            </div>
            
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-slate-400" />
                {document.tags.map(tag => (
                  <span key={tag.id || tag.name} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-100 dark:border-brand-500/20">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#222222] overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-200 dark:border-[#333] bg-slate-100/50 dark:bg-[#2a2a2a]/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Extracted Text Content
            </div>
            <div className="p-4 overflow-x-auto">
              {document.content ? (
                <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {document.content}
                </pre>
              ) : (
                <div className="text-center py-8 text-slate-400 italic text-sm">
                  No text content could be extracted from this document.
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
