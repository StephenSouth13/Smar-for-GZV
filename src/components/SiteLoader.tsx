"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cld } from "@/lib/image-url";
import type { SettingsInput } from "@/lib/schema/content";

export function SiteLoader({ settings }: { settings: SettingsInput }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const MIN_DISPLAY_MS = 500;
    const start = Date.now();

    function finish() {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => setHidden(true), remaining);
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  if (hidden) return null;

  const logoUrl = settings.loadingScreenLogoUrl || settings.logoUrl;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-white transition-opacity duration-300"
      aria-hidden
    >
      {logoUrl ? (
        <Image
          src={cld(logoUrl, { width: 160, height: 160, crop: "fit" })}
          alt={settings.siteName}
          width={80}
          height={80}
          className="h-16 w-16 object-contain sm:h-20 sm:w-20"
          unoptimized
          priority
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-2xl font-extrabold text-white sm:h-20 sm:w-20">
          {settings.siteName?.[0] ?? "G"}
        </div>
      )}

      <LoadingEffect effect={settings.loadingScreenEffect} />

      {settings.loadingScreenText && (
        <p className="text-sm font-medium text-ink-muted">{settings.loadingScreenText}</p>
      )}
    </div>
  );
}

function LoadingEffect({ effect }: { effect: SettingsInput["loadingScreenEffect"] }) {
  if (effect === "bar") {
    return (
      <div className="h-1 w-40 overflow-hidden rounded-full bg-line/60">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-brand" />
      </div>
    );
  }

  if (effect === "pulse") {
    return (
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  return <div className="h-8 w-8 animate-spin rounded-full border-3 border-line border-t-brand" />;
}
