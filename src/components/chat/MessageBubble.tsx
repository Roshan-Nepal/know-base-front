import React from 'react';
import { Database, User as UserIcon, FileText } from 'lucide-react';
import type { MessageResponse } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';

import { FormattedMessage } from './FormattedMessage';

interface MessageBubbleProps {
  message: MessageResponse;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'USER';

  return (
    <div className={`flex gap-4 p-4 md:p-6 transition-colors ${
      isUser ? 'bg-transparent' : 'bg-slate-50/70 dark:bg-[#1f1f1f]/50 border-y border-slate-100 dark:border-[#2a2a2a]'
    }`}>
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-[#333] flex items-center justify-center text-slate-700 dark:text-slate-200">
            <UserIcon className="h-4 w-4" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#003d82] flex items-center justify-center text-white shadow-sm">
            <Database className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Message Content Area */}
      <div className="flex-1 overflow-hidden min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {isUser ? 'You' : 'Know-Base Assistant'}
          </span>
          {message.createdAt && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {formatTimeAgo(message.createdAt)}
            </span>
          )}
        </div>

        <FormattedMessage content={message.content} isStreaming={isStreaming} />

        {/* Source Chunks / Citations */}
        {message.sourceChunks && message.sourceChunks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#333]">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>Citations ({message.sourceChunks.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {message.sourceChunks.map((chunkId, index) => (
                <span
                  key={chunkId || index}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-[#2a2a2a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#3a3a3a]"
                >
                  Source #{index + 1} ({chunkId.substring(0, 8)})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
