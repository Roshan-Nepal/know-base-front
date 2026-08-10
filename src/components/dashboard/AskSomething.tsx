import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, MessageSquare, Plus } from 'lucide-react';

export const AskSomething: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const handleAsk = (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;
    navigate('/chat', { state: { initialPrompt: trimmed } });
  };

  const handleNewConversation = () => {
    navigate('/chat');
  };

  return (
    <div className="bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333] rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-[#003d82]/10 dark:bg-[#003d82]/20 text-[#003d82] dark:text-[#3b82f6]">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Ask something
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-[#a1a1aa] mb-6 leading-relaxed">
          Jump into a new conversation with your knowledge base.
        </p>

        {/* Quick Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(question);
          }}
          className="relative mb-6"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-[#2a2a2a] border border-slate-200 dark:border-[#333] focus:border-[#003d82] dark:focus:border-[#003d82] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717a] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#003d82] text-white disabled:opacity-30 hover:bg-[#002d62] transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Suggestion Prompt Chips */}
        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => handleAsk('Summarize my uploaded documents')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-[#333] transition-colors group flex items-center justify-between"
          >
            <span className="text-xs text-slate-700 dark:text-[#e4e4e7] group-hover:text-[#003d82] dark:group-hover:text-white transition-colors font-medium">
              Summarize my uploaded documents
            </span>
            <MessageSquare className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#003d82] shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => handleAsk('Explain key concepts in my notes')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-[#333] transition-colors group flex items-center justify-between"
          >
            <span className="text-xs text-slate-700 dark:text-[#e4e4e7] group-hover:text-[#003d82] dark:group-hover:text-white transition-colors font-medium">
              Explain key concepts in my notes
            </span>
            <MessageSquare className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#003d82] shrink-0" />
          </button>
        </div>
      </div>

      {/* New Conversation Action */}
      <button
        type="button"
        onClick={handleNewConversation}
        className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-sm shadow hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New conversation
      </button>
    </div>
  );
};
