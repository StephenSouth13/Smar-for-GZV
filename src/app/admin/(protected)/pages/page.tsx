import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listPages } from "@/lib/data/pages";

export default async function AdminPagesListPage() {
  const pages = await listPages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Trang & Section</h1>
          <p className="text-ink-muted mt-1">Xây dựng trang từ các section có sẵn — kéo thả để sắp xếp.</p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="bg-brand hover:bg-brand-dark">
            <Plus className="h-4 w-4 mr-1" />
            Tạo trang mới
          </Button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-ink-muted">Chưa có trang nào.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link key={page.slug} href={`/admin/pages/${page.slug}`}>
              <Card className="h-full hover:border-brand/50 hover:shadow-md transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
                      <FileText className="h-4 w-4" />
                    </div>
                    <Badge variant={page.published ? "default" : "secondary"} className={page.published ? "bg-brand" : ""}>
                      {page.published ? "Đã xuất bản" : "Nháp"}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-semibold text-ink">{page.title || page.slug}</h3>
                  <p className="text-sm text-ink-muted">/{page.slug === "home" ? "" : page.slug}</p>
                  <p className="mt-2 text-xs text-ink-muted">{page.sections.length} section</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
