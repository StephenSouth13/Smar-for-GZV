import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { listProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminProjectsPage() {
  const [projects, settings] = await Promise.all([listProjects(), getSiteSettings()]);
  const categoryLabelBySlug = new Map(settings.projectCategories.map((category) => [category.slug, category.label]));

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

      <Card className="border-line/70 bg-white shadow-sm">
        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="py-16 text-center text-ink-muted">Chưa có dự án nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên dự án</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium text-ink">
                      {project.title}
                      {project.featured && (
                        <Badge variant="secondary" className="ml-2">
                          Nổi bật
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-ink-muted">{project.client || "—"}</TableCell>
                    <TableCell className="text-ink-muted">
                      {project.category ? categoryLabelBySlug.get(project.category) ?? project.category : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.published ? "default" : "secondary"} className={project.published ? "bg-brand" : ""}>
                        {project.published ? "Đã xuất bản" : "Nháp"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ProjectRowActions id={project.id} title={project.title} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
