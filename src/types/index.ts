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
  hasNext?: boolean;
  hasPrevious?: boolean;
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

export interface DocumentResponse {
  id: string;
  name: string;
  type: string;
  fileSize: number;
  createdAt: string;
  status: string;
  tags: { id: string; name: string; }[];
}

export interface DocumentDetailResponse extends DocumentResponse {
  content: string;
}

export type MessageRole = 'USER' | 'ASSISTANT';

export interface ChatRequest {
  conversationId?: string | null;
  message: string;
}

export interface ConversationResponse {
  id: string;
  title: string;
  createdAt: string;
}

export interface MessageResponse {
  id: string;
  role: MessageRole;
  content: string;
  sourceChunks?: string[] | null;
  createdAt: string;
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
