"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, PhoneCall, X } from "lucide-react";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { cld } from "@/lib/image-url";
import type { SettingsInput } from "@/lib/schema/content";

export function Header({ settings }: { settings: SettingsInput }) {
  const [open, setOpen] = useState(false);
  const menu = settings.headerMenu.length > 0 ? settings.headerMenu : DEFAULT_MENU;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 text-foreground backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between sm:h-18">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {settings.logoUrl ? (
            <Image
              src={cld(settings.logoUrl, { width: 96, height: 96, crop: "fit" })}
              alt={settings.siteName}
              width={48}
              height={48}
              className="h-10 w-10 object-contain"
              unoptimized
            />
          ) : (
            <Image src="/gzv-logo.png" alt={settings.siteName} width={110} height={55} className="h-11 w-auto object-contain" unoptimized />
          )}
          <div className="hidden leading-tight sm:block">
            <div className="font-bold text-ink">{settings.siteName}</div>
            <div className="hidden text-[11px] text-ink-muted sm:block">{settings.tagline}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-ink-muted transition-colors hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            <PhoneCall className="h-4 w-4" />
            Liên hệ GZV
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button className="flex h-10 w-10 items-center justify-center rounded-md text-ink" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-ink-muted hover:bg-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/lien-he"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-bold text-white"
            >
              <PhoneCall className="h-4 w-4" />
              Liên hệ GZV
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
  { label: "Dịch vụ", href: "/gioi-thieu" },
  { label: "Dự án", href: "/du-an" },
  { label: "GZVers", href: "/gioi-thieu" },
  { label: "Tin tức", href: "/chia-se" },
  { label: "Liên hệ", href: "/lien-he" },
];
