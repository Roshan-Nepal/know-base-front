import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useConversations } from '../hooks/useConversations';
import { useChatStream } from '../hooks/useChatStream';
import { ConversationSidebar } from '../components/chat/ConversationSidebar';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { Database, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import type { MessageResponse } from '../types';

export const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPromptHandled = useRef(false);

  const {
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
    // Message pagination
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    loadOlderMessages,
    selectConversation,
    startNewChat,
  } = useConversations();

  const { isStreaming, sendMessageStream } = useChatStream();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isLoadingOlderRef = useRef<boolean>(false);

  // Auto-scroll to bottom of message thread on new message
  const scrollToBottom = () => {
    if (messages.length > 0 && prevScrollHeightRef.current === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle auto-load older messages on scroll near top
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || loadingMoreMessages || !hasMoreMessages || isLoadingOlderRef.current) return;

    if (container.scrollTop < 120) {
      isLoadingOlderRef.current = true;
      prevScrollHeightRef.current = container.scrollHeight;

      loadOlderMessages().finally(() => {
        isLoadingOlderRef.current = false;
      });
    }
  };

  // Adjust scroll position after older messages are prepended to top
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (container && prevScrollHeightRef.current > 0) {
      const heightDifference = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop += heightDifference;
      prevScrollHeightRef.current = 0;
    }
  }, [messages]);

  // Sync route param with active conversation as single source of truth
  useEffect(() => {
    const routeId = conversationId || null;
    if (routeId !== activeConversationId) {
      if (routeId) {
        selectConversation(routeId);
      } else {
        startNewChat();
      }
    }
  }, [conversationId, activeConversationId, selectConversation, startNewChat]);

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleNewChat = () => {
    navigate('/chat');
  };

  const handleSendMessage = async (prompt: string) => {
    const userMsgId = `temp-user-${Date.now()}`;
    const assistantMsgId = `temp-assistant-${Date.now()}`;

    // 1. Instantly append User Message to UI
    const userMessage: MessageResponse = {
      id: userMsgId,
      role: 'USER',
      content: prompt,
      createdAt: new Date().toISOString(),
    };

    // 2. Instantly append empty Assistant Message to UI for streaming
    const assistantMessage: MessageResponse = {
      id: assistantMsgId,
      role: 'ASSISTANT',
      content: '',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    // 3. Initiate Streaming
    let currentAssistantText = '';

    await sendMessageStream(prompt, activeConversationId, {
      onStreamChunk: (chunk) => {
        currentAssistantText += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: currentAssistantText }
              : msg
          )
        );
      },
      onStreamComplete: async () => {
        // Only refresh conversation list if this was a new conversation (to populate the sidebar title)
        if (!activeConversationId) {
          const updatedList = await fetchConversations();
          if (updatedList && updatedList.length > 0) {
            const newestConvo = updatedList[0];
            setActiveConversationId(newestConvo.id);
            navigate(`/chat/${newestConvo.id}`, { replace: true });
          }
        }
      },
      onStreamError: (errorMsg) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content:
                    currentAssistantText ||
                    `⚠️ Error: Unable to complete response (${errorMsg})`,
                }
              : msg
          )
        );
      },
    });
  };

  // Trigger initial prompt from navigation state if present
  useEffect(() => {
    const prompt = (location.state as { initialPrompt?: string })?.initialPrompt;
    if (prompt && !initialPromptHandled.current) {
      initialPromptHandled.current = true;
      navigate(location.pathname, { replace: true, state: {} });
      handleSendMessage(prompt);
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-[#171717] -m-8 overflow-hidden">
      {/* Sidebar - Conversation History */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        loading={loadingConversations}
        hasMore={hasMoreConversations}
        loadingMore={loadingMoreConversations}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onLoadMore={loadMoreConversations}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#171717] min-w-0">
        {/* Chat Thread Messages Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-sm font-medium">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            /* Welcome / Empty State */
            <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-xl mx-auto space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-[#003d82]/10 dark:bg-[#003d82]/20 flex items-center justify-center text-[#003d82] dark:text-[#3b82f6]">
                <Database className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Know-Base Assistant
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Ask questions in natural language. Answers are generated using RAG semantic retrieval over your uploaded notes, code, and PDFs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-4">
                <button
                  onClick={() => handleSendMessage('What are the main documents uploaded in my knowledge base?')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:border-[#003d82] dark:hover:border-[#003d82] transition-colors text-xs text-slate-700 dark:text-slate-300"
                >
                  <Sparkles className="h-4 w-4 text-[#003d82] mb-1.5" />
                  <span>Summarize my uploaded documents</span>
                </button>

                <button
                  onClick={() => handleSendMessage('Can you explain the key concepts in my latest notes?')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:border-[#003d82] dark:hover:border-[#003d82] transition-colors text-xs text-slate-700 dark:text-slate-300"
                >
                  <MessageSquare className="h-4 w-4 text-[#003d82] mb-1.5" />
                  <span>Explain key concepts in my notes</span>
                </button>
              </div>
            </div>
          ) : (
            /* Message Thread */
            <div className="divide-y divide-slate-100 dark:divide-[#222]">
              {/* Top Loading Spinner for Infinite Scroll Up */}
              {loadingMoreMessages && (
                <div className="flex items-center justify-center p-3 text-slate-400 border-b border-slate-100 dark:border-[#222]">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-xs font-medium">Loading older messages...</span>
                </div>
              )}

              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id || index}
                  message={msg}
                  isStreaming={
                    isStreaming &&
                    index === messages.length - 1 &&
                    msg.role === 'ASSISTANT'
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <ChatInput
          onSend={handleSendMessage}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
};
