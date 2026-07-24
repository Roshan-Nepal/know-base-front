import { useState, useEffect } from 'react';
import { axiosInstance } from '../services/api';
import type { DashboardStatsResponse, ApiResponse, DocumentResponse, PageResponse } from '../types';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [recentDocs, setRecentDocs] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const statsRes = await axiosInstance.get<ApiResponse<DashboardStatsResponse>>('/api/v1/dashboard/stats');
        if (isMounted && statsRes.data.success && statsRes.data.data) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }

      try {
        const docsRes = await axiosInstance.get<ApiResponse<PageResponse<DocumentResponse>>>('/api/v1/documents?pageNumber=0&size=3');
        if (isMounted && docsRes.data.success && docsRes.data.data) {
          setRecentDocs(docsRes.data.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch recent docs', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, recentDocs, loading };
};
