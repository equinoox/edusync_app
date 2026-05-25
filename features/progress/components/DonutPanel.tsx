'use client';

import { ArrowRightIcon } from '@heroicons/react/20/solid';

import {
  ProgressLinkButton,
  ProgressPanel,
  ProgressSectionTitle,
} from '@/features/progress/components/progress-ui';
import type { DonutPanelProps } from '@/features/progress/types';

const radius = 48;
const circumference = 2 * Math.PI * radius;

export function DonutPanel({
  title,
  centerValue,
  centerLabel,
  segments,
  footerLabel,
}: DonutPanelProps) {
  let offset = 0;

  return (
    <ProgressPanel className="flex min-h-[285px] flex-col p-5">
      <ProgressSectionTitle title={title} />

      <div className="grid flex-1 items-center gap-5 md:grid-cols-[9.5rem_minmax(0,1fr)]">
        <div className="relative mx-auto h-40 w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(51,65,85,0.92)"
              strokeWidth="16"
            />
            {segments.map(segment => {
              const dash = (segment.value / 100) * circumference;
              const currentOffset = offset;
              offset += dash;

              return (
                <circle
                  key={segment.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="16"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="butt"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-2xl font-bold leading-none text-white">{centerValue}</p>
            <p className="mt-1 text-xs text-slate-300">{centerLabel}</p>
          </div>
        </div>

        <div className="space-y-4">
          {segments.map(segment => (
            <div key={segment.label} className="grid grid-cols-[1rem_minmax(0,1fr)_auto_auto] items-center gap-3 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate font-medium text-white">{segment.label}</span>
              <span className="text-xs text-slate-500">{segment.detail}</span>
              <span className="font-semibold text-white">{segment.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.06] pt-4 text-center">
        <ProgressLinkButton>
          {footerLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </ProgressLinkButton>
      </div>
    </ProgressPanel>
  );
}
