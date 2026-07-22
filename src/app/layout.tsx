import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    ...buildMetadata({}, settings),
    title: {
      default: settings.seoTitle || settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
