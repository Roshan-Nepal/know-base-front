import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentDocument } from '../components/dashboard/RecentDocument';
import { AskSomething } from '../components/dashboard/AskSomething';
import { api, type DashboardStatsResponse } from '../services/api';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.dashboard.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  // Mock data to match the screenshot
  const recentDocs = [
    { id: 1, name: 'Q3 architecture review.pdf', type: 'pdf' as const, timeAgo: '2 hours ago', status: 'Ready' as const },
    { id: 2, name: 'onboarding-notes.md', type: 'md' as const, timeAgo: 'yesterday', status: 'Ready' as const },
    { id: 3, name: 'RagService.java', type: 'code' as const, timeAgo: 'Uploading', status: 'Processing' as const },
  ];

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
            <button className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
              View all
            </button>
          </div>
          
          <div className="flex flex-col">
            {recentDocs.map((doc) => (
              <RecentDocument
                key={doc.id}
                name={doc.name}
                type={doc.type}
                timeAgo={doc.timeAgo}
                status={doc.status}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AskSomething />
        </div>
      </div>
    </div>
  );
};
