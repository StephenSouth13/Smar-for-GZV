import { Phone, MessageCircle } from "lucide-react";
import type { SettingsInput } from "@/lib/schema/content";

export function FloatingContact({ settings }: { settings: SettingsInput }) {
  const zalo = settings.socialLinks.find((s) => s.platform === "zalo" && s.url)?.url;
  if (!settings.contactPhone && !zalo) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {settings.contactPhone && (
        <a
          href={`tel:${settings.contactPhone}`}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 hover:scale-105 transition-transform animate-pulse"
          style={{ height: 52, width: 52 }}
          aria-label="Gọi điện"
        >
          <Phone className="h-5 w-5" />
        </a>
      )}
      {zalo && (
        <a
          href={zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full bg-[#0068ff] text-white shadow-lg hover:scale-105 transition-transform"
          style={{ height: 52, width: 52 }}
          aria-label="Chat Zalo"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
