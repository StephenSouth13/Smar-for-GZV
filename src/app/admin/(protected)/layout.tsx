import { requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { countUnreadLeadsAction } from "@/lib/actions/leads";
import { ThemeVars } from "@/components/ThemeVars";
import { getSiteSettings } from "@/lib/data/settings";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const [profile, unreadLeads, settings] = await Promise.all([
    requireAdmin(),
    countUnreadLeadsAction(),
    getSiteSettings(),
  ]);
  return (
    <>
      <ThemeVars settings={settings} />
      <AdminShell profile={profile} unreadLeads={unreadLeads}>
        {children}
      </AdminShell>
    </>
  );
}
