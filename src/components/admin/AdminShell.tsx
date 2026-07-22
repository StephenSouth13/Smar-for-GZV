"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Newspaper,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { AdminProfile } from "@/lib/auth/session";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Trang & Section", icon: FileText },
  { href: "/admin/projects", label: "Dự án", icon: Briefcase },
  { href: "/admin/posts", label: "Bài viết", icon: Newspaper },
  { href: "/admin/media", label: "Thư viện ảnh", icon: ImageIcon },
  { href: "/admin/settings", label: "Cài đặt chung", icon: Settings },
];

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand/10 text-brand-dark"
                  : "text-ink-muted hover:bg-surface hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line/60 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" />
          Xem website
        </Link>
      </div>
    </>
  );
}

export function AdminShell({ profile, children }: { profile: AdminProfile; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden md:flex w-64 flex-col border-r border-line/60 bg-white">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-line/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold">
            G
          </div>
          <span className="font-semibold text-ink">GZV Admin</span>
        </div>
        <NavLinks pathname={pathname} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-line/60 bg-white flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <SheetTitle className="sr-only">Menu quản trị</SheetTitle>
                <div className="flex items-center gap-2 px-5 h-16 border-b border-line/60">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold">
                    G
                  </div>
                  <span className="font-semibold text-ink">GZV Admin</span>
                </div>
                <NavLinks pathname={pathname} />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-ink">GZV Admin</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-muted hidden sm:inline">{profile.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Đăng xuất
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
