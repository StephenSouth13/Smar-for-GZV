"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const label = "Đổi giao diện sáng hoặc tối";

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="theme-toggle relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
    >
      <Sun className="h-[18px] w-[18px] scale-100 rotate-0 opacity-100 transition-all dark:scale-0 dark:rotate-90 dark:opacity-0" />
      <Moon className="absolute h-[18px] w-[18px] scale-0 -rotate-90 opacity-0 transition-all dark:scale-100 dark:rotate-0 dark:opacity-100" />
    </button>
  );
}
