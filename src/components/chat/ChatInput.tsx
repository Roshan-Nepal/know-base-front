import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isStreaming, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  return (
    <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-slate-200 dark:border-[#333]">
      <div className="max-w-4xl mx-auto relative flex items-center bg-slate-100 dark:bg-[#262626] border border-slate-200 dark:border-[#3a3a3a] rounded-2xl px-4 py-2 focus-within:border-[#003d82] dark:focus-within:border-[#003d82] transition-colors">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents..."
          disabled={isStreaming || disabled}
          className="flex-1 bg-transparent border-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-[#71717a] focus:outline-none resize-none py-1.5 pr-10 max-h-40 min-h-[36px]"
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || isStreaming || disabled}
          className="absolute right-3 bottom-2.5 p-2 rounded-xl bg-[#003d82] hover:bg-[#002d62] text-white disabled:opacity-40 disabled:hover:bg-[#003d82] transition-all shadow-sm"
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Send className="h-4 w-4 text-white" />
          )}
        </button>
      </div>
      <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
        Know-Base Assistant responds using RAG semantic search over your uploaded knowledge base.
      </p>
    </div>
  );
};
