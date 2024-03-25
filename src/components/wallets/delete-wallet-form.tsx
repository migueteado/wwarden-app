import { z } from "zod";
import { CustomWallet } from "./custom-types";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deleteWallet } from "./actions";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { EllipsisIcon } from "lucide-react";

export const DeleteWalletSchema = z.object({
  id: z.string(),
});

export type DeleteWalletInput = z.infer<typeof DeleteWalletSchema>;
interface DeleteWalletFormProps {
  wallet: CustomWallet;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}
export function DeleteWalletForm({
  wallet,
  isLoading,
  setIsLoading,
  setIsOpen,
}: DeleteWalletFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const confirm = async () => {
    setIsLoading(true);
    const result = await deleteWallet({ id: wallet.id });
    if (result.status) {
      toast({
        title: "Wallet Deleted",
        description: `Wallet ${result.data?.wallet.name} deleted successfully.`,
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
        <DialogTitle>Delete {wallet.name}</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this wallet?
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
