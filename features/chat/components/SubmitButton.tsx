import { SubmitButtonProps } from '../types'; 
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';  

export function SubmitButton({
  disabled,
  darkMode,
  isLoading = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex h-[52px] shrink-0 items-center gap-2 rounded-2xl px-5 font-semibold text-black shadow-lg transition-all duration-200 ${
        darkMode
          ? 'bg-violet-600 hover:bg-violet-700 hover:shadow-violet-800 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none'
          : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none'
      }`}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <PaperAirplaneIcon className="h-6 w-6" />
      )}
    </button>
  );
}
