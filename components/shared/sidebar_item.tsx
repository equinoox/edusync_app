"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { darkMode } = useTheme();

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
        transition-all duration-200 group
        ${
          isActive
            ? "bg-violet-100 text-violet-700"
            : darkMode
            ? "text-white hover:bg-slate-100 hover:text-gray-800"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
        }
      `}
    >
      <span
        className={`
          transition-colors duration-200
          ${isActive ? "text-violet-600" : "text-orange-500 group-hover:text-orange-600"}
        `}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
