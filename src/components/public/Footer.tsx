import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "./Container";
import { cld } from "@/lib/image-url";
import { SOCIAL_META } from "@/lib/social-icons";
import type { SettingsInput } from "@/lib/schema/content";

const DEFAULT_QUICK_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Dự án", href: "/du-an" },
  { label: "Chia sẻ", href: "/chia-se" },
  { label: "Liên hệ", href: "/lien-he" },
];

const DEFAULT_SERVICE_LINKS = [
  { label: "Dự án nổi bật", href: "/du-an" },
  { label: "Dự án Nhân hiệu", href: "/du-an?category=du-an-nhan-hieu" },
  { label: "Dự án Phẩm hiệu", href: "/du-an?category=du-an-pham-hieu" },
];

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white">{title}</div>
      <div className="space-y-2.5">
        {links.map((item) => (
          <Link key={`${item.label}-${item.href}`} href={item.href} className="block text-sm text-white/70 transition-colors hover:text-white">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Footer({ settings }: { settings: SettingsInput }) {
  const year = new Date().getFullYear();
  const quickLinks = settings.footerQuickLinks.length > 0 ? settings.footerQuickLinks : settings.headerMenu.length > 0 ? settings.headerMenu : DEFAULT_QUICK_LINKS;
  const serviceLinks = settings.footerServiceLinks.length > 0 ? settings.footerServiceLinks : DEFAULT_SERVICE_LINKS;
  const footerLogo = settings.footerLogoUrl || settings.logoUrl;
  const description =
    settings.footerDescription ||
    settings.footerText ||
    "GZV đồng hành cùng doanh nghiệp xây dựng thương hiệu, nội dung và hiệu quả tăng trưởng bền vững.";
  const copyright = settings.footerCopyright || `© ${year} ${settings.siteName}. All rights reserved.`;

  return (
    <footer className="bg-[#07182a] text-white/75">
      {(settings.footerHeadline || settings.footerCtaText) && (
        <div className="border-b border-white/10">
          <Container className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-extrabold text-white md:text-2xl">{settings.footerHeadline || "Sẵn sàng nâng cấp thương hiệu?"}</div>
              <p className="mt-1 max-w-2xl text-sm text-white/65">{settings.tagline}</p>
            </div>
            {settings.footerCtaText && (
              <Link
                href={settings.footerCtaHref || "/lien-he"}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark"
              >
                {settings.footerCtaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Container>
        </div>
      )}

      <Container className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            {footerLogo ? (
              <Image
                src={cld(footerLogo, { width: 220, height: 110, crop: "fit" })}
                alt={settings.siteName}
                width={160}
                height={80}
                className="h-14 w-auto rounded-md bg-white object-contain p-2"
                unoptimized
              />
            ) : (
              <Image src="/gzv-logo.png" alt={settings.siteName} width={160} height={80} className="h-14 w-auto rounded-md bg-white object-contain p-2" unoptimized />
            )}
          </Link>
          <div className="mt-5 text-lg font-extrabold text-white">{settings.siteName}</div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/68">{description}</p>
        </div>

        <FooterLinks title="Liên kết" links={quickLinks} />
        <FooterLinks title="Dịch vụ" links={serviceLinks} />

        <div>
          <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white">Liên hệ</div>
          <div className="space-y-3 text-sm">
            {settings.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                {settings.contactEmail}
              </a>
            )}
            {settings.contactPhone && (
              <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                {settings.contactPhone}
              </a>
            )}
            {settings.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{settings.address}</span>
              </div>
            )}
          </div>
          {settings.socialLinks.filter((s) => s.url).length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {settings.socialLinks
                .filter((s) => s.url)
                .map((s) => {
                  const meta = SOCIAL_META[s.platform];
                  const Icon = meta.icon;
                  return (
                    <a
                      key={s.platform + s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={meta.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand"
                    >
                      <Icon />
                    </a>
                  );
                })}
            </div>
          )}
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <span>{copyright}</span>
          {settings.showAdminLink && (
            <Link href="/admin/login" className="transition-colors hover:text-white/80">
              Quản trị
            </Link>
          )}
        </Container>
      </div>
    </footer>
  );
}
