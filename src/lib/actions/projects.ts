"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { projectSchema, type ProjectInput } from "@/lib/schema/content";
import {
  createProject,
  updateProject,
  deleteProject,
  listProjects,
  type ProjectDoc,
} from "@/lib/data/projects";

export async function listProjectsForPickerAction(): Promise<Pick<ProjectDoc, "id" | "title" | "published">[]> {
  await requireAdmin();
  const projects = await listProjects();
  return projects.map((p) => ({ id: p.id, title: p.title, published: p.published }));
}

export async function createProjectAction(data: ProjectInput) {
  await requireAdmin();
  const parsed = projectSchema.parse(data);
  const id = await createProject(parsed);
  revalidatePath("/du-an");
  revalidatePath("/");
  return { id };
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  await requireAdmin();
  const parsed = projectSchema.parse(data);
  await updateProject(id, parsed);
  revalidatePath("/du-an");
  revalidatePath(`/du-an/${parsed.slug}`);
  revalidatePath("/");
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProject(id);
  revalidatePath("/du-an");
  revalidatePath("/");
}
