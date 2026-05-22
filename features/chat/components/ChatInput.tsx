import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';
import type { ChatInputProps } from '@/features/chat/types';
import { useEffect, useState } from 'react';
import type { TokenStatus } from '@/features/tokens/types';
import { DocumentUploadButton } from '@/features/documents/components/DocumentUploadButton';
import { SubmitButton } from '@/features/chat/components/SubmitButton';

export function ChatInput({ value, onChange, onSubmit, isLoading = false, messages = [] }: ChatInputProps) {
  const { darkMode } = useTheme();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  
  const charCount = value.length;

  const fetchTokenStatus = async () => {
    try {
      const response = await fetch('/api/user/token-status');
      if (response.ok) {
        const data = await response.json();
        setTokenStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch token status:', error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchTokenStatus();
  }, []);

  // Refresh token status when messages array changes (after message sent)
  useEffect(() => {
    if (messages.length > 0) {
      fetchTokenStatus();
    }
  }, [messages.length]);

  const isCharLimitExceeded = charCount > 15000;
  const isMessageLimitReached = tokenStatus?.isLimited;

  return (
    <div className="space-y-3">
      {/* Token Status Display */}
      <div className={`flex gap-4 text-xs font-medium px-1 ${
        darkMode ? 'text-white' : 'text-white'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isMessageLimitReached 
              ? 'bg-red-500' 
              : tokenStatus && tokenStatus.messagesRemaining <= 3
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`} />
          <span>
            Messages: {tokenStatus?.messagesUsed ?? 0}/{tokenStatus?.messageLimit ?? 15}
          </span>
          {tokenStatus && tokenStatus.hoursUntilReset > 0 && (
            <span className={darkMode ? 'text-orange-500' : 'text-orange-500'}>
              ({Math.ceil(tokenStatus.hoursUntilReset)}h until reset)
            </span>
          )}
        </div>
        <div className={`flex items-center gap-2 ${
          isCharLimitExceeded ? 'text-red-500' : ''
        }`}>
          <span>Characters: {charCount}/15000</span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={onSubmit} className="flex items-end gap-3">
        <input
          value={value}
          onChange={event => onChange(event.currentTarget.value)}
          placeholder="Ask me anything about your study materials..."
          disabled={isLoading || isMessageLimitReached}
          className={`flex-1 rounded-2xl border-2 px-5 py-3.5 text-sm font-medium shadow-sm placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
            darkMode
              ? 'border-slate-600 bg-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 disabled:bg-slate-600 disabled:text-slate-400'
              : 'border-indigo-100 bg-white/80 text-slate-800 backdrop-blur-sm focus:border-indigo-400 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400'
          } ${isCharLimitExceeded ? (darkMode ? 'border-red-500' : 'border-red-400') : ''}`}
        />

        <div className="flex shrink-0 items-end gap-3">
          <DocumentUploadButton className="hidden sm:flex" disabled={isLoading || isMessageLimitReached} />

          <SubmitButton
            darkMode={darkMode}
            isLoading={isLoading}
            disabled={
              isLoading ||
              !value.trim() ||
              isCharLimitExceeded ||
              Boolean(isMessageLimitReached)
            }
          />
        </div>
      </form>

      {/* Error Messages */}
      {isCharLimitExceeded && (
        <p className="text-xs text-red-500 font-medium px-1">
          ⚠️ Message exceeds 15,000 character limit
        </p>
      )}
      {isMessageLimitReached && (
        <p className="text-xs text-red-500 font-medium px-1">
          ⚠️ Daily message limit reached. {Math.ceil(tokenStatus?.hoursUntilReset ?? 0)} hours until reset.
        </p>
      )}
    </div>
  );
}
