import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
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
      <div className="py-16">
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
      <ContactForm
        data={{
          heading: "Yêu cầu tư vấn",
          subheading: "Để lại thông tin, đội ngũ GZV sẽ liên hệ tư vấn trong thời gian sớm nhất.",
          submitEmail: settings.contactEmail,
        }}
      />
    </div>
  );
}
