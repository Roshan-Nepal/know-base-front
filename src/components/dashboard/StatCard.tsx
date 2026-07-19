import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333] rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
        {title}
      </h3>
      <p className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
        {value}
      </p>
    </div>
  );
};
