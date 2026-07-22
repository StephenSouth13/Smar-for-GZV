"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePageAction } from "@/lib/actions/pages";

export function DeletePageButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deletePageAction(slug);
        toast.success("Đã xoá trang.");
        router.push("/admin/pages");
      } catch {
        toast.error("Xoá thất bại.");
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button type="button" variant="outline" className="text-destructive hover:text-destructive" />}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Xoá trang
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá trang này?</AlertDialogTitle>
          <AlertDialogDescription>
            Trang &quot;{slug}&quot; sẽ bị xoá vĩnh viễn cùng toàn bộ section. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            {pending ? "Đang xoá..." : "Xoá"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
