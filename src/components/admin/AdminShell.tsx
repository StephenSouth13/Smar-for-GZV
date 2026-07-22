"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
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
  { href: "/admin/leads", label: "Tin nhắn liên hệ", icon: Mail },
  { href: "/admin/media", label: "Thư viện ảnh", icon: ImageIcon },
  { href: "/admin/settings", label: "Cài đặt chung", icon: Settings },
];

function BrandMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-base font-extrabold text-white shadow-sm shadow-brand/25">
      G
    </div>
  );
}

function NavLinks({ pathname, unreadLeads = 0 }: { pathname: string; unreadLeads?: number }) {
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-brand text-white shadow-sm shadow-brand/25"
                  : "text-ink-muted hover:bg-surface hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/admin/leads" && unreadLeads > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                    active ? "bg-white/25 text-white" : "bg-brand text-white",
                  )}
                >
                  {unreadLeads}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line/60 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" />
          Xem website
        </Link>
      </div>
    </>
  );
}

export function AdminShell({
  profile,
  unreadLeads = 0,
  children,
}: {
  profile: AdminProfile;
  unreadLeads?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5faf6_0%,#eef4f1_45%,#f8faf9_100%)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-line/60 bg-white/90 shadow-sm backdrop-blur md:flex">
        <div className="flex h-20 items-center gap-3 border-b border-line/60 px-5">
          <BrandMark />
          <div>
            <div className="text-base font-bold text-ink">GZV Admin</div>
            <div className="text-xs font-medium text-ink-muted">Trung tâm nội dung</div>
          </div>
        </div>
        <NavLinks pathname={pathname} unreadLeads={unreadLeads} />
      </aside>

      <div className="min-w-0 md:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line/60 bg-white/85 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3 md:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                <SheetTitle className="sr-only">Menu quản trị</SheetTitle>
                <div className="flex h-20 items-center gap-3 border-b border-line/60 px-5">
                  <BrandMark />
                  <div>
                    <div className="text-base font-bold text-ink">GZV Admin</div>
                    <div className="text-xs font-medium text-ink-muted">Trung tâm nội dung</div>
                  </div>
                </div>
                <NavLinks pathname={pathname} unreadLeads={unreadLeads} />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-ink">GZV Admin</span>
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Quản trị website</div>
            <div className="text-sm text-ink-muted">Cập nhật nội dung, SEO và giao diện public</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-line/70 bg-white px-3 py-1.5 text-sm font-medium text-ink sm:block">
              {profile.name}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Đăng xuất
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
