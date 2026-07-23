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
import type { ProjectInput } from "@/lib/schema/content";
import type { ProjectDoc } from "@/lib/data/projects";
import { createProjectAction, updateProjectAction } from "@/lib/actions/projects";

const BLANK: ProjectInput = {
  title: "",
  slug: "",
  coverImageUrl: "",
  gallery: [],
  client: "",
  liveUrl: "",
  category: "",
  tags: [],
  summary: "",
  content: "",
  order: 0,
  featured: false,
  published: false,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  ogImageUrl: "",
};

export function ProjectForm({
  project,
  categories = [],
}: {
  project?: ProjectDoc;
  categories?: { label: string; slug: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(project ?? BLANK);
  const [tagsInput, setTagsInput] = useState(form.tags.join(", "));
  const [galleryInput, setGalleryInput] = useState(form.gallery.join("\n"));
  const [saving, startSaving] = useTransition();
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify({ form, tagsInput, galleryInput }));

  const currentSnapshot = JSON.stringify({ form, tagsInput, galleryInput });
  useUnsavedChangesWarning(currentSnapshot !== savedSnapshot);

  function handleSave() {
    const payload: ProjectInput = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gallery: galleryInput
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    };

    startSaving(async () => {
      try {
        if (project) {
          await updateProjectAction(project.id, payload);
          toast.success("Đã lưu dự án.");
          setSavedSnapshot(currentSnapshot);
          router.refresh();
        } else {
          const { id } = await createProjectAction(payload);
          toast.success("Đã tạo dự án.");
          setSavedSnapshot(currentSnapshot);
          router.push(`/admin/projects/${id}`);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Lưu thất bại.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-line/70 bg-white shadow-sm">
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tên dự án</Label>
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
              <p className="text-xs text-ink-muted">/du-an/{form.slug || "..."}</p>
            </div>
          </div>

          <ImageField
            aspect={4 / 3}
            label="Ảnh bìa"
            value={form.coverImageUrl}
            onChange={(url) => setForm((f) => ({ ...f, coverImageUrl: url }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Khách hàng</Label>
              <Input value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Danh mục</Label>
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
              <Label>Thứ tự</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Link website dự án thực tế (tuỳ chọn)</Label>
            <Input
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              placeholder="https://quachthanhlong.com"
            />
            <p className="text-xs text-ink-muted">
              Nếu có, ảnh bìa trên trang /du-an sẽ dẫn thẳng tới link này. Nếu để trống, ảnh bìa dẫn tới trang chi tiết dự án.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Dịch vụ / tag</Label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Content, Design, Website" />
          </div>

          <div className="space-y-1.5">
            <Label>Tóm tắt</Label>
            <Textarea rows={3} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <Label>Nội dung chi tiết</Label>
            <RichTextEditor
              key={project?.id ?? "new"}
              initialContent={form.content}
              onChange={(content) => setForm((f) => ({ ...f, content }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Thư viện ảnh</Label>
            <Textarea rows={4} value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder="Mỗi dòng một URL ảnh" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <Switch checked={form.featured} onCheckedChange={(featured) => setForm((f) => ({ ...f, featured }))} />
              <span className="text-sm">Dự án nổi bật</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={(published) => setForm((f) => ({ ...f, published }))} />
              <span className="text-sm">{form.published ? "Đã xuất bản" : "Bản nháp"}</span>
            </div>
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
          {saving ? "Đang lưu..." : "Lưu dự án"}
        </Button>
      </div>
    </div>
  );
}
