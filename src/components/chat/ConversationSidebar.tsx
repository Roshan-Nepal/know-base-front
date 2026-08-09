import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Loader2, ChevronDown } from 'lucide-react';
import type { ConversationResponse } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';

interface ConversationSidebarProps {
  conversations: ConversationResponse[];
  activeConversationId: string | null;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onLoadMore: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationId,
  loading,
  hasMore,
  loadingMore,
  onSelectConversation,
  onNewChat,
  onLoadMore,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter((c) =>
    (c.title || 'Untitled Chat').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-72 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-[#333] flex flex-col h-full shrink-0">
      {/* New Chat Action */}
      <div className="p-4 border-b border-slate-200 dark:border-[#333]">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#003d82] hover:bg-[#002d62] text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-[#262626]">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#71717a]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#262626] border border-transparent rounded-lg text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-[#71717a] focus:outline-none focus:border-slate-300 dark:focus:border-[#404040]"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span className="text-xs font-medium">Loading history...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
            {searchTerm ? 'No matching conversations' : 'No conversation history yet'}
          </div>
        ) : (
          <>
            {filteredConversations.map((convo) => {
              const isActive = activeConversationId === convo.id;
              return (
                <button
                  key={convo.id}
                  onClick={() => onSelectConversation(convo.id)}
                  className={`
                    w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors group
                    ${isActive
                      ? 'bg-[#003d82] text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#262626]'
                    }
                  `}
                >
                  <MessageSquare className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                  <div className="flex-1 overflow-hidden min-w-0">
                    <h4 className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                      {convo.title || 'Untitled Chat'}
                    </h4>
                    <p className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                      {convo.createdAt ? formatTimeAgo(convo.createdAt) : ''}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Load More Button at bottom of conversation list */}
            {hasMore && !searchTerm && (
              <div className="pt-2 pb-1 px-1">
                <button
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#262626] hover:bg-slate-200 dark:hover:bg-[#333] rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      <span>Load More</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
