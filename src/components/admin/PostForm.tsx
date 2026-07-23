"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils/slug";
import { useUnsavedChangesWarning } from "@/lib/hooks/useUnsavedChangesWarning";
import type { PostInput } from "@/lib/schema/content";
import type { PostDoc } from "@/lib/data/posts";
import { createPostAction, updatePostAction } from "@/lib/actions/posts";

const BLANK: PostInput = {
  title: "",
  slug: "",
  coverImageUrl: "",
  category: "",
  excerpt: "",
  content: "",
  author: "GZV",
  published: false,
  publishedAt: new Date().toISOString().slice(0, 10),
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  ogImageUrl: "",
};

export function PostForm({
  post,
  categories = [],
}: {
  post?: PostDoc;
  categories?: { label: string; slug: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<PostInput>(post ?? BLANK);
  const [saving, startSaving] = useTransition();
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(form));

  const currentSnapshot = JSON.stringify(form);
  useUnsavedChangesWarning(currentSnapshot !== savedSnapshot);

  function handleSave() {
    startSaving(async () => {
      try {
        if (post) {
          await updatePostAction(post.id, form);
          toast.success("Đã lưu bài viết.");
          setSavedSnapshot(currentSnapshot);
          router.refresh();
        } else {
          const { id } = await createPostAction(form);
          toast.success("Đã tạo bài viết.");
          setSavedSnapshot(currentSnapshot);
          router.push(`/admin/posts/${id}`);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Lưu thất bại.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tiêu đề</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Đường dẫn (slug)</Label>
              <div className="flex gap-2">
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
                <Button type="button" variant="outline" size="icon" onClick={() => setForm((f) => ({ ...f, slug: slugify(f.title) }))}>
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-ink-muted">/chia-se/{form.slug || "..."}</p>
            </div>
          </div>

          <ImageField
            aspect={16 / 10}
            label="Ảnh bìa"
            value={form.coverImageUrl}
            onChange={(url) => setForm((f) => ({ ...f, coverImageUrl: url }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Chuyên mục</Label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Chưa chọn</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Tác giả</Label>
              <Input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Ngày đăng</Label>
              <Input
                type="date"
                value={form.publishedAt?.slice(0, 10)}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tóm tắt</Label>
            <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <Label>Nội dung</Label>
            <RichTextEditor
              key={post?.id ?? "new"}
              initialContent={form.content}
              onChange={(content) => setForm((f) => ({ ...f, content }))}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Switch checked={form.published} onCheckedChange={(published) => setForm((f) => ({ ...f, published }))} />
            <span className="text-sm">{form.published ? "Đã xuất bản" : "Bản nháp"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>SEO title</Label>
              <Input value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>SEO description</Label>
              <Input value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>SEO keywords</Label>
              <Input value={form.seoKeywords} onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))} />
            </div>
            <ImageField
              aspect={1200 / 630}
              label="Ảnh OG / social share"
              value={form.ogImageUrl}
              onChange={(ogImageUrl) => setForm((f) => ({ ...f, ogImageUrl }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-brand hover:bg-brand-dark">
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Đang lưu..." : "Lưu bài viết"}
        </Button>
      </div>
    </div>
  );
}
