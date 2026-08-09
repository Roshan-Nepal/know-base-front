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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do NOT intercept if there is no error response or if originalRequest config is missing
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Do NOT intercept if the failed request is an authentication endpoint
    const requestUrl = originalRequest.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/api/v1/auth/refresh') ||
      requestUrl.includes('/api/v1/auth/login') ||
      requestUrl.includes('/api/v1/auth/register');

    // Check if error is 401 and request hasn't been retried yet and is not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use axios directly to avoid interceptor loop
        const response = await axios.post<ApiResponse<string>>(
          `${BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success && response.data.data) {
          const newToken = response.data.data;
          localStorage.setItem('accessToken', newToken);

          processQueue(null, newToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Failed to refresh access token.');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
