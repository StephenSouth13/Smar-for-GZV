import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { FloatingContact } from "@/components/public/FloatingContact";
import { ThemeVars } from "@/components/ThemeVars";
import { getSiteSettings } from "@/lib/data/settings";

// Content is CMS-managed via Firestore (Admin SDK), which needs live
// credentials at request time and can change at any moment — so these routes
// must never be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <ThemeVars color={settings.themeColor} />
      {settings.showHeader && <Header settings={settings} />}
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingContact settings={settings} />
    </div>
  );
}
