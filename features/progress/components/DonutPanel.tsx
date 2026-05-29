'use client';

import { ArrowRightIcon } from '@heroicons/react/20/solid';

import {
  AnimatedNumber,
  parseAnimatedNumber,
} from '@/components/shared/AnimatedNumber';
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
  onViewAll,
}: DonutPanelProps) {
  let offset = 0;
  const animatedCenterValue = parseAnimatedNumber(centerValue);

  return (
    <ProgressPanel className="flex min-h-[235px] flex-col p-3.5">
      <ProgressSectionTitle title={title} />

      <div className="grid flex-1 items-center gap-3.5 md:grid-cols-[8rem_minmax(0,1fr)]">
        <div className="relative mx-auto h-32 w-32">
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
                  className="transition-[stroke-dashoffset,stroke-dasharray] duration-500 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xl font-bold leading-none text-white">
              {animatedCenterValue ? (
                <AnimatedNumber
                  value={animatedCenterValue.numericValue}
                  prefix={animatedCenterValue.prefix}
                  suffix={animatedCenterValue.suffix}
                  decimals={animatedCenterValue.decimals}
                />
              ) : (
                centerValue
              )}
            </p>
            <p className="mt-1 text-xs text-slate-300">{centerLabel}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {segments.map((segment, index) => (
            <div
              key={segment.label}
              className="edusync-enter-fast grid grid-cols-[0.875rem_minmax(0,1fr)_auto_auto] items-center gap-2.5 text-sm"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate font-medium text-white">{segment.label}</span>
              <span className="text-xs text-slate-500">{segment.detail}</span>
              <span className="font-semibold text-white">
                <AnimatedNumber value={segment.value} suffix="%" />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-white/[0.06] pt-3 text-center">
        <ProgressLinkButton onClick={onViewAll}>
          {footerLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </ProgressLinkButton>
      </div>
    </ProgressPanel>
  );
}
