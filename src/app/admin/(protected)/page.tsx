import Link from "next/link";
import { FileText, Briefcase, Newspaper, Image as ImageIcon, ArrowRight } from "lucide-react";
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
    { label: "Trang", count: pages.length, href: "/admin/pages", icon: FileText },
    { label: "Dự án", count: projects.length, href: "/admin/projects", icon: Briefcase },
    { label: "Bài viết", count: posts.length, href: "/admin/posts", icon: Newspaper },
    { label: "Tệp media", count: media.length, href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tổng quan</h1>
        <p className="text-ink-muted mt-1">Quản lý toàn bộ nội dung website marketing.gzv.one tại đây.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="hover:border-brand/50 hover:shadow-md transition-all h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-muted" />
                </div>
                <div className="mt-4 text-3xl font-bold text-ink">{c.count}</div>
                <div className="text-sm text-ink-muted">{c.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bắt đầu nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-ink-muted">
          <p>
            • Vào <Link href="/admin/pages" className="text-brand-dark font-medium">Trang & Section</Link> để chỉnh
            sửa trang chủ, thêm/xoá/sắp xếp các section theo ý muốn.
          </p>
          <p>
            • Vào <Link href="/admin/projects" className="text-brand-dark font-medium">Dự án</Link> và{" "}
            <Link href="/admin/posts" className="text-brand-dark font-medium">Bài viết</Link> để quản lý các trang
            chi tiết.
          </p>
          <p>
            • Vào <Link href="/admin/media" className="text-brand-dark font-medium">Thư viện ảnh</Link> để tải ảnh
            lên trước khi dùng trong section.
          </p>
          <p>
            • Vào <Link href="/admin/settings" className="text-brand-dark font-medium">Cài đặt chung</Link> để cập
            nhật logo, menu, thông tin liên hệ và mạng xã hội.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
