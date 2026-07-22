import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "./Container";
import type { SettingsInput } from "@/lib/schema/content";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M21.582 7.186a2.51 2.51 0 0 0-1.768-1.775C18.254 5 12 5 12 5s-6.254 0-7.814.411A2.51 2.51 0 0 0 2.418 7.186 26.18 26.18 0 0 0 2 12a26.18 26.18 0 0 0 .418 4.814 2.51 2.51 0 0 0 1.768 1.775C5.746 19 12 19 12 19s6.254 0 7.814-.411a2.51 2.51 0 0 0 1.768-1.775A26.18 26.18 0 0 0 22 12a26.18 26.18 0 0 0-.418-4.814ZM10 15V9l5.2 3Z" />
    </svg>
  );
}

export function Footer({ settings }: { settings: SettingsInput }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/80">
      <Container className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <div className="text-lg font-bold text-white">{settings.siteName}</div>
          <p className="mt-1 text-sm">{settings.tagline}</p>
          {settings.footerText && <p className="mt-4 text-sm leading-relaxed">{settings.footerText}</p>}
        </div>

        <div className="space-y-2.5 text-sm">
          {settings.contactEmail && (
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-brand shrink-0" />
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                {settings.contactEmail}
              </a>
            </div>
          )}
          {settings.contactPhone && (
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand shrink-0" />
              <a href={`tel:${settings.contactPhone}`} className="hover:text-white">
                {settings.contactPhone}
              </a>
            </div>
          )}
          {settings.address && (
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-semibold text-white mb-3">Kết nối với chúng tôi</div>
          <div className="flex items-center gap-3">
            {settings.socialFacebook && (
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-brand transition-colors"
              >
                <FacebookIcon />
              </a>
            )}
            {settings.socialYoutube && (
              <a
                href={settings.socialYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-brand transition-colors"
              >
                <YoutubeIcon />
              </a>
            )}
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5">
        <Container className="text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {year} {settings.siteName}. All rights reserved.
          </span>
          <Link href="/admin/login" className="hover:text-white/70">
            Quản trị
          </Link>
        </Container>
      </div>
    </footer>
  );
}
