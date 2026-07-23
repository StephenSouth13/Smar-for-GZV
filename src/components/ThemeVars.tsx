import { darken, isHexColor } from "@/lib/theme-color";
import type { SettingsInput } from "@/lib/schema/content";

function safeColor(value: string, fallback: string) {
  return isHexColor(value) ? value : fallback;
}

export function ThemeVars({ settings }: { settings: SettingsInput }) {
  const brand = safeColor(settings.themeColor, "#005ba8");
  const brandDark = darken(brand, 0.18);
  const accent = safeColor(settings.themeAccentColor, "#ed1c24");
  const surface = safeColor(settings.themeSurfaceColor, "#f3f7fb");
  const ink = safeColor(settings.themeInkColor, "#13263a");
  const muted = safeColor(settings.themeMutedColor, "#64748b");
  const line = safeColor(settings.themeLineColor, "#d8e3ee");
  const radius = Math.max(4, Math.min(24, settings.themeRadius || 10));

  const css = `
    :root {
      --brand: ${brand};
      --brand-dark: ${brandDark};
      --brand-accent: ${accent};
      --surface: ${surface};
      --ink: ${ink};
      --ink-muted: ${muted};
      --line: ${line};
      --primary: ${brand};
      --ring: ${brand};
      --accent: ${surface};
      --accent-foreground: ${ink};
      --border: ${line};
      --input: ${line};
      --radius: ${radius / 16}rem;
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
