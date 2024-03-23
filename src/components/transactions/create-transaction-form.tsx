"use client";

import { z } from "zod";
import { Button } from "../ui/button";
import { $Enums } from "@prisma/client";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Ellipsis, PlusIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "../ui/dialog";
import { createTransaction } from "./actions";
import { CustomCategory, CustomWallet } from "./custom-type";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export const CreateTransactionSchema = z.object({
  walletId: z.string({
    required_error: "Wallet is required",
  }),
  amount: z.number({
    required_error: "Amount is required",
  }),
  date: z.coerce.date(),
  type: z.nativeEnum($Enums.TransactionType),
  categoryId: z.string({
    required_error: "Category is required",
  }),
  subcategoryId: z.string({
    required_error: "Subcategory is required",
  }),
  entity: z.string().optional(),
  description: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

const formSchema = CreateTransactionSchema;

interface CreateTransactionFormProps {
  iconButton?: boolean;
  wallets: CustomWallet[];
  categories: CustomCategory[];
}

export default function CreateTransactionForm({
  iconButton,
  wallets,
  categories,
}: CreateTransactionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [availableCategories, setAvailableCategories] = React.useState<
    CustomCategory[]
  >([]);
  const [availableSubcategories, setAvailableSubcategories] = React.useState<
    CustomCategory["subcategories"]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletId: wallets[0].id,
      type: "EXPENSE",
      entity: "",
      description: "",
    },
  });

  const transactionType = form.watch("type");
  const categoryId = form.watch("categoryId");

  React.useEffect(() => {
    const newAvailableCategories = categories.filter(
      (c) => c.type === transactionType
    );
    setAvailableCategories(newAvailableCategories);
    const category = form.getValues("categoryId");
    if (newAvailableCategories.find((n) => n.id === category)) {
      return;
    }

    form.setValue("categoryId", newAvailableCategories[0]?.id || "");
    form.setValue(
      "subcategoryId",
      newAvailableCategories[0]?.subcategories[0]?.id || ""
    );
  }, [categories, transactionType, form]);

  React.useEffect(() => {
    const currentCategory = availableCategories.find(
      (c) => c.id === categoryId
    );
    setAvailableSubcategories(
      currentCategory ? currentCategory.subcategories : []
    );
    const subcategory = form.getValues("subcategoryId");
    if (currentCategory?.subcategories.find((c) => c.id === subcategory)) {
      return;
    }

    form.setValue("subcategoryId", currentCategory?.subcategories[0]?.id || "");
  }, [availableCategories, categoryId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await createTransaction(values);
    if (result.status) {
      toast({
        title: "Transaction Created",
        description: `Transaction created successfully.`,
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {iconButton ? (
          <Button size="icon">
            <PlusIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <PlusIcon className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:block">Add Transaction</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
          <DialogDescription>Add a new transaction.</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Transaction Type</FormLabel>
                    <FormMessage />
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-2"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary [&:has([data-state=checked])>div]:text-green-500">
                          <FormControl>
                            <RadioGroupItem
                              value="INCOME"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="font-bold items-center flex justify-center rounded-md border-2 border-muted p-1 hover:border-accent py-2 px-4">
                            INCOME
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary [&:has([data-state=checked])>div]:text-red-500">
                          <FormControl>
                            <RadioGroupItem
                              value="EXPENSE"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="font-bold items-center flex justify-center rounded-md border-2 border-muted p-1 hover:border-accent py-2 px-4">
                            EXPENSE
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSubcategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="walletId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a wallet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wallets.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            <div className="flex items-center">
                              <div className="mr-2">{w.name} </div>
                              <div className="text-xs text-slate-500">
                                {w.currency}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
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

              <FormField
                control={form.control}
                name="entity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Rappi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Some burgers..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center justify-end w-full gap-4 pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Ellipsis className="w-4 h-4" /> : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
