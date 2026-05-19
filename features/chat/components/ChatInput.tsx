import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';
import type { ChatInputProps } from '@/features/chat/types';
import { useEffect, useState } from 'react';
import type { TokenStatus } from '@/features/tokens/types';

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
        darkMode ? 'text-slate-400' : 'text-slate-600'
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
            <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>
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
      <form onSubmit={onSubmit} className="flex gap-3 items-end">
        <input
          value={value}
          onChange={event => onChange(event.currentTarget.value)}
          placeholder="Ask me anything about your study materials..."
          disabled={isLoading || isMessageLimitReached}
          className={`flex-1 rounded-2xl border-2 px-5 py-3.5 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-medium shadow-sm ${
            darkMode
              ? 'border-slate-600 bg-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 disabled:bg-slate-600 disabled:text-slate-400'
              : 'border-indigo-100 bg-white/80 backdrop-blur-sm text-slate-800 focus:border-indigo-400 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400'
          } ${isCharLimitExceeded ? (darkMode ? 'border-red-500' : 'border-red-400') : ''}`}
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim() || isCharLimitExceeded || isMessageLimitReached}
          className={`rounded-2xl px-5 py-3.5 font-semibold text-black shadow-lg transition-all duration-200 flex items-center gap-2 shrink-0 ${
            darkMode
              ? 'bg-violet-600 hover:bg-violet-700  hover:shadow-violet-800 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed'
              : 'bg-white hover:bg-indigo-700  hover:shadow-indigo-300 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <PaperAirplaneIcon className="w-6 h-6" />
          )}
        </button>
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