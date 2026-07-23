"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteProjectAction, duplicateProjectAction } from "@/lib/actions/projects";

export function ProjectRowActions({ id, title, slug, published }: { id: string; title: string; slug: string; published: boolean }) {
  const router = useRouter();
  const [duplicating, startDuplicate] = useTransition();

  function handleDuplicate() {
    startDuplicate(async () => {
      try {
        await duplicateProjectAction(id);
        toast.success("Đã nhân bản dự án.");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Nhân bản thất bại.");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {published && (
        <Link href={`/du-an/${slug}`} target="_blank">
          <Button variant="ghost" size="icon" title="Xem trên site">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      )}
      <Button variant="ghost" size="icon" title="Nhân bản" disabled={duplicating} onClick={handleDuplicate}>
        <Copy className="h-4 w-4" />
      </Button>
      <Link href={`/admin/projects/${id}`}>
        <Button variant="ghost" size="icon" title="Chỉnh sửa">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <ConfirmDeleteButton itemLabel={title} onDelete={() => deleteProjectAction(id)} />
    </div>
  );
}
