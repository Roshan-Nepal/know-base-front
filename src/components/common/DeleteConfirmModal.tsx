import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  isDeleting,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-6 sm:p-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-500/10 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-500" aria-hidden="true" />
            </div>
            <div className="ml-4 mt-0.5">
              <h3 className="text-lg leading-6 font-semibold text-slate-900 dark:text-white" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-[#222222] px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse gap-3 border-t border-slate-100 dark:border-[#333]">
          <button
            type="button"
            disabled={isDeleting}
            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-5 py-2.5 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
            onClick={onConfirm}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            className="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-300 dark:border-[#444] shadow-sm px-5 py-2.5 bg-white dark:bg-[#2a2a2a] text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#333] focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
        
        <button 
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#333] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
