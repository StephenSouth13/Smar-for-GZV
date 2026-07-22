"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/session";

const leadSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  company: z.string().optional().default(""),
  projectTypes: z.array(z.string()).default([]),
  message: z.string().optional().default(""),
  customData: z.record(z.string(), z.string()).default({}),
});

export type LeadFormState = { ok: boolean; message: string };

export type LeadDoc = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  projectTypes: string[];
  message: string;
  customData: Record<string, string>;
  read: boolean;
  createdAt: string;
};

function parseCustomData(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object") {
      return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v)]));
    }
  } catch {
    // ignore malformed input
  }
  return {};
}

export async function submitLeadAction(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "",
    projectTypes: formData.getAll("projectTypes").map(String),
    message: formData.get("message")?.toString() ?? "",
    customData: parseCustomData(formData.get("__customData")?.toString()),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ." };
  }

  await adminDb.collection("leads").add({
    ...parsed.data,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, message: "Cảm ơn bạn! GZV sẽ liên hệ lại trong thời gian sớm nhất." };
}

export async function listLeadsAction(): Promise<LeadDoc[]> {
  await requireAdmin();
  const snap = await adminDb.collection("leads").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      company: data.company ?? "",
      projectTypes: data.projectTypes ?? [],
      message: data.message ?? "",
      customData: data.customData ?? {},
      read: !!data.read,
      createdAt: data.createdAt ?? "",
    };
  });
}

export async function countUnreadLeadsAction(): Promise<number> {
  await requireAdmin();
  const snap = await adminDb.collection("leads").where("read", "==", false).get();
  return snap.size;
}

export async function markLeadReadAction(id: string) {
  await requireAdmin();
  await adminDb.collection("leads").doc(id).set({ read: true }, { merge: true });
  revalidatePath("/admin/leads");
}

export async function deleteLeadAction(id: string) {
  await requireAdmin();
  await adminDb.collection("leads").doc(id).delete();
  revalidatePath("/admin/leads");
}
