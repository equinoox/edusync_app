'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import { ProgressPanel, ProgressSectionTitle } from '@/features/progress/components/progress-ui';
import type { ProgressLineChartPoint } from '@/features/progress/types';
import type { ProgressLineChartProps } from '@/features/progress/types';

const chartWidth = 760;
const chartHeight = 250;
const padding = { top: 18, right: 22, bottom: 32, left: 44 };
const plotWidth = chartWidth - padding.left - padding.right;
const plotHeight = chartHeight - padding.top - padding.bottom;

const getPoint = (
  point: ProgressLineChartPoint,
  index: number,
  length: number,
  key: 'overallProgress' | 'quizAverage' | 'studyTimePercent',
) => {
  const x =
    padding.left +
    (length <= 1 ? plotWidth / 2 : (index / (length - 1)) * plotWidth);
  const y =
    padding.top + plotHeight - (Math.min(100, Math.max(0, point[key])) / 100) * plotHeight;

  return { x, y };
};

const buildPath = (
  points: ProgressLineChartPoint[],
  key: 'overallProgress' | 'quizAverage' | 'studyTimePercent',
) =>
  points
    .map((point, index) => {
      const { x, y } = getPoint(point, index, points.length, key);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

export function ProgressLineChart({ points }: ProgressLineChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartPoints = points;
  const activePoint =
    activeIndex === null ? null : chartPoints[activeIndex] ?? null;
  const activeCoordinates =
    activePoint && activeIndex !== null
      ? getPoint(activePoint, activeIndex, chartPoints.length, 'overallProgress')
      : null;

  return (
    <ProgressPanel className="p-5">
      <ProgressSectionTitle
        title="Progress Over Time"
        action={
          <button
            type="button"
            className="flex h-10 items-center gap-3 rounded-xl bg-slate-800/80 px-4 text-sm text-slate-200"
          >
            Weekly
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </button>
        }
      />

      <div className="mb-3 flex flex-wrap gap-7 text-xs text-slate-300">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          Overall Progress
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Quiz Average
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          Study Points
        </span>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[270px] w-full"
          role="img"
          aria-label="Progress over time chart"
        >
          {[0, 25, 50, 75, 100].map(value => {
            const y = padding.top + plotHeight - (value / 100) * plotHeight;
            return (
              <g key={value}>
                <line
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(148,163,184,0.13)"
                />
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-300 text-[12px]"
                >
                  {value}%
                </text>
              </g>
            );
          })}

          {chartPoints.map((point, index) => {
            const x = getPoint(point, index, chartPoints.length, 'overallProgress').x;
            const showLabel =
              index === 0 ||
              index === chartPoints.length - 1 ||
              index % Math.max(1, Math.floor(chartPoints.length / 5)) === 0;

            return showLabel ? (
              <text
                key={`${point.label}-${index}`}
                x={x}
                y={chartHeight - 7}
                textAnchor="middle"
                className="fill-slate-300 text-[12px]"
              >
                {point.label}
              </text>
            ) : null;
          })}

          <path d={buildPath(chartPoints, 'quizAverage')} fill="none" stroke="#4ade80" strokeWidth="2.4" />
          <path d={buildPath(chartPoints, 'overallProgress')} fill="none" stroke="#8b5cf6" strokeWidth="2.4" />
          <path d={buildPath(chartPoints, 'studyTimePercent')} fill="none" stroke="#fb923c" strokeWidth="2.4" />

          {(['quizAverage', 'overallProgress', 'studyTimePercent'] as const).map(key =>
            chartPoints.map((point, index) => {
              const { x, y } = getPoint(point, index, chartPoints.length, key);
              const color =
                key === 'quizAverage'
                  ? '#4ade80'
                  : key === 'overallProgress'
                    ? '#8b5cf6'
                    : '#fb923c';

              return (
                <circle
                  key={`${key}-${point.label}-${index}`}
                  cx={x}
                  cy={y}
                  r={index === activeIndex ? 6 : 3.5}
                  fill={color}
                  stroke="rgba(15,23,42,0.9)"
                  strokeWidth="2"
                  onMouseEnter={() => setActiveIndex(index)}
                />
              );
            }),
          )}

          {chartPoints.map((point, index) => {
            const x = getPoint(point, index, chartPoints.length, 'overallProgress').x;
            const nextX =
              index < chartPoints.length - 1
                ? getPoint(chartPoints[index + 1], index + 1, chartPoints.length, 'overallProgress').x
                : chartWidth - padding.right;
            const previousX =
              index > 0
                ? getPoint(chartPoints[index - 1], index - 1, chartPoints.length, 'overallProgress').x
                : padding.left;
            const bandStart = index === 0 ? padding.left : previousX + (x - previousX) / 2;
            const bandEnd =
              index === chartPoints.length - 1
                ? chartWidth - padding.right
                : x + (nextX - x) / 2;

            return (
              <rect
                key={`hover-band-${point.label}-${index}`}
                x={bandStart}
                y={padding.top}
                width={Math.max(1, bandEnd - bandStart)}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setActiveIndex(index)}
              />
            );
          })}

          {activeCoordinates && (
            <line
              x1={activeCoordinates.x}
              x2={activeCoordinates.x}
              y1={padding.top}
              y2={chartHeight - padding.bottom}
              stroke="rgba(148,163,184,0.28)"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {activePoint && activeCoordinates && (
          <div
            className="absolute hidden w-48 rounded-xl border border-white/[0.04] bg-slate-950/80 p-4 text-xs shadow-2xl backdrop-blur md:block"
            style={{
              left: `min(calc(100% - 12rem), max(0px, calc(${(activeCoordinates.x / chartWidth) * 100}% - 6rem)))`,
              top: '42%',
            }}
          >
            <p className="mb-3 text-sm text-slate-300">{activePoint.label}</p>
            <div className="space-y-2 text-slate-300">
              <p className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Overall Progress
                </span>
                <b className="text-white">{Math.round(activePoint.overallProgress)}%</b>
              </p>
              <p className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Quiz Average
                </span>
                <b className="text-white">{Math.round(activePoint.quizAverage)}%</b>
              </p>
              <p className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                  Study Points
                </span>
                <b className="text-white">{activePoint.studyTimeLabel}</b>
              </p>
            </div>
          </div>
        )}
      </div>
    </ProgressPanel>
  );
}
