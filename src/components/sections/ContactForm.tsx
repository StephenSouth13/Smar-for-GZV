"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle2, Send, MessageSquareText, ShieldCheck, Clock3 } from "lucide-react";
import { Container } from "@/components/public/Container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { submitLeadAction, type LeadFormState } from "@/lib/actions/leads";
import type { SectionDataMap } from "@/lib/schema/sections";

const PROJECT_TYPES = ["Content", "Design", "Media", "Performance", "Website"];

const TRUST_POINTS = [
  { icon: Clock3, label: "Phản hồi trong 24h" },
  { icon: ShieldCheck, label: "Thông tin được bảo mật" },
  { icon: MessageSquareText, label: "Tư vấn miễn phí" },
];

const initialState: LeadFormState = { ok: false, message: "" };

function CustomField({
  field,
  value,
  onChange,
}: {
  field: SectionDataMap["contactForm"]["customFields"][number];
  value: string;
  onChange: (v: string) => void;
}) {
  const options = useMemo(
    () => field.options.split(",").map((o) => o.trim()).filter(Boolean),
    [field.options],
  );

  if (field.type === "textarea") {
    return (
      <Textarea
        placeholder={field.label + (field.required ? " *" : "")}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sm:col-span-2 bg-white text-ink"
        rows={3}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">{field.label}{field.required ? " *" : ""}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      type={field.type}
      placeholder={field.label + (field.required ? " *" : "")}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white text-ink"
    />
  );
}

export function ContactForm({ data }: { data: SectionDataMap["contactForm"] }) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  function toggleType(type: string, checked: boolean) {
    setSelectedTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)));
  }

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(57,181,74,.28),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(57,181,74,.18),transparent_40%)]" />
      <Container className="relative">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-5">
          <div className="flex flex-col justify-between gap-8 bg-gradient-to-br from-brand to-brand-dark p-8 sm:p-10 lg:col-span-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Liên hệ
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
                {data.heading || "Yêu cầu tư vấn"}
              </h2>
              {data.subheading && <p className="mt-3 text-white/85 leading-relaxed">{data.subheading}</p>}
            </div>
            <ul className="space-y-3">
              {TRUST_POINTS.map((p) => (
                <li key={p.label} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <p.icon className="h-4 w-4" />
                  </span>
                  {p.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 sm:p-10 lg:col-span-3">
            {state.ok ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-brand" />
                <p className="text-lg font-medium text-white">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input name="name" placeholder="Họ và tên *" required className="bg-white text-ink" />
                <Input name="phone" placeholder="Số điện thoại *" required className="bg-white text-ink" />
                <Input name="email" type="email" placeholder="Email" className="bg-white text-ink" />
                <Input name="company" placeholder="Tên công ty" className="bg-white text-ink" />

                {(data.customFields ?? []).map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <CustomField
                      field={field}
                      value={customValues[field.key] ?? ""}
                      onChange={(v) => setCustomValues((prev) => ({ ...prev, [field.key]: v }))}
                    />
                  </div>
                ))}
                <input type="hidden" name="__customData" value={JSON.stringify(customValues)} />

                <div className="sm:col-span-2 flex flex-wrap gap-x-5 gap-y-2 py-1">
                  {PROJECT_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-white/85">
                      <Checkbox
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={(checked) => toggleType(type, checked === true)}
                        className="border-white/40 data-checked:bg-brand data-checked:border-brand"
                      />
                      {type}
                    </label>
                  ))}
                  {selectedTypes.map((type) => (
                    <input key={type} type="hidden" name="projectTypes" value={type} />
                  ))}
                </div>

                <Textarea
                  name="message"
                  placeholder="Nội dung cần tư vấn"
                  className="sm:col-span-2 bg-white text-ink"
                  rows={4}
                />

                {!state.ok && state.message && (
                  <p className="sm:col-span-2 text-sm text-red-300">{state.message}</p>
                )}

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-brand hover:bg-brand-dark sm:w-auto sm:px-10"
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    {pending ? "Đang gửi..." : "Gửi yêu cầu"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
