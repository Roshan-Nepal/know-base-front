import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentDocument } from '../components/dashboard/RecentDocument';
import { AskSomething } from '../components/dashboard/AskSomething';
import { Link } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatTimeAgo, getDocType } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, recentDocs } = useDashboardData();

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          Hello, Welcome back {user?.username || 'User'}
        </h1>
        <p className="text-slate-600 dark:text-[#a1a1aa]">
          Here's what's happening in your knowledge base.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard title="Documents" value={stats ? stats.totalDocuments : '0'} />
        <StatCard title="Conversations" value={stats ? stats.totalConversations : '0'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent documents</h3>
            <Link to={"/documents"}>
              <button className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                View all
              </button>
            </Link>
          </div>
          
          <div className="flex flex-col">
            {recentDocs.length > 0 ? (
              recentDocs.map((doc) => (
                <RecentDocument
                  key={doc.id}
                  name={doc.name || 'Untitled'}
                  type={getDocType(doc.type)}
                  timeAgo={doc.createdAt ? formatTimeAgo(doc.createdAt) : 'unknown time'}
                  status={doc.status === 'READY' || doc.status === 'INDEXED' ? 'Ready' : 'Processing'}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No recent documents</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AskSomething />
        </div>
      </div>
    </div>
  );
};
