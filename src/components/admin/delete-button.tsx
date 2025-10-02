'use client';

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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import * as React from 'react';

interface DeleteButtonProps {
  id: string;
  deleteAction: (id: string) => Promise<{ success: boolean; message: string }>;
  itemName: string;
  itemType: string;
}

export function DeleteButton({ id, deleteAction, itemName, itemType }: DeleteButtonProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result.success) {
        toast({ title: "Success", description: `${itemType} deleted successfully.` });
        setOpen(false);
      } else {
        toast({ variant: 'destructive', title: "Error", description: result.message });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {itemType.toLowerCase()} titled <span className="font-bold">"{itemName}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
