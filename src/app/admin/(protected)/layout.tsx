import { requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();
  return <AdminShell profile={profile}>{children}</AdminShell>;
}
