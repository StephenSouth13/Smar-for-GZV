import { darken } from "@/lib/theme-color";
import type { SettingsInput } from "@/lib/schema/content";

export function ThemeVars({ settings }: { settings: SettingsInput }) {
  void settings;

  const brand = "#ed1c24";
  const brandDark = darken(brand, 0.18);
  const accent = "#ff3131";
  const radius = 8;

  const css = `
    :root {
      --brand: ${brand};
      --brand-dark: ${brandDark};
      --brand-accent: ${accent};
      --surface: #f6f6f7;
      --ink: #161616;
      --ink-muted: #666a73;
      --line: #dedfe3;
      --background: #ffffff;
      --foreground: #161616;
      --card: #ffffff;
      --card-foreground: #161616;
      --popover: #ffffff;
      --popover-foreground: #161616;
      --primary: ${brand};
      --ring: ${brand};
      --secondary: #f2f2f3;
      --secondary-foreground: #161616;
      --muted: #f2f2f3;
      --muted-foreground: #666a73;
      --accent: #f2f2f3;
      --accent-foreground: #161616;
      --border: #dedfe3;
      --input: #dedfe3;
      --radius: ${radius / 16}rem;
    }
    .dark {
      --surface: #111111;
      --ink: #f8fafc;
      --ink-muted: #a7adb7;
      --line: #2a2a2a;
      --background: #050505;
      --foreground: #f8fafc;
      --card: #111111;
      --card-foreground: #f8fafc;
      --popover: #111111;
      --popover-foreground: #f8fafc;
      --secondary: #181818;
      --secondary-foreground: #f8fafc;
      --muted: #181818;
      --muted-foreground: #a7adb7;
      --accent: #181818;
      --accent-foreground: #f8fafc;
      --border: #2a2a2a;
      --input: #2a2a2a;
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
