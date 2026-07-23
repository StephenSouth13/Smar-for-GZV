import { Globe2 } from "lucide-react";
import type { ComponentType } from "react";
import type { SocialLink } from "@/lib/schema/content";

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

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16.6 5.82c-.88-.9-1.36-2.07-1.36-3.32h-3.05v13.6a2.75 2.75 0 1 1-2.28-2.71v-3.1a5.8 5.8 0 1 0 5.33 5.78V9.4a6.9 6.9 0 0 0 4.02 1.28V7.63a4.6 4.6 0 0 1-2.66-1.81Z" />
    </svg>
  );
}

function ZaloIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.76 1.47 5.22 3.77 6.83-.17.66-.62 2.24-.72 2.6-.11.44.16.44.34.32.14-.1 2.24-1.52 3.15-2.14.79.15 1.6.24 2.46.24 5.52 0 10-3.94 10-8.85S17.52 2 12 2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.82v2.05h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V23h-4v-7.87c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.16V23H8V8Z" />
    </svg>
  );
}

export const SOCIAL_META: Record<
  SocialLink["platform"],
  { label: string; icon: ComponentType; placeholder: string }
> = {
  facebook: { label: "Facebook", icon: FacebookIcon, placeholder: "https://facebook.com/ten-trang" },
  zalo: { label: "Zalo", icon: ZaloIcon, placeholder: "https://zalo.me/so-dien-thoai" },
  youtube: { label: "YouTube", icon: YoutubeIcon, placeholder: "https://youtube.com/@kenh" },
  tiktok: { label: "TikTok", icon: TiktokIcon, placeholder: "https://tiktok.com/@ten" },
  instagram: { label: "Instagram", icon: InstagramIcon, placeholder: "https://instagram.com/ten" },
  linkedin: { label: "LinkedIn", icon: LinkedinIcon, placeholder: "https://linkedin.com/company/ten" },
  website: { label: "Website / Khác", icon: Globe2, placeholder: "https://..." },
};
