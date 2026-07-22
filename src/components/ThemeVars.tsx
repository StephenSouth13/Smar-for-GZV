import { darken } from "@/lib/theme-color";

export function ThemeVars({ color }: { color: string }) {
  const dark = darken(color);
  return (
    <style dangerouslySetInnerHTML={{ __html: `:root{--brand:${color};--brand-dark:${dark};}` }} />
  );
}
