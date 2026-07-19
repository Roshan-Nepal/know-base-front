import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-6 text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-md text-center space-y-6">
        
        {/* Shield Icon indicator */}
        <div className="inline-flex h-20 w-20 rounded-full bg-rose-500/10 border border-rose-500/25 items-center justify-center text-rose-500 shadow-xl shadow-rose-500/5 animate-glow">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
            Access Denied
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            You do not have the required administrator privileges (`ROLE_ADMIN`) to view this resource. 
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};
