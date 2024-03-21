import { EllipsisIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CustomTransaction } from "./custom-type";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { deleteTransaction } from "./actions";

export const DeleteTransactionSchema = z.object({
  id: z.string(),
});

export type DeleteTransactionInput = z.infer<typeof DeleteTransactionSchema>;
interface DeleteTransactionProps {
  transaction: CustomTransaction;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}
export default function DeleteTransactionForm({
  transaction,
  isLoading,
  setIsLoading,
  setIsOpen,
}: DeleteTransactionProps) {
  const router = useRouter();
  const { toast } = useToast();

  const confirm = async () => {
    setIsLoading(true);
    const result = await deleteTransaction({ id: transaction.id });
    if (result.status) {
      toast({
        title: "Transaction Deleted",
        description: `Transaction deleted successfully.`,
      });

      setIsOpen(false);
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "An error occured!",
        description: result.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this transaction?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={() => confirm()} disabled={isLoading}>
          {isLoading ? <EllipsisIcon className="h-4 w-4" /> : "Confirm"}{" "}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
