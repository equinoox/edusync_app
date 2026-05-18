"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 group
        ${
          isActive
            ? "bg-violet-100 text-violet-700"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        }
      `}
    >
      <span
        className={`
          transition-colors duration-200
          ${isActive ? "text-violet-600" : "text-gray-400 group-hover:text-gray-600"}
        `}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}