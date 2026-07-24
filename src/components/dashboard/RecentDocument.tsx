import React from 'react';
import { FileText, Image as ImageIcon, FileCode2, FileDown } from 'lucide-react';

interface RecentDocumentProps {
  name: string;
  timeAgo: string;
  status: 'Ready' | 'Processing';
  type: 'pdf' | 'md' | 'image' | 'code' | 'other';
}

export const RecentDocument: React.FC<RecentDocumentProps> = ({ name, timeAgo, status, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'pdf': return <FileDown className="h-5 w-5 text-rose-500" />;
      case 'md': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'code': return <FileCode2 className="h-5 w-5 text-amber-500" />;
      case 'image': return <ImageIcon className="h-5 w-5 text-emerald-500" />;
      default: return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-[#333] last:border-0 group">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-50 dark:bg-[#2a2a2a] rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-[#333] transition-colors">
          {getIcon()}
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-900 dark:text-white leading-tight mb-1">
            {name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Uploaded {timeAgo}
          </p>
        </div>
      </div>
      <div>
        <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
          status === 'Ready' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};
