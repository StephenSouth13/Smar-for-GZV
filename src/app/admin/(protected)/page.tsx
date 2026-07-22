import Link from "next/link";
import { ArrowRight, Briefcase, FilePlus2, FileText, Image as ImageIcon, Newspaper, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listPages } from "@/lib/data/pages";
import { listProjects } from "@/lib/data/projects";
import { listPosts } from "@/lib/data/posts";
import { listMedia } from "@/lib/data/media";

export default async function AdminDashboardPage() {
  const [pages, projects, posts, media] = await Promise.all([
    listPages(),
    listProjects(),
    listPosts(),
    listMedia().catch(() => []),
  ]);

  const cards = [
    { label: "Trang", count: pages.length, href: "/admin/pages", icon: FileText, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Dự án", count: projects.length, href: "/admin/projects", icon: Briefcase, tone: "bg-sky-50 text-sky-700" },
    { label: "Bài viết", count: posts.length, href: "/admin/posts", icon: Newspaper, tone: "bg-amber-50 text-amber-700" },
    { label: "Media", count: media.length, href: "/admin/media", icon: ImageIcon, tone: "bg-rose-50 text-rose-700" },
  ];

  const quickActions = [
    { label: "Tạo trang mới", href: "/admin/pages/new", icon: FilePlus2 },
    { label: "Chỉnh trang chủ", href: "/admin/pages/home", icon: FileText },
    { label: "Cài đặt SEO", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-xl border border-line/70 bg-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end lg:p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Dashboard</div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">Quản trị website GZV</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              Quản lý trang, section, SEO, logo, media và nội dung hiển thị trên website từ một nơi duy nhất.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center gap-2 rounded-lg border border-line/70 bg-surface px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand/50 hover:text-brand-dark"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="h-full border-line/70 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${c.tone}`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-muted" />
                </div>
                <div className="mt-5 text-4xl font-extrabold tracking-tight text-ink">{c.count}</div>
                <div className="text-sm font-medium text-ink-muted">{c.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60">
          <CardTitle>Luồng làm việc nhanh</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 pt-5 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between rounded-lg border border-line/70 bg-surface/70 p-4 transition-colors hover:border-brand/50 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="font-semibold text-ink">{action.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-muted" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
