import axios from 'axios';

import type { ApiResponse, ProblemDetail } from '../types';

// API Client for the Know-Base App
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use axios instead of axiosInstance to avoid interceptor loop
        const response = await axios.post<ApiResponse<string>>(
          `${BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          const newToken = response.data.data;
          localStorage.setItem('accessToken', newToken);
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear token and reject
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Extract and format the error message from the ProblemDetail if available
    if (error.response?.data) {
      const problemDetail = error.response.data as ProblemDetail;
      error.message = problemDetail.detail || problemDetail.title || error.message;
    }

    return Promise.reject(error);
  }
);
