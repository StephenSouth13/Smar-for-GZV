import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { listPosts } from "@/lib/data/posts";

export default async function AdminPostsPage() {
  const posts = await listPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Bài viết</h1>
          <p className="text-ink-muted mt-1">Quản lý bài viết hiển thị tại /chia-se.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-brand hover:bg-brand-dark">
            <Plus className="h-4 w-4 mr-1" />
            Thêm bài viết
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <div className="py-16 text-center text-ink-muted">Chưa có bài viết nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Chuyên mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium text-ink">{post.title}</TableCell>
                    <TableCell className="text-ink-muted">{post.category || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-brand" : ""}>
                        {post.published ? "Đã xuất bản" : "Nháp"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PostRowActions id={post.id} title={post.title} />
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
