"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deletePostAction } from "@/lib/actions/posts";

export function PostRowActions({ id, title }: { id: string; title: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/admin/posts/${id}`}>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <ConfirmDeleteButton itemLabel={title} onDelete={() => deletePostAction(id)} />
    </div>
  );
}
