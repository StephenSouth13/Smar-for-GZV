import type { Metadata } from "next";
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Container } from "@/components/public/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { getSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với GZV để được tư vấn giải pháp Marketing, Sales và Digital Transformation phù hợp.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-black">
      <div className="border-b border-white/10 py-16">
        <Container className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">Liên hệ GZV</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">{settings.contactPageHeading}</h1>
          {settings.contactPageSubheading && (
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/66">{settings.contactPageSubheading}</p>
          )}
        </Container>
      </div>
      <div className="py-10">
        <Container className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          <div className="rounded-md border border-white/10 bg-[#111111] p-6">
            <Mail className="mx-auto h-6 w-6 text-brand-accent" />
            <div className="mt-3 font-semibold text-white">Email</div>
            <div className="mt-1 text-sm text-white/58">{settings.contactEmail || "Đang cập nhật"}</div>
          </div>
          <div className="rounded-md border border-white/10 bg-[#111111] p-6">
            <Phone className="mx-auto h-6 w-6 text-brand-accent" />
            <div className="mt-3 font-semibold text-white">Điện thoại</div>
            <div className="mt-1 text-sm text-white/58">{settings.contactPhone || "Đang cập nhật"}</div>
          </div>
          <div className="rounded-md border border-white/10 bg-[#111111] p-6">
            <MapPin className="mx-auto h-6 w-6 text-brand-accent" />
            <div className="mt-3 font-semibold text-white">Địa chỉ</div>
            <div className="mt-1 text-sm text-white/58">{settings.address || "Đang cập nhật"}</div>
          </div>
        </Container>
      </div>
      {settings.contactMapEmbedUrl && (
        <div className="pb-10">
          <Container>
            <div className="overflow-hidden rounded-md border border-white/10 shadow-sm">
              <iframe
                src={settings.contactMapEmbedUrl}
                className="h-90 w-full sm:h-105"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí GZV"
              />
            </div>
            {settings.contactMapLink && (
              <a
                href={settings.contactMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:text-white"
              >
                <Navigation className="h-4 w-4" />
                Xem chỉ đường trên Google Maps
              </a>
            )}
          </Container>
        </div>
      )}
      <ContactForm
        data={{
          heading: settings.contactFormHeading,
          subheading: settings.contactFormSubheading,
          submitEmail: settings.contactEmail,
          customFields: [],
        }}
      />
    </div>
  );
}
