import { useState, useRef, useCallback } from 'react';
import { axiosInstance } from '../services/api';
import type { ApiResponse, DocumentResponse } from '../types';

export const useDocumentUpload = () => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [pastedText, setPastedText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setStatus('idle');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setSelectedTags([]);
    setStatus('idle');
    setErrorMessage('');
    setPastedText('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (selectedTags.length > 0) {
        selectedTags.forEach(tag => formData.append('tags', tag));
      }
      
      const res = await axiosInstance.post<ApiResponse<DocumentResponse>>('/api/v1/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const response = res.data;

      if (response.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(response.message || 'Upload failed');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred during upload.');
    }
  };

  const handleManualSubmit = () => {
    if (activeTab === 'text') {
      // TODO
      // Logic for text upload could be added here
      console.log("Submitting pasted text:", pastedText);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return {
    activeTab, setActiveTab,
    isDragging,
    selectedFile,
    selectedTags, toggleTag,
    status,
    errorMessage,
    pastedText, setPastedText,
    fileInputRef,
    handleDragOver, handleDragLeave, handleDrop, handleFileChange,
    handleUpload, handleManualSubmit, resetState
  };
};
