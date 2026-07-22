import { getSiteSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Cài đặt chung</h1>
        <p className="text-ink-muted mt-1">Logo, thông tin liên hệ, menu và chân trang áp dụng cho toàn bộ website.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
