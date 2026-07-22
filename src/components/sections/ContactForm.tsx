"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/public/Container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { submitLeadAction, type LeadFormState } from "@/lib/actions/leads";
import type { SectionDataMap } from "@/lib/schema/sections";

const PROJECT_TYPES = ["Content", "Design", "Media", "Performance", "Website"];

const initialState: LeadFormState = { ok: false, message: "" };

export function ContactForm({ data }: { data: SectionDataMap["contactForm"] }) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  function toggleType(type: string, checked: boolean) {
    setSelectedTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)));
  }

  return (
    <section className="py-20 bg-ink text-white">
      <Container className="max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">{data.heading || "Yêu cầu tư vấn"}</h2>
          {data.subheading && <p className="mt-3 text-white/75">{data.subheading}</p>}
        </div>

        {state.ok ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/5 py-14 text-center">
            <CheckCircle2 className="h-10 w-10 text-brand" />
            <p className="text-lg font-medium">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-white/5 p-6 sm:p-8">
            <Input name="name" placeholder="Họ và tên *" required className="bg-white text-ink" />
            <Input name="phone" placeholder="Số điện thoại *" required className="bg-white text-ink" />
            <Input name="email" type="email" placeholder="Email" className="bg-white text-ink" />
            <Input name="company" placeholder="Tên công ty" className="bg-white text-ink" />
            <div className="sm:col-span-2 flex flex-wrap gap-4 py-1">
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
            <div className="sm:col-span-2 flex justify-center">
              <Button type="submit" disabled={pending} className="bg-brand hover:bg-brand-dark px-8">
                {pending ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </div>
          </form>
        )}
      </Container>
    </section>
  );
}
