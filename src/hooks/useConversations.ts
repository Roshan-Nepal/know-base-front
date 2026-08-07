import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../services/api';
import type { ApiResponse, PageResponse, ConversationResponse, MessageResponse } from '../types';

export const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  
  // Conversations pagination state
  const [conversationsPage, setConversationsPage] = useState<number>(0);
  const [hasMoreConversations, setHasMoreConversations] = useState<boolean>(false);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
  const [loadingMoreConversations, setLoadingMoreConversations] = useState<boolean>(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  // Messages pagination state
  const [messagesPage, setMessagesPage] = useState<number>(0);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Fetch paginated conversations
  const fetchConversations = useCallback(async (page: number = 0, size: number = 10, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMoreConversations(true);
    } else {
      setLoadingConversations(true);
    }
    setConversationsError(null);

    try {
      const res = await axiosInstance.get<ApiResponse<PageResponse<ConversationResponse>>>(
        `/api/v1/conversation?page=${page}&size=${size}`
      );
      if (res.data.success && res.data.data) {
        const pageData = res.data.data;
        const newItems = pageData.data;

        setConversations((prev) => {
          if (isLoadMore) {
            // Deduplicate items by ID
            const existingIds = new Set(prev.map((c) => c.id));
            const filteredNew = newItems.filter((c) => !existingIds.has(c.id));
            return [...prev, ...filteredNew];
          }
          return newItems;
        });

        setConversationsPage(page);
        const more = pageData.hasNext !== undefined ? pageData.hasNext : (page + 1 < pageData.totalPages);
        setHasMoreConversations(more);
        return newItems;
      } else {
        setConversationsError(res.data.message || 'Failed to fetch conversations.');
        return [];
      }
    } catch (err: any) {
      setConversationsError(err.message || 'An error occurred while fetching conversations.');
      return [];
    } finally {
      setLoadingConversations(false);
      setLoadingMoreConversations(false);
    }
  }, []);

  // Load next page of conversations
  const loadMoreConversations = useCallback(() => {
    if (loadingMoreConversations || !hasMoreConversations) return;
    fetchConversations(conversationsPage + 1, 10, true);
  }, [fetchConversations, conversationsPage, hasMoreConversations, loadingMoreConversations]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (
    conversationId: string,
    page: number = 0,
    size: number = 20,
    isLoadMore: boolean = false
  ) => {
    if (!conversationId) {
      setMessages([]);
      setHasMoreMessages(false);
      return [];
    }

    if (isLoadMore) {
      setLoadingMoreMessages(true);
    } else {
      setLoadingMessages(true);
    }
    setMessagesError(null);

    try {
      const res = await axiosInstance.get<ApiResponse<PageResponse<MessageResponse>>>(
        `/api/v1/conversation/${conversationId}/messages?page=${page}&size=${size}`
      );

      if (res.data.success && res.data.data) {
        const pageData = res.data.data;
        const fetchedMessages = pageData.data;

        // Sort fetched batch by createdAt ASC
        const sorted = [...fetchedMessages].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages((prev) => {
          if (isLoadMore) {
            // Deduplicate and prepend older messages at top
            const existingIds = new Set(prev.map((m) => m.id));
            const filteredOlder = sorted.filter((m) => !existingIds.has(m.id));
            return [...filteredOlder, ...prev];
          }
          return sorted;
        });

        setMessagesPage(page);
        const more = pageData.hasNext !== undefined ? pageData.hasNext : (page + 1 < pageData.totalPages);
        setHasMoreMessages(more);
        return sorted;
      } else {
        setMessagesError(res.data.message || 'Failed to fetch messages.');
        return [];
      }
    } catch (err: any) {
      setMessagesError(err.message || 'An error occurred while fetching messages.');
      return [];
    } finally {
      setLoadingMessages(false);
      setLoadingMoreMessages(false);
    }
  }, []);

  // Load next page of older messages (infinite scroll up)
  const loadOlderMessages = useCallback(async () => {
    if (!activeConversationId || loadingMoreMessages || !hasMoreMessages) return [];
    return await fetchMessages(activeConversationId, messagesPage + 1, 20, true);
  }, [fetchMessages, activeConversationId, messagesPage, hasMoreMessages, loadingMoreMessages]);

  // Select a conversation
  const selectConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
    setMessagesPage(0);
    setHasMoreMessages(false);
    if (id) {
      fetchMessages(id, 0, 25, false);
    } else {
      setMessages([]);
    }
  }, [fetchMessages]);

  // Start new conversation reset
  const startNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setMessagesPage(0);
    setHasMoreMessages(false);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchConversations(0, 10, false);
  }, [fetchConversations]);

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    setMessages,
    // Conversation pagination
    loadingConversations,
    loadingMoreConversations,
    hasMoreConversations,
    loadMoreConversations,
    fetchConversations,
    // Messages pagination
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    loadOlderMessages,
    fetchMessages,
    selectConversation,
    startNewChat,
    conversationsError,
    messagesError,
  };
};
