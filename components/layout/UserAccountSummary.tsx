"use client";

import { UserButton, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

type UserAccountSummaryProps = {
  className?: string;
  fallbackName?: string;
  compactText?: boolean;
  variant?: "default" | "onDark";
};

const getRoleLabel = (role: unknown) => {
  if (role === "student") return "Student";
  if (role === "professor") return "Professor";
  return "Role not set";
};

export function UserAccountSummary({
  className,
  fallbackName = "Guest",
  compactText = false,
  variant = "default",
}: UserAccountSummaryProps) {
  const { darkMode } = useTheme();
  const { user } = useUser();
  const displayName = user?.fullName ?? user?.username ?? fallbackName;
  const roleLabel = getRoleLabel(user?.publicMetadata?.role);
  const nameClass = variant === "onDark"
    ? "text-white"
    : darkMode
      ? "text-white"
      : "text-slate-950";
  const roleClass = variant === "onDark"
    ? "text-slate-300"
    : darkMode
      ? "text-slate-400"
      : "text-slate-700";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="shrink-0">
        <UserButton
          appearance={{
            elements: {
              avatarBox: compactText ? "h-8 w-8" : "h-9 w-9",
            },
          }}
        />
      </div>
      <div className="min-w-0 leading-tight">
        <p
          className={cn(
            "truncate font-semibold",
            compactText ? "text-sm" : "text-base",
            nameClass,
          )}
        >
          {displayName}
        </p>
        <p
          className={cn(
            "truncate text-xs font-medium",
            roleClass,
          )}
        >
          {roleLabel}
        </p>
      </div>
    </div>
  );
}
