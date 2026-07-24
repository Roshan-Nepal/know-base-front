import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../services/api';
import type { ApiResponse, DocumentResponse, PageResponse, DocumentDetailResponse } from '../types';

export const useDocumentsList = (initialPageSize: number = 10) => {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [size, setSize] = useState<number>(initialPageSize);

  const fetchDocuments = useCallback(async (pageNumber: number, pageSize: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<ApiResponse<PageResponse<DocumentResponse>>>(`/api/v1/documents?pageNumber=${pageNumber}&size=${pageSize}`);
      const response = res.data;
      if (response.success && response.data) {
        setDocuments(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        setError(response.message || 'Failed to fetch documents.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = async (id: string) => {
    try {
      const res = await axiosInstance.delete<ApiResponse<void>>(`/api/v1/documents/${id}`);
      if (res.data.success) {
        // Refresh the list after successful deletion
        fetchDocuments(page, size);
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message || 'Failed to delete document.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'An error occurred while deleting.' };
    }
  };

  const fetchDocumentDetails = async (id: string) => {
    try {
      const res = await axiosInstance.get<ApiResponse<DocumentDetailResponse>>(`/api/v1/documents/${id}`);
      if (res.data.success && res.data.data) {
        return { success: true, data: res.data.data };
      } else {
        return { success: false, message: res.data.message || 'Failed to fetch document details.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'An error occurred while fetching details.' };
    }
  };

  useEffect(() => {
    fetchDocuments(page, size);
  }, [fetchDocuments, page, size]);

  return {
    documents,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalElements,
    size,
    setSize,
    deleteDocument,
    fetchDocumentDetails,
    refreshDocuments: () => fetchDocuments(page, size)
  };
};
