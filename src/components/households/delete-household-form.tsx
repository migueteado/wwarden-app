import { EllipsisIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { deleteHousehold } from "./actions";
import { CustomHousehold } from "./custom-types";

export const DeleteHouseholdSchema = z.object({
  id: z.string(),
});

export type DeleteHouseholdInput = z.infer<typeof DeleteHouseholdSchema>;

interface DeleteHouseholdFormProps {
  household: CustomHousehold;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}
export default function DeleteHouseholdForm({
  household,
  isLoading,
  setIsLoading,
  setIsOpen,
}: DeleteHouseholdFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const confirm = async () => {
    setIsLoading(true);
    const result = await deleteHousehold({ id: household.id });
    if (result.status) {
      toast({
        title: "Household Deleted",
        description: `Household deleted successfully.`,
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
