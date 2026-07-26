import React from 'react';
import { FileText, FileDown, FileCode2, Image as ImageIcon, Trash2, Eye, Tag } from 'lucide-react';
import type { DocumentResponse } from '../../types';
import { formatTimeAgo, getDocType } from '../../utils/formatters';

interface DocumentTableProps {
  documents: DocumentResponse[];
  loading: boolean;
  onDeleteClick: (doc: DocumentResponse) => void;
  onViewClick: (id: string) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ documents, loading, onDeleteClick, onViewClick }) => {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileDown className="h-5 w-5 text-rose-500" />;
      case 'md': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'code': return <FileCode2 className="h-5 w-5 text-amber-500" />;
      case 'image': return <ImageIcon className="h-5 w-5 text-emerald-500" />;
      default: return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 text-slate-500">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading documents...</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 dark:border-[#333] rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50">
        <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No documents found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          You haven't uploaded any documents yet. Get started by uploading your first file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#222222] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-[#333]">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">File Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Uploaded</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 dark:bg-[#333] rounded-lg">
                      {getIcon(getDocType(doc.type))}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-0.5">{doc.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'} • {doc.type || 'Unknown format'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'READY' || doc.status === 'INDEXED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}>
                    {doc.status === 'READY' || doc.status === 'INDEXED' ? 'Ready' : 'Processing'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {doc.createdAt ? formatTimeAgo(doc.createdAt) : 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    {doc.tags && doc.tags.length > 0 ? (
                      <>
                        <Tag className="h-4 w-4 text-slate-400" />
                        {doc.tags.map(tag => (
                          <span key={tag.id || tag.name} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-100 dark:border-brand-500/20">
                            {tag.name}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No tags</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onViewClick(doc.id)}
                      className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteClick(doc)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
