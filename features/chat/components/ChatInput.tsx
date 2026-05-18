import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

export function ChatInput({ value, onChange, onSubmit, isLoading = false }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3 items-end">
      <input
        value={value}
        onChange={event => onChange(event.currentTarget.value)}
        placeholder="Ask me anything about your study materials..."
        disabled={isLoading}
        className="flex-1 rounded-2xl border-2 border-indigo-100 bg-white/80 backdrop-blur-sm px-5 py-3.5 text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400 transition-all duration-200 text-sm font-medium shadow-sm"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shrink-0"
      >
        {isLoading ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <PaperAirplaneIcon className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}