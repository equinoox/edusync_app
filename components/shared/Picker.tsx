"use client";

import { ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import { useTheme } from "@/providers/ThemeProvider";

export type PickerOption = {
  value: string;
  label: string;
};

type PickerProps = {
  options: PickerOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  clearLabel?: string;
  disabled?: boolean;
  allowClear?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function Picker({
  options,
  value = "",
  onChange,
  placeholder = "Choose option",
  clearLabel = "Clear selection",
  disabled = false,
  allowClear = true,
  ariaLabel = "Choose option",
  className = "",
}: PickerProps) {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(option => option.value === value);
  const isDisabled = disabled || options.length === 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={pickerRef} className={`relative w-full sm:w-56 ${className}`}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setIsOpen(current => !current)}
        aria-label={ariaLabel}
        className={`edusync-button-motion flex h-12 w-full items-center justify-between gap-3 rounded-2xl border-2 px-3.5 text-sm font-semibold shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
          darkMode
            ? "border-slate-600 bg-slate-700 text-white hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500/20"
            : "border-indigo-100 bg-white/80 text-slate-800 backdrop-blur-sm hover:border-indigo-400 focus:border-indigo-400 focus:ring-indigo-500/10"
        }`}
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronUpDownIcon
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${darkMode ? "text-orange-400" : "text-indigo-500"}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute bottom-full left-0 z-50 mb-2 max-h-72 w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md edusync-scale-in ${
            darkMode
              ? "border-slate-600 bg-slate-800/95 text-white"
              : "border-indigo-100 bg-white/95 text-slate-800"
          }`}
        >
          <div className="max-h-72 overflow-y-auto p-2">
            {allowClear && value && (
              <button
                type="button"
                onClick={() => {
                  onChange?.("");
                  setIsOpen(false);
                }}
                  className={`edusync-button-motion mb-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors duration-200 ${
                  darkMode
                    ? "text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <XMarkIcon className="h-4 w-4 shrink-0" />
                {clearLabel}
              </button>
            )}

            {options.map(option => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={`edusync-button-motion w-full rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors duration-200 ${
                    isSelected
                      ? darkMode
                        ? "bg-orange-500 text-white"
                        : "bg-indigo-500 text-white"
                      : darkMode
                        ? "text-slate-200 hover:bg-slate-700 hover:text-orange-400"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <span className="block truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
