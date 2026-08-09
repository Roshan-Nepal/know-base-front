import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface FormattedMessageProps {
  content: string;
  isStreaming?: boolean;
}

interface CodeBlockItem {
  type: 'code';
  language: string;
  code: string;
}

interface TextBlockItem {
  type: 'text';
  text: string;
}

type BlockItem = CodeBlockItem | TextBlockItem;

const parseMarkdownBlocks = (text: string): BlockItem[] => {
  const blocks: BlockItem[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)(?:```|$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = text.substring(lastIndex, match.index);
      if (textChunk) {
        blocks.push({ type: 'text', text: textChunk });
      }
    }

    const language = match[1] || 'code';
    const code = match[2];

    blocks.push({
      type: 'code',
      language: language.toUpperCase(),
      code: code,
    });

    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const textChunk = text.substring(lastIndex);
    if (textChunk) {
      blocks.push({ type: 'text', text: textChunk });
    }
  }

  return blocks;
};

const renderInlineFormattedText = (text: string): React.ReactNode => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-200/80 dark:bg-[#2d2d2d] text-[#003d82] dark:text-[#60a5fa] font-mono text-xs font-medium border border-slate-300/50 dark:border-[#3d3d3d]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic text-slate-800 dark:text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl border border-slate-700/60 dark:border-[#333] bg-[#1e1e1e] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-slate-700/50 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono font-semibold text-slate-300">
          <Code2 className="h-3.5 w-3.5 text-[#3b82f6]" />
          <span>{language || 'CODE'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre font-normal">
          {code}
        </pre>
      </div>
    </div>
  );
};

const Cursor = () => (
  <span className="inline-block w-2 h-4 ml-1 bg-[#003d82] dark:bg-white animate-pulse align-middle" />
);

const TextBlock: React.FC<{ text: string; isLast: boolean; isStreaming?: boolean }> = ({
  text,
  isLast,
  isStreaming,
}) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, lineIndex) => {
        const isLastLine = isLast && lineIndex === lines.length - 1;
        const trimmed = line.trim();

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIndex} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">
              {renderInlineFormattedText(trimmed.substring(4))}
              {isLastLine && isStreaming && <Cursor />}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIndex} className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-1.5">
              {renderInlineFormattedText(trimmed.substring(3))}
              {isLastLine && isStreaming && <Cursor />}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={lineIndex} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
              {renderInlineFormattedText(trimmed.substring(2))}
              {isLastLine && isStreaming && <Cursor />}
            </h2>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          return (
            <div key={lineIndex} className="flex items-start gap-2.5 ml-2 my-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#003d82] dark:bg-[#3b82f6] shrink-0 mt-2" />
              <div className="flex-1">
                {renderInlineFormattedText(trimmed.substring(2))}
                {isLastLine && isStreaming && <Cursor />}
              </div>
            </div>
          );
        }

        // Numbered lists (e.g. "1. ", "2. ")
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lineIndex} className="flex items-start gap-2 ml-2 my-1">
              <span className="font-semibold text-xs text-[#003d82] dark:text-[#3b82f6] shrink-0 mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1">
                {renderInlineFormattedText(numMatch[2])}
                {isLastLine && isStreaming && <Cursor />}
              </div>
            </div>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={lineIndex} className="pl-3 py-1 my-1 border-l-2 border-[#003d82] dark:border-[#3b82f6] text-slate-600 dark:text-slate-400 italic text-xs">
              {renderInlineFormattedText(trimmed.substring(2))}
              {isLastLine && isStreaming && <Cursor />}
            </blockquote>
          );
        }

        // Empty lines (paragraph gaps)
        if (!trimmed) {
          return (
            <div key={lineIndex} className="h-2">
              {isLastLine && isStreaming && <Cursor />}
            </div>
          );
        }

        // Normal paragraph line
        return (
          <p key={lineIndex} className="my-0.5">
            {renderInlineFormattedText(line)}
            {isLastLine && isStreaming && <Cursor />}
          </p>
        );
      })}
    </div>
  );
};

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isStreaming }) => {
  if (!content) {
    return isStreaming ? <Cursor /> : null;
  }

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-3 leading-relaxed text-sm text-slate-800 dark:text-slate-200">
      {blocks.map((block, index) => {
        if (block.type === 'code') {
          return (
            <CodeBlock
              key={index}
              language={block.language}
              code={block.code}
            />
          );
        }

        return (
          <TextBlock
            key={index}
            text={block.text}
            isLast={index === blocks.length - 1}
            isStreaming={isStreaming}
          />
        );
      })}
    </div>
  );
};
