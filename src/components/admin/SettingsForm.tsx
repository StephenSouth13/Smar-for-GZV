"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Briefcase, Check, Eye, EyeOff, Globe2, Loader2, Menu, Palette, PanelBottom, Save, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageField } from "@/components/admin/ImageField";
import { ListEditor } from "@/components/admin/section-editors/fields";
import type { SettingsInput } from "@/lib/schema/content";
import { saveSiteSettingsAction } from "@/lib/actions/settings";
import { slugify } from "@/lib/utils/slug";

const THEME_PRESETS = [
  {
    name: "GZV Logo",
    primary: "#005ba8",
    accent: "#ed1c24",
    surface: "#f3f7fb",
    ink: "#13263a",
    muted: "#64748b",
    line: "#d8e3ee",
  },
  {
    name: "GZV Deep",
    primary: "#004b91",
    accent: "#e31b23",
    surface: "#eef5fb",
    ink: "#0f2238",
    muted: "#5b6f86",
    line: "#cddceb",
  },
  {
    name: "Executive",
    primary: "#0f3d66",
    accent: "#d71920",
    surface: "#f6f8fb",
    ink: "#162235",
    muted: "#647083",
    line: "#dce3ec",
  },
];

function applyThemePreset(setForm: React.Dispatch<React.SetStateAction<SettingsInput>>, preset: (typeof THEME_PRESETS)[number]) {
  setForm((f) => ({
    ...f,
    themeColor: preset.primary,
    themeAccentColor: preset.accent,
    themeSurfaceColor: preset.surface,
    themeInkColor: preset.ink,
    themeMutedColor: preset.muted,
    themeLineColor: preset.line,
  }));
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-line bg-transparent p-1"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono" />
      </div>
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SettingsInput }) {
  const [form, setForm] = useState<SettingsInput>({
    ...settings,
    footerDescription: settings.footerDescription || settings.footerText,
  });
  const [saving, startSaving] = useTransition();

  function handleSave() {
    startSaving(async () => {
      try {
        await saveSiteSettingsAction({
          ...form,
          footerText: form.footerDescription || form.footerText,
        });
        toast.success("Đã lưu cài đặt.");
      } catch {
        toast.error("Lưu thất bại.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-line/70 bg-white shadow-sm">
          <CardHeader className="border-b border-line/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe2 className="h-5 w-5 text-brand-dark" />
              Thương hiệu website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Tên website</Label>
                <Input value={form.siteName} onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tagline</Label>
                <Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ImageField aspect={1} label="Logo header" value={form.logoUrl} onChange={(logoUrl) => setForm((f) => ({ ...f, logoUrl }))} />
              <ImageField aspect={1} label="Favicon tab" value={form.faviconUrl} onChange={(faviconUrl) => setForm((f) => ({ ...f, faviconUrl }))} />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-line/70 bg-surface/70 p-4">
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

      <Card className="overflow-hidden border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60 bg-gradient-to-r from-brand/5 via-white to-red-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe2 className="h-5 w-5 text-brand-dark" />
            Domain & SEO kỹ thuật
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-1.5">
              <Label>Domain chính / canonical URL</Label>
              <Input
                value={form.siteUrl}
                onChange={(e) => setForm((f) => ({ ...f, siteUrl: e.target.value }))}
                placeholder="https://marketing.gzv.one"
              />
              <p className="text-sm text-ink-muted">
                Domain này sẽ được dùng cho canonical, Open Graph, Twitter card, sitemap và robots.
              </p>
            </div>
            <div className="rounded-lg border border-line/70 bg-surface/70 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark">DNS hiện đang kiểm tra</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="grid grid-cols-[84px_1fr] gap-2">
                  <span className="font-semibold text-ink">Type</span>
                  <span className="font-mono text-ink-muted">CNAME</span>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-2">
                  <span className="font-semibold text-ink">Host</span>
                  <span className="font-mono text-ink-muted">marketing</span>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-2">
                  <span className="font-semibold text-ink">Value</span>
                  <span className="break-all font-mono text-ink-muted">gzvmarketing.web.app</span>
                </div>
              </div>
            </div>
          </div>

          <DomainLiveCheck siteUrl={form.siteUrl} />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-bold text-emerald-800">DNS đã trỏ</div>
              <p className="mt-1 text-sm text-emerald-700">
                <code className="font-mono">marketing.gzv.one</code> đang resolve về Firebase.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm font-bold text-amber-800">SSL cần xác minh</div>
              <p className="mt-1 text-sm text-amber-700">HTTPS còn lỗi chứng chỉ nếu Firebase chưa cấp xong cert.</p>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <div className="text-sm font-bold text-sky-800">SEO sẵn sàng</div>
              <p className="mt-1 text-sm text-sky-700">Sitemap, robots, canonical sẽ đi theo domain chính sau khi lưu.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-brand-dark" />
            Theme màu theo logo GZV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {THEME_PRESETS.map((preset) => {
              const active =
                form.themeColor.toLowerCase() === preset.primary.toLowerCase() &&
                form.themeAccentColor.toLowerCase() === preset.accent.toLowerCase();
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyThemePreset(setForm, preset)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    active ? "border-brand bg-brand/5 shadow-sm" : "border-line/70 bg-white hover:border-brand/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{preset.name}</span>
                    {active && <Check className="h-4 w-4 text-brand-dark" />}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {[preset.primary, preset.accent, preset.surface, preset.ink].map((color) => (
                      <span key={color} className="h-7 w-7 rounded-full border border-line" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ColorInput label="Màu chính" value={form.themeColor} onChange={(themeColor) => setForm((f) => ({ ...f, themeColor }))} />
            <ColorInput
              label="Màu nhấn / đỏ logo"
              value={form.themeAccentColor}
              onChange={(themeAccentColor) => setForm((f) => ({ ...f, themeAccentColor }))}
            />
            <ColorInput
              label="Màu nền nhẹ"
              value={form.themeSurfaceColor}
              onChange={(themeSurfaceColor) => setForm((f) => ({ ...f, themeSurfaceColor }))}
            />
            <ColorInput label="Màu chữ chính" value={form.themeInkColor} onChange={(themeInkColor) => setForm((f) => ({ ...f, themeInkColor }))} />
            <ColorInput
              label="Màu chữ phụ"
              value={form.themeMutedColor}
              onChange={(themeMutedColor) => setForm((f) => ({ ...f, themeMutedColor }))}
            />
            <ColorInput
              label="Màu đường viền"
              value={form.themeLineColor}
              onChange={(themeLineColor) => setForm((f) => ({ ...f, themeLineColor }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
            <div className="space-y-1.5">
              <Label>Bo góc giao diện: {form.themeRadius}px</Label>
              <input
                type="range"
                min={4}
                max={24}
                value={form.themeRadius}
                onChange={(e) => setForm((f) => ({ ...f, themeRadius: Number(e.target.value) }))}
                className="w-full accent-brand"
              />
            </div>
            <div
              className="overflow-hidden rounded-lg border p-4"
              style={{
                backgroundColor: form.themeSurfaceColor,
                borderColor: form.themeLineColor,
                color: form.themeInkColor,
                borderRadius: form.themeRadius,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: form.themeColor }}>
                    Preview
                  </div>
                  <div className="mt-1 text-lg font-extrabold">Giao diện theo nhận diện GZV</div>
                  <p className="mt-1 text-sm" style={{ color: form.themeMutedColor }}>
                    Xanh chủ đạo, đỏ làm điểm nhấn, nền sáng và viền sạch.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="h-10 w-10 rounded-lg" style={{ backgroundColor: form.themeColor }} />
                  <span className="h-10 w-10 rounded-lg" style={{ backgroundColor: form.themeAccentColor }} />
                </div>
              </div>
            </div>
          </div>
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
            emptyLabel="Chưa có mục menu nào."
            renderItem={(item, update) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            emptyLabel="Chưa có danh mục nào."
            renderItem={(item, update) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <PanelBottom className="h-5 w-5 text-brand-dark" />
              Chân trang chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <ImageField
              aspect={2}
              label="Logo footer"
              value={form.footerLogoUrl}
              onChange={(footerLogoUrl) => setForm((f) => ({ ...f, footerLogoUrl }))}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Tiêu đề footer</Label>
                <Input
                  value={form.footerHeadline}
                  onChange={(e) => setForm((f) => ({ ...f, footerHeadline: e.target.value }))}
                  placeholder="Đối tác marketing tin cậy"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Copyright</Label>
                <Input
                  value={form.footerCopyright}
                  onChange={(e) => setForm((f) => ({ ...f, footerCopyright: e.target.value }))}
                  placeholder="© 2026 GZV Ltd. All rights reserved."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Mô tả footer</Label>
              <Textarea
                rows={4}
                value={form.footerDescription}
                onChange={(e) => setForm((f) => ({ ...f, footerDescription: e.target.value }))}
                placeholder="Mô tả ngắn hiển thị ở chân trang"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nút CTA</Label>
                <Input
                  value={form.footerCtaText}
                  onChange={(e) => setForm((f) => ({ ...f, footerCtaText: e.target.value }))}
                  placeholder="Nhận tư vấn"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Link CTA</Label>
                <Input value={form.footerCtaHref} onChange={(e) => setForm((f) => ({ ...f, footerCtaHref: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-line/70 bg-surface/70 p-4">
              <div>
                <div className="font-medium text-ink">Hiện link quản trị ở footer</div>
                <div className="text-sm text-ink-muted">Có thể tắt nếu muốn chân trang gọn hơn.</div>
              </div>
              <Switch checked={form.showAdminLink} onCheckedChange={(showAdminLink) => setForm((f) => ({ ...f, showAdminLink }))} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60">
          <CardTitle className="flex items-center gap-2 text-lg">
            {form.showAdminLink ? <Eye className="h-5 w-5 text-brand-dark" /> : <EyeOff className="h-5 w-5 text-brand-dark" />}
            Menu trong footer
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
          <div className="space-y-3">
            <Label>Liên kết nhanh</Label>
            <ListEditor
              items={form.footerQuickLinks}
              onChange={(footerQuickLinks) => setForm((f) => ({ ...f, footerQuickLinks }))}
              newItem={() => ({ label: "Liên kết mới", href: "/" })}
              addLabel="Thêm liên kết"
              emptyLabel="Chưa có liên kết nhanh."
              renderItem={(item, update) => (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input placeholder="Nhãn" value={item.label} onChange={(e) => update({ label: e.target.value })} />
                  <Input placeholder="Đường dẫn" value={item.href} onChange={(e) => update({ href: e.target.value })} />
                </div>
              )}
            />
          </div>
          <div className="space-y-3">
            <Label>Dịch vụ / chuyên mục</Label>
            <ListEditor
              items={form.footerServiceLinks}
              onChange={(footerServiceLinks) => setForm((f) => ({ ...f, footerServiceLinks }))}
              newItem={() => ({ label: "Dịch vụ mới", href: "/du-an" })}
              addLabel="Thêm dịch vụ"
              emptyLabel="Chưa có dịch vụ nào."
              renderItem={(item, update) => (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input placeholder="Nhãn" value={item.label} onChange={(e) => update({ label: e.target.value })} />
                  <Input placeholder="Đường dẫn" value={item.href} onChange={(e) => update({ href: e.target.value })} />
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-line/70 bg-white shadow-sm">
        <CardHeader className="border-b border-line/60">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Loader2 className="h-5 w-5 text-brand-dark" />
            Màn hình tải trang
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-line/70 bg-surface/70 p-4">
            <div>
              <div className="font-medium text-ink">Bật màn hình tải trang</div>
              <div className="text-sm text-ink-muted">
                Hiện logo + chữ + hiệu ứng trong lúc trang đang tải, trước khi nội dung hiện ra.
              </div>
            </div>
            <Switch
              checked={form.loadingScreenEnabled}
              onCheckedChange={(loadingScreenEnabled) => setForm((f) => ({ ...f, loadingScreenEnabled }))}
            />
          </div>

          {form.loadingScreenEnabled && (
            <>
              <ImageField
                aspect={1}
                label="Logo hiển thị lúc tải (để trống dùng logo header)"
                value={form.loadingScreenLogoUrl}
                onChange={(loadingScreenLogoUrl) => setForm((f) => ({ ...f, loadingScreenLogoUrl }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Chữ hiển thị</Label>
                  <Input
                    placeholder="Đang tải..."
                    value={form.loadingScreenText}
                    onChange={(e) => setForm((f) => ({ ...f, loadingScreenText: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Hiệu ứng</Label>
                  <Select
                    value={form.loadingScreenEffect}
                    onValueChange={(effect) => effect && setForm((f) => ({ ...f, loadingScreenEffect: effect as SettingsInput["loadingScreenEffect"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spinner">Vòng xoay</SelectItem>
                      <SelectItem value="pulse">Chấm nhấp nháy</SelectItem>
                      <SelectItem value="bar">Thanh chạy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-brand px-6 shadow-lg shadow-brand/25 hover:bg-brand-dark">
          <Save className="mr-1 h-4 w-4" />
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </div>
    </div>
  );
}

type DomainCheckResult = {
  hostname: string;
  dnsReady: boolean;
  httpsReady: boolean;
  diagnosis: string;
  records: {
    cname: string[];
    a: string[];
    aaaa: string[];
  };
  http: { status?: number; location?: string | null; server?: string | null; error?: string };
  https: { status?: number; location?: string | null; server?: string | null; error?: string };
  checkedAt: string;
};

function DomainLiveCheck({ siteUrl }: { siteUrl: string }) {
  const [checking, startChecking] = useTransition();
  const [result, setResult] = useState<DomainCheckResult | null>(null);

  function check() {
    startChecking(async () => {
      const res = await fetch(`/api/domain-check?url=${encodeURIComponent(siteUrl || "https://marketing.gzv.one")}`, {
        cache: "no-store",
      });
      setResult(await res.json());
    });
  }

  return (
    <div className="rounded-lg border border-line/70 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-bold text-ink">Kiểm tra live domain</div>
          <p className="mt-1 text-sm text-ink-muted">Chạy DNS, HTTP và HTTPS ngay từ server local.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={check} disabled={checking}>
          {checking ? "Đang kiểm tra..." : "Kiểm tra ngay"}
        </Button>
      </div>

      {result && (
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[220px_1fr]">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md bg-surface px-3 py-2">
              <span className="font-semibold text-ink">DNS</span>
              <span className={result.dnsReady ? "font-bold text-emerald-700" : "font-bold text-amber-700"}>
                {result.dnsReady ? "Đã trỏ" : "Chưa thấy"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-surface px-3 py-2">
              <span className="font-semibold text-ink">HTTPS</span>
              <span className={result.httpsReady ? "font-bold text-emerald-700" : "font-bold text-amber-700"}>
                {result.https.status ? result.https.status : "Lỗi"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-surface px-3 py-2">
              <span className="font-semibold text-ink">HTTP</span>
              <span className="font-bold text-ink-muted">{result.http.status ? result.http.status : "Lỗi"}</span>
            </div>
          </div>
          <div className="rounded-md bg-surface p-3 text-sm">
            <p className="font-medium text-ink">{result.diagnosis}</p>
            <div className="mt-3 space-y-1 font-mono text-xs text-ink-muted">
              {result.records.cname.length > 0 && <div>CNAME: {result.records.cname.join(", ")}</div>}
              {result.records.a.length > 0 && <div>A: {result.records.a.join(", ")}</div>}
              {result.records.aaaa.length > 0 && <div>AAAA: {result.records.aaaa.join(", ")}</div>}
              {result.https.error && <div>HTTPS error: {result.https.error}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
