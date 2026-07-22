"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, PhoneCall } from "lucide-react";
import { Container } from "./Container";
import { cld } from "@/lib/image-url";
import type { SettingsInput } from "@/lib/schema/content";

export function Header({ settings }: { settings: SettingsInput }) {
  const [open, setOpen] = useState(false);
  const menu = settings.headerMenu.length > 0 ? settings.headerMenu : DEFAULT_MENU;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/95 backdrop-blur">
      <Container className="flex h-16 sm:h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {settings.logoUrl ? (
            <Image
              src={cld(settings.logoUrl, { width: 80, height: 80, crop: "fit" })}
              alt={settings.siteName}
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
              unoptimized
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white font-bold">
              {settings.siteName?.[0] ?? "G"}
            </div>
          )}
          <div className="leading-tight">
            <div className="font-bold text-ink">{settings.siteName}</div>
            <div className="text-[11px] text-ink-muted hidden sm:block">{settings.tagline}</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-ink hover:text-brand-dark transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
          >
            <PhoneCall className="h-4 w-4" />
            Yêu cầu tư vấn
          </Link>
        </div>

        <button className="lg:hidden text-ink" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="lg:hidden border-t border-line/70 bg-white">
          <Container className="flex flex-col gap-1 py-3">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/lien-he"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              <PhoneCall className="h-4 w-4" />
              Yêu cầu tư vấn
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}

const DEFAULT_MENU = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Dự án", href: "/du-an" },
  { label: "Chia sẻ", href: "/chia-se" },
  { label: "Liên hệ", href: "/lien-he" },
];
