"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AnimatedNumber({
  value,
  duration = 900,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  const normalizedValue = useMemo(
    () => (Number.isFinite(value) ? value : 0),
    [value],
  );

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    if (hasAnimatedRef.current || prefersReducedMotion()) {
      setDisplayValue(normalizedValue);
      hasAnimatedRef.current = true;
      return;
    }

    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(normalizedValue * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      setDisplayValue(normalizedValue);
      hasAnimatedRef.current = true;
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, normalizedValue]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function parseAnimatedNumber(value: string | number) {
  if (typeof value === "number") {
    return { numericValue: value, prefix: "", suffix: "", decimals: Number.isInteger(value) ? 0 : 1 };
  }

  const match = value.trim().match(/^([^0-9+-]*)([+-]?\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return null;
  }

  const numericValue = Number(match[2]);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return {
    numericValue,
    prefix: match[1] ?? "",
    suffix: match[3] ?? "",
    decimals: match[2]?.includes(".") ? 1 : 0,
  };
}
