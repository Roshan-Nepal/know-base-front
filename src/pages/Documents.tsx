import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentsList } from '../hooks/useDocumentsList';
import { DocumentTable } from '../components/documents/DocumentTable';
import { Pagination } from '../components/common/Pagination';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';
import { DocumentDetailsModal } from '../components/documents/DocumentDetailsModal';
import type { DocumentResponse, DocumentDetailResponse } from '../types';

export const Documents: React.FC = () => {
  const { documents, loading, error, page, setPage, totalPages, deleteDocument, fetchDocumentDetails } = useDocumentsList();
  
  const [docToDelete, setDocToDelete] = useState<DocumentResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedDocumentDetail, setSelectedDocumentDetail] = useState<DocumentDetailResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const handleViewClick = async (id: string) => {
    setIsDetailLoading(true);
    const res = await fetchDocumentDetails(id);
    if (res.success && res.data) {
      setSelectedDocumentDetail(res.data);
      setIsDetailModalOpen(true);
    } else {
      // Error handling could be implemented here
      console.error(res.message);
    }
    setIsDetailLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    await deleteDocument(docToDelete.id);
    setIsDeleting(false);
    setDocToDelete(null);
  };
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
            Documents
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Manage and view your uploaded documents here.
          </p>
        </div>
        <Link 
          to="/documents/upload"
          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
        >
          Upload Document
        </Link>
      </div>

      <div className="bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333] rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-rose-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <DocumentTable 
              documents={documents} 
              loading={loading || isDetailLoading} 
              onDeleteClick={setDocToDelete}
              onViewClick={handleViewClick}
            />
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!docToDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${docToDelete?.name}"? This action cannot be undone and will remove the document from your knowledge base.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDocToDelete(null)}
      />

      <DocumentDetailsModal 
        isOpen={isDetailModalOpen}
        document={selectedDocumentDetail}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};
