"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteProjectAction } from "@/lib/actions/projects";

export function ProjectRowActions({ id, title }: { id: string; title: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/admin/projects/${id}`}>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <ConfirmDeleteButton itemLabel={title} onDelete={() => deleteProjectAction(id)} />
    </div>
  );
}
