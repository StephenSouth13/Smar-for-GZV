import type { Metadata } from "next";
import { Mail, Phone, MapPin, Navigation } from "lucide-react";
import { Container } from "@/components/public/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { getSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với GZV để được tư vấn giải pháp marketing phù hợp.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="pt-16">
        <Container className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{settings.contactPageHeading}</h1>
          {settings.contactPageSubheading && (
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-ink-muted">{settings.contactPageSubheading}</p>
          )}
        </Container>
      </div>
      <div className="py-10">
        <Container className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="rounded-2xl border border-line/70 p-6">
            <Mail className="h-6 w-6 text-brand mx-auto" />
            <div className="mt-3 font-semibold text-ink">Email</div>
            <div className="mt-1 text-sm text-ink-muted">{settings.contactEmail || "Đang cập nhật"}</div>
          </div>
          <div className="rounded-2xl border border-line/70 p-6">
            <Phone className="h-6 w-6 text-brand mx-auto" />
            <div className="mt-3 font-semibold text-ink">Điện thoại</div>
            <div className="mt-1 text-sm text-ink-muted">{settings.contactPhone || "Đang cập nhật"}</div>
          </div>
          <div className="rounded-2xl border border-line/70 p-6">
            <MapPin className="h-6 w-6 text-brand mx-auto" />
            <div className="mt-3 font-semibold text-ink">Địa chỉ</div>
            <div className="mt-1 text-sm text-ink-muted">{settings.address || "Đang cập nhật"}</div>
          </div>
        </Container>
      </div>
      {settings.contactMapEmbedUrl && (
        <div className="pb-10">
          <Container>
            <div className="overflow-hidden rounded-2xl border border-line/70 shadow-sm">
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
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:underline"
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
