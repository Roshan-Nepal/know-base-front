// API Client for the Know-Base App
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

// API Response Models matching Backend DTOs
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timeStamp: string;
}

export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface TokenResponse {
  accessToken: string;
}

export interface DashboardStatsResponse {
  totalDocuments: number;
  totalConversations: number;
}

export interface RoleResponse {
  id: string;
  role: string;
}

// Spring RFC 7807 Problem Detail format for backend errors
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errorCode?: string;
  timestamp?: string;
  [key: string]: any;
}

class ApiError extends Error {
  status: number;
  problemDetail?: ProblemDetail;

  constructor(message: string, status: number, problemDetail?: ProblemDetail) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.problemDetail = problemDetail;
  }
}

// Helper to get headers
const getHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const savedToken = token || localStorage.getItem('accessToken');
  if (savedToken) {
    headers['Authorization'] = `Bearer ${savedToken}`;
  }
  
  return headers;
};

// Generic Fetch Wrapper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  // Attach default headers
  const headers = getHeaders();
  options.headers = {
    ...headers,
    ...options.headers,
  };
  options.credentials = 'include';

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorMsg = `HTTP error! Status: ${response.status}`;
      let problemDetail: ProblemDetail | undefined;
      
      try {
        const body = await response.json();
        problemDetail = body as ProblemDetail;
        errorMsg = problemDetail.detail || problemDetail.title || errorMsg;
      } catch (e) {
        // Response is not JSON, fallback to status text
        errorMsg = response.statusText || errorMsg;
      }
      
      throw new ApiError(errorMsg, response.status, problemDetail);
    }

    // Handles void responses or 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : 'Network failure or server is unreachable');
  }
}

// Exported API Actions
export const api = {
  // Authentication APIs
  auth: {
    login: (body: any): Promise<ApiResponse<string>> => {
      return request<ApiResponse<string>>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    
    register: (body: any): Promise<ApiResponse<UserResponse>> => {
      return request<ApiResponse<UserResponse>>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },

    changePassword: (body: any): Promise<ApiResponse<void>> => {
      return request<ApiResponse<void>>('/api/v1/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },

    logout: (): Promise<ApiResponse<void>> => {
      return request<ApiResponse<void>>('/api/v1/auth/logout', {
        method: 'POST',
      });
    },

    refresh: (): Promise<ApiResponse<string>> => {
      return request<ApiResponse<string>>('/api/v1/auth/refresh', {
        method: 'POST',
      });
    },
  },

  // Dashboard APIs
  dashboard: {
    getStats: (): Promise<ApiResponse<DashboardStatsResponse>> => {
      return request<ApiResponse<DashboardStatsResponse>>('/api/v1/dashboard/stats', {
        method: 'GET',
      });
    },
  },

  // Role Management APIs
  roles: {
    getAll: (): Promise<ApiResponse<RoleResponse[]>> => {
      return request<ApiResponse<RoleResponse[]>>('/api/v1/roles', {
        method: 'GET',
      });
    },

    create: (body: any): Promise<ApiResponse<RoleResponse>> => {
      return request<ApiResponse<RoleResponse>>('/api/v1/roles', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
  },
};
