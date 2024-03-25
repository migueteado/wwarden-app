import { $Enums } from "@prisma/client";
import { z } from "zod";
import { CustomWallet } from "./custom-types";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWallet } from "./actions";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { EllipsisIcon } from "lucide-react";

export const UpdateWalletSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, "Name is required"),
  platform: z
    .string({
      required_error: "Platform is required",
    })
    .min(3, "Platform is required"),
  currency: z.nativeEnum($Enums.Currency),
  balance: z.number({
    required_error: "Balance is required",
  }),
});

export type UpdateWalletInput = z.infer<typeof UpdateWalletSchema>;

const formSchema = UpdateWalletSchema;

interface UpdateWalletFormProps {
  wallet: CustomWallet;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}
export function UpdateWalletForm({
  wallet,
  isLoading,
  setIsLoading,
  setIsOpen,
}: UpdateWalletFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: wallet.id,
      name: wallet.name,
      platform: wallet.platform,
      currency: wallet.currency,
      balance: wallet.balance,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await updateWallet(values);
    if (result.status) {
      toast({
        title: "Wallet Updated",
        description: `Wallet ${result.data?.wallet.name} updated successfully.`,
      });

      setIsOpen(false);
      form.reset();
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "An error occured!",
        description: result.message,
      });
    }
    setIsLoading(false);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Wallet</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this wallet?
        </DialogDescription>
      </DialogHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Wallet Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Bank Of America"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Balance</FormLabel>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onBlur={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values($Enums.Currency).map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-end w-full gap-4 pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <EllipsisIcon className="w-4 h-4" /> : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
