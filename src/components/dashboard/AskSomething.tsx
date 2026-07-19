import React from 'react';

export const AskSomething: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333] rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Ask something
      </h3>
      <p className="text-sm text-slate-500 dark:text-[#a1a1aa] mb-6 leading-relaxed">
        Jump into a new conversation with your knowledge base.
      </p>

      <div className="space-y-3 mb-6">
        <button className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-[#333] transition-colors group">
          <p className="text-sm text-slate-700 dark:text-[#e4e4e7] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            What changed in the auth module?
          </p>
        </button>
        <button className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-[#333] transition-colors group">
          <p className="text-sm text-slate-700 dark:text-[#e4e4e7] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Summarize the Q3 review
          </p>
        </button>
      </div>

      <button className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold shadow hover:bg-slate-800 dark:hover:bg-gray-100 transition-colors">
        New conversation
      </button>
    </div>
  );
};
