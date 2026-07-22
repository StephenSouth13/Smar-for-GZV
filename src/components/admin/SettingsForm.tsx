"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { ListEditor } from "@/components/admin/section-editors/fields";
import type { SettingsInput } from "@/lib/schema/content";
import { saveSiteSettingsAction } from "@/lib/actions/settings";

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
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tên website</Label>
              <Input value={form.siteName} onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Khẩu hiệu (tagline)</Label>
              <Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
            </div>
          </div>
          <ImageField label="Logo" value={form.logoUrl} onChange={(logoUrl) => setForm((f) => ({ ...f, logoUrl }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label>Link Zalo (zalo.me/...)</Label>
            <Input value={form.socialZalo} onChange={(e) => setForm((f) => ({ ...f, socialZalo: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu điều hướng</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor
            items={form.headerMenu}
            onChange={(headerMenu) => setForm((f) => ({ ...f, headerMenu }))}
            newItem={() => ({ label: "Trang mới", href: "/" })}
            addLabel="Thêm mục menu"
            renderItem={(item, update) => (
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Nhãn hiển thị" value={item.label} onChange={(e) => update({ label: e.target.value })} />
                <Input placeholder="Đường dẫn" value={item.href} onChange={(e) => update({ href: e.target.value })} />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chân trang</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            value={form.footerText}
            onChange={(e) => setForm((f) => ({ ...f, footerText: e.target.value }))}
            placeholder="Mô tả ngắn hiển thị ở chân trang"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-brand hover:bg-brand-dark">
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </div>
    </div>
  );
}
