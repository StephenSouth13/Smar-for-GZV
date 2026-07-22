"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Briefcase, Eye, EyeOff, Globe2, Menu, Palette, Save, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { ListEditor } from "@/components/admin/section-editors/fields";
import type { SettingsInput } from "@/lib/schema/content";
import { saveSiteSettingsAction } from "@/lib/actions/settings";
import { slugify } from "@/lib/utils/slug";

const THEME_PRESETS = [
  { name: "Xanh lá (mặc định)", value: "#39b54a" },
  { name: "Đỏ", value: "#e11d2e" },
  { name: "Cam", value: "#f97316" },
  { name: "Xanh dương", value: "#2563eb" },
  { name: "Tím", value: "#7c3aed" },
  { name: "Hồng", value: "#db2777" },
];

export function SettingsForm({ settings }: { settings: SettingsInput }) {
  const [form, setForm] = useState<SettingsInput>(settings);
  const [saving, startSaving] = useTransition();

  function handleSave() {
    startSaving(async () => {
      try {
        await saveSiteSettingsAction(form);
        toast.success("Đã lưu cài đặt.");
      } catch {
        toast.error("Lưu thất bại.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-line/70 bg-white shadow-sm">
          <CardHeader className="border-b border-line/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe2 className="h-5 w-5 text-brand-dark" />
              Thương hiệu website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tên website</Label>
                <Input value={form.siteName} onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tagline</Label>
                <Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ImageField aspect={1} label="Logo header" value={form.logoUrl} onChange={(logoUrl) => setForm((f) => ({ ...f, logoUrl }))} />
              <ImageField aspect={1} label="Favicon tab" value={form.faviconUrl} onChange={(faviconUrl) => setForm((f) => ({ ...f, faviconUrl }))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-line/70 bg-surface/70 p-4">
              <div>
                <div className="font-medium text-ink">Hiện header trên website</div>
                <div className="text-sm text-ink-muted">Tắt khi cần landing page hoặc trang riêng không có menu.</div>
              </div>
              <Switch checked={form.showHeader} onCheckedChange={(showHeader) => setForm((f) => ({ ...f, showHeader }))} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-line/70 bg-white shadow-sm">
          <CardHeader className="border-b border-line/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-brand-dark" />
              SEO mặc định
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="space-y-1.5">
                <Label>Title tab mặc định</Label>
              <Input value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Meta description</Label>
              <Textarea rows={3} value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Keywords</Label>
              <Input
                value={form.seoKeywords}
                onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                placeholder="marketing, quảng cáo, thiết kế website"
              />
            </div>
            <ImageField
              aspect={1200 / 630}
              label="OG image mặc định"
              value={form.ogImageUrl}
              onChange={(ogImageUrl) => setForm((f) => ({ ...f, ogImageUrl }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-brand-dark" />
            Màu sắc thương hiệu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="flex flex-wrap gap-3">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, themeColor: preset.value }))}
                title={preset.name}
                className={`flex h-11 w-11 items-center justify-center rounded-full ring-offset-2 transition-all ${
                  form.themeColor.toLowerCase() === preset.value.toLowerCase()
                    ? "ring-2 ring-ink scale-110"
                    : "ring-1 ring-line hover:scale-105"
                }`}
                style={{ backgroundColor: preset.value }}
              >
                {form.themeColor.toLowerCase() === preset.value.toLowerCase() && (
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.themeColor}
              onChange={(e) => setForm((f) => ({ ...f, themeColor: e.target.value }))}
              className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-transparent p-1"
            />
            <Input
              value={form.themeColor}
              onChange={(e) => setForm((f) => ({ ...f, themeColor: e.target.value }))}
              className="max-w-40 font-mono"
            />
            <span className="text-sm text-ink-muted">Chọn màu tuỳ ý hoặc nhập mã hex</span>
          </div>
          <p className="text-xs text-ink-muted">
            Màu này áp dụng cho nút bấm, liên kết nổi bật, icon... trên toàn bộ website và trang quản trị.
          </p>
        </CardContent>
      </Card>

      <Card className="border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Menu className="h-5 w-5 text-brand-dark" />
            Menu điều hướng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <ListEditor
            items={form.headerMenu}
            onChange={(headerMenu) => setForm((f) => ({ ...f, headerMenu }))}
            newItem={() => ({ label: "Trang mới", href: "/" })}
            addLabel="Thêm mục menu"
            renderItem={(item, update) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Nhãn hiển thị" value={item.label} onChange={(e) => update({ label: e.target.value })} />
                <Input placeholder="Đường dẫn" value={item.href} onChange={(e) => update({ href: e.target.value })} />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-brand-dark" />
            Danh mục dự án
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <ListEditor
            items={form.projectCategories}
            onChange={(projectCategories) => setForm((f) => ({ ...f, projectCategories }))}
            newItem={() => ({ label: "Danh mục mới", slug: "danh-muc-moi" })}
            addLabel="Thêm danh mục"
            renderItem={(item, update) => (
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
                <Input
                  placeholder="Tên danh mục"
                  value={item.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    update({ label, slug: item.slug ? item.slug : slugify(label) });
                  }}
                />
                <Input placeholder="slug" value={item.slug} onChange={(e) => update({ slug: slugify(e.target.value) })} />
                <Button type="button" variant="outline" onClick={() => update({ slug: slugify(item.label) })}>
                  Tạo slug
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-line/70 bg-white shadow-sm">
          <CardHeader className="border-b border-line/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-brand-dark" />
              Thông tin liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Số điện thoại</Label>
                <Input value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Địa chỉ</Label>
              <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Facebook URL</Label>
                <Input value={form.socialFacebook} onChange={(e) => setForm((f) => ({ ...f, socialFacebook: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>YouTube URL</Label>
                <Input value={form.socialYoutube} onChange={(e) => setForm((f) => ({ ...f, socialYoutube: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Link Zalo</Label>
              <Input value={form.socialZalo} onChange={(e) => setForm((f) => ({ ...f, socialZalo: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-line/70 bg-white shadow-sm">
          <CardHeader className="border-b border-line/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              {form.showHeader ? <Eye className="h-5 w-5 text-brand-dark" /> : <EyeOff className="h-5 w-5 text-brand-dark" />}
              Chân trang
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <Textarea
              rows={8}
              value={form.footerText}
              onChange={(e) => setForm((f) => ({ ...f, footerText: e.target.value }))}
              placeholder="Mô tả ngắn hiển thị ở chân trang"
            />
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-brand px-6 shadow-lg shadow-brand/25 hover:bg-brand-dark">
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </div>
    </div>
  );
}
