"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageOff, Newspaper, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { cld } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import type { PostDoc } from "@/lib/data/posts";
import type { SettingsInput } from "@/lib/schema/content";

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function PostsTable({ posts, categories }: { posts: PostDoc[]; categories: SettingsInput["postCategories"] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const categoryLabelBySlug = useMemo(() => new Map(categories.map((category) => [category.slug, category.label])), [categories]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchCategory = activeCategory ? post.category === activeCategory : true;
      const haystack = `${post.title} ${post.excerpt} ${post.author}`.toLowerCase();
      const matchQuery = needle ? haystack.includes(needle) : true;
      return matchCategory && matchQuery;
    });
  }, [posts, query, activeCategory]);

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center text-ink-muted">
        Chưa có bài viết nào.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line/70 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tiêu đề, tóm tắt, tác giả..."
              className="h-10 w-full rounded-lg border border-line/70 bg-surface pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand/60 focus:bg-white"
            />
          </div>
          <div className="text-sm font-medium text-ink-muted">
            {visible.length}/{posts.length} bài viết
          </div>
        </div>
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                activeCategory === "" ? "bg-brand text-white" : "bg-surface text-ink-muted hover:text-ink",
              )}
            >
              <Newspaper className="h-3.5 w-3.5" />
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeCategory === category.slug ? "bg-brand text-white" : "bg-surface text-ink-muted hover:text-ink",
                )}
              >
                <Newspaper className="h-3.5 w-3.5" />
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-line/70 bg-white shadow-sm">
        {visible.length === 0 ? (
          <div className="py-16 text-center text-ink-muted">Không tìm thấy bài viết phù hợp.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Chuyên mục</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-line/70 bg-surface">
                      {post.coverImageUrl ? (
                        <Image
                          src={cld(post.coverImageUrl, { width: 88, height: 88 })}
                          alt=""
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <ImageOff className="h-4 w-4 text-ink-muted" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-ink whitespace-normal">{post.title}</TableCell>
                  <TableCell className="text-ink-muted">
                    {post.category ? categoryLabelBySlug.get(post.category) ?? post.category : "—"}
                  </TableCell>
                  <TableCell className="text-ink-muted">{post.author || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{formatDate(post.publishedAt) || "—"}</TableCell>
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
      </div>
    </div>
  );
}
