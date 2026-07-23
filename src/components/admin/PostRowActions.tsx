"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deletePostAction, duplicatePostAction } from "@/lib/actions/posts";

export function PostRowActions({ id, title, slug, published }: { id: string; title: string; slug: string; published: boolean }) {
  const router = useRouter();
  const [duplicating, startDuplicate] = useTransition();

  function handleDuplicate() {
    startDuplicate(async () => {
      try {
        await duplicatePostAction(id);
        toast.success("Đã nhân bản bài viết.");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Nhân bản thất bại.");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {published && (
        <Link href={`/chia-se/${slug}`} target="_blank">
          <Button variant="ghost" size="icon" title="Xem trên site">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      )}
      <Button variant="ghost" size="icon" title="Nhân bản" disabled={duplicating} onClick={handleDuplicate}>
        <Copy className="h-4 w-4" />
      </Button>
      <Link href={`/admin/posts/${id}`}>
        <Button variant="ghost" size="icon" title="Chỉnh sửa">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <ConfirmDeleteButton itemLabel={title} onDelete={() => deletePostAction(id)} />
    </div>
  );
}
