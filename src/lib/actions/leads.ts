"use server";

import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";

const leadSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  company: z.string().optional().default(""),
  projectTypes: z.array(z.string()).default([]),
  message: z.string().optional().default(""),
});

export type LeadFormState = { ok: boolean; message: string };

export async function submitLeadAction(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "",
    projectTypes: formData.getAll("projectTypes").map(String),
    message: formData.get("message")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ." };
  }

  await adminDb.collection("leads").add({
    ...parsed.data,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, message: "Cảm ơn bạn! GZV sẽ liên hệ lại trong thời gian sớm nhất." };
}
