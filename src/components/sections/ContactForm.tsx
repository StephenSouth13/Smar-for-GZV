"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle2, Clock3, MessageSquareText, Send, ShieldCheck } from "lucide-react";
import { Container } from "@/components/public/Container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { submitLeadAction, type LeadFormState } from "@/lib/actions/leads";
import type { SectionDataMap } from "@/lib/schema/sections";

const PROJECT_TYPES = ["Marketing", "Sales", "Digital Transformation", "Education", "Events"];

const TRUST_POINTS = [
  { icon: Clock3, label: "Phản hồi trong 24h" },
  { icon: ShieldCheck, label: "Thông tin được bảo mật" },
  { icon: MessageSquareText, label: "Tư vấn miễn phí" },
];

const initialState: LeadFormState = { ok: false, message: "" };
const fieldClass = "border-white/10 bg-black text-white placeholder:text-white/38 focus-visible:ring-brand/40";

function CustomField({
  field,
  value,
  onChange,
}: {
  field: SectionDataMap["contactForm"]["customFields"][number];
  value: string;
  onChange: (v: string) => void;
}) {
  const options = useMemo(() => field.options.split(",").map((o) => o.trim()).filter(Boolean), [field.options]);

  if (field.type === "textarea") {
    return (
      <Textarea
        placeholder={field.label + (field.required ? " *" : "")}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`sm:col-span-2 ${fieldClass}`}
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
        className="h-9 w-full rounded-md border border-white/10 bg-black px-3 text-sm text-white outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/40"
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

  return <Input type={field.type} placeholder={field.label + (field.required ? " *" : "")} required={field.required} value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass} />;
}

export function ContactForm({ data }: { data: SectionDataMap["contactForm"] }) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  function toggleType(type: string, checked: boolean) {
    setSelectedTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)));
  }

  return (
    <section className="relative overflow-hidden bg-black py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(237,28,36,.28),transparent_42%),radial-gradient(circle_at_85%_90%,rgba(237,28,36,.16),transparent_38%)]" />
      <Container className="relative">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-md border border-white/10 bg-[#111111]/95 shadow-2xl shadow-black/40 lg:grid-cols-5">
          <div className="flex flex-col justify-between gap-8 bg-[linear-gradient(145deg,#ed1c24,#5b0006)] p-8 sm:p-10 lg:col-span-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Liên hệ
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">{data.heading || "Yêu cầu tư vấn"}</h2>
              {data.subheading && <p className="mt-3 leading-relaxed text-white/85">{data.subheading}</p>}
            </div>
            <ul className="space-y-3">
              {TRUST_POINTS.map((p) => (
                <li key={p.label} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/15">
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
                <CheckCircle2 className="h-12 w-12 text-brand-accent" />
                <p className="text-lg font-medium text-white">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input name="name" placeholder="Họ và tên *" required className={fieldClass} />
                <Input name="phone" placeholder="Số điện thoại *" required className={fieldClass} />
                <Input name="email" type="email" placeholder="Email" className={fieldClass} />
                <Input name="company" placeholder="Tên công ty" className={fieldClass} />

                {(data.customFields ?? []).map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <CustomField field={field} value={customValues[field.key] ?? ""} onChange={(v) => setCustomValues((prev) => ({ ...prev, [field.key]: v }))} />
                  </div>
                ))}
                <input type="hidden" name="__customData" value={JSON.stringify(customValues)} />

                <div className="flex flex-wrap gap-x-5 gap-y-2 py-1 sm:col-span-2">
                  {PROJECT_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-white/80">
                      <Checkbox checked={selectedTypes.includes(type)} onCheckedChange={(checked) => toggleType(type, checked === true)} className="border-white/40 data-checked:border-brand data-checked:bg-brand" />
                      {type}
                    </label>
                  ))}
                  {selectedTypes.map((type) => (
                    <input key={type} type="hidden" name="projectTypes" value={type} />
                  ))}
                </div>

                <Textarea name="message" placeholder="Nội dung cần tư vấn" className={`sm:col-span-2 ${fieldClass}`} rows={4} />

                {!state.ok && state.message && <p className="text-sm text-red-300 sm:col-span-2">{state.message}</p>}

                <div className="sm:col-span-2">
                  <Button type="submit" disabled={pending} className="w-full rounded-md bg-brand font-bold hover:bg-brand-dark sm:w-auto sm:px-10">
                    <Send className="mr-1.5 h-4 w-4" />
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
