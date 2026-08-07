import { useState, useCallback } from 'react';
import { axiosInstance } from '../services/api';

interface UseChatStreamOptions {
  onStreamChunk: (chunk: string) => void;
  onStreamComplete: (fullMessage: string) => void;
  onStreamError: (error: string) => void;
}

export const useChatStream = () => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const sendMessageStream = useCallback(
    async (
      message: string,
      conversationId: string | null,
      options: UseChatStreamOptions
    ) => {
      setIsStreaming(true);
      setStreamError(null);

      let accumulatedText = '';

      try {
        const response = await axiosInstance.post(
          '/api/v1/chat',
          {
            conversationId: conversationId || null,
            message: message,
          },
          {
            responseType: 'stream',
            adapter: 'fetch',
          }
        );

        const stream: ReadableStream<Uint8Array> = response.data;
        if (!stream || typeof stream.getReader !== 'function') {
          throw new Error('Streaming is not supported by the response.');
        }

        const reader = stream.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (let line of lines) {
            if (line.endsWith('\r')) {
              line = line.slice(0, -1);
            }

            let tokenChunk = line;
            if (line.startsWith('data:')) {
              const rawData = line.substring(5);
              tokenChunk = rawData === '' ? '\n' : rawData;
            } else if (!line) {
              continue;
            }

            if (tokenChunk === '[DONE]') continue;

            accumulatedText += tokenChunk;
            options.onStreamChunk(tokenChunk);
          }
        }

        if (buffer) {
          let line = buffer;
          if (line.endsWith('\r')) {
            line = line.slice(0, -1);
          }
          let tokenChunk = line;
          if (line.startsWith('data:')) {
            const rawData = line.substring(5);
            tokenChunk = rawData === '' ? '\n' : rawData;
          }
          if (tokenChunk && tokenChunk !== '[DONE]') {
            accumulatedText += tokenChunk;
            options.onStreamChunk(tokenChunk);
          }
        }

        options.onStreamComplete(accumulatedText);
      } catch (err: any) {
        const msg = err.message || 'An error occurred while communicating with the assistant.';
        setStreamError(msg);
        options.onStreamError(msg);
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  return {
    isStreaming,
    streamError,
    sendMessageStream,
  };
};
