import Link from "next/link";
import { Briefcase, CheckCircle2, FileEdit, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { listProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminProjectsPage() {
  const [projects, settings] = await Promise.all([listProjects(), getSiteSettings()]);

  const published = projects.filter((p) => p.published).length;
  const draft = projects.length - published;
  const featured = projects.filter((p) => p.featured).length;

  const stats = [
    { label: "Tổng dự án", value: projects.length, icon: Briefcase, tone: "bg-sky-50 text-sky-700" },
    { label: "Đã xuất bản", value: published, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Bản nháp", value: draft, icon: FileEdit, tone: "bg-amber-50 text-amber-700" },
    { label: "Nổi bật", value: featured, icon: Star, tone: "bg-rose-50 text-rose-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dự án</h1>
          <p className="text-ink-muted mt-1">Quản lý dự án, danh mục và trang chi tiết hiển thị tại /du-an.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-brand hover:bg-brand-dark">
            <Plus className="h-4 w-4 mr-1" />
            Thêm dự án
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-line/70 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.tone}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-3xl font-extrabold tracking-tight text-ink">{stat.value}</div>
              <div className="text-sm font-medium text-ink-muted">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectsTable projects={projects} categories={settings.projectCategories} />
    </div>
  );
}
