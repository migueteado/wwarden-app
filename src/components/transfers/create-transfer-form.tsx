"use client";

import { z } from "zod";
import { Button } from "../ui/button";
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
import { CustomWallet } from "../transactions/custom-type";
import { createTransfer } from "./actions";

export const CreateTransferSchema = z.object({
  fromWalletId: z.string({
    required_error: "Origin wallet is required",
  }),
  toWalletId: z.string({
    required_error: "Destination wallet is required",
  }),
  fromAmount: z.number({
    required_error: "Origin amount is required",
  }),
  toAmount: z.number({
    required_error: "Destination amount is required",
  }),
  fee: z.number().optional(),
  date: z.coerce.date(),
  description: z.string().optional(),
});

export type CreateTransferInput = z.infer<typeof CreateTransferSchema>;

const formSchema = CreateTransferSchema;

interface CreateTransferFormProps {
  iconButton?: boolean;
  wallets: CustomWallet[];
}

export default function CreateTransferForm({
  iconButton,
  wallets,
}: CreateTransferFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await createTransfer(values);
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
            <span className="hidden lg:block">Add Transfer</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Transfer</DialogTitle>
          <DialogDescription>Add a new transfer.</DialogDescription>
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
              <div className="grid lg:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="fromWalletId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Wallet</FormLabel>
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
                                <div className="mr-2">{w.user.username}</div>
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
                  name="fromAmount"
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
              </div>
              <div className="grid lg:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="toWalletId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Wallet</FormLabel>
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
                                <div className="mr-2">{w.user.username}</div>
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
                  name="toAmount"
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
              </div>

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee</FormLabel>
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
