import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';
import type { ChatInputProps } from '@/features/chat/types';

export function ChatInput({ value, onChange, onSubmit, isLoading = false }: ChatInputProps) {
  const { darkMode } = useTheme();
  
  return (
    <form onSubmit={onSubmit} className="flex gap-3 items-end">
      <input
        value={value}
        onChange={event => onChange(event.currentTarget.value)}
        placeholder="Ask me anything about your study materials..."
        disabled={isLoading}
        className={`flex-1 rounded-2xl border-2 px-5 py-3.5 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-medium shadow-sm ${
          darkMode
            ? 'border-slate-600 bg-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 disabled:bg-slate-600 disabled:text-slate-400'
            : 'border-indigo-100 bg-white/80 backdrop-blur-sm text-slate-800 focus:border-indigo-400 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400'
        }`}
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
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
  );
}