"use client";

import { z } from "zod";
import { Button } from "../ui/button";
import { $Enums, User } from "@prisma/client";
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
import { createHouseholdWallet, createWallet } from "./actions";

export const CreateHouseholdWalletSchema = z.object({
  userId: z.string(),
  householdId: z.string(),
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
  date: z.coerce.date(),
});

export type CreateHouseholdWalletInput = z.infer<
  typeof CreateHouseholdWalletSchema
>;

const formSchema = CreateHouseholdWalletSchema;

interface CreateHouseholdWalletFormProps {
  iconButton?: boolean;
  householdId: string;
  users: User[];
}

export default function CreateHouseholdWalletForm({
  iconButton,
  householdId,
  users,
}: CreateHouseholdWalletFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: users[0].id,
      householdId: householdId,
      name: "",
      platform: "",
      currency: "USD",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await createHouseholdWallet(values);
    if (result.status) {
      toast({
        title: "Wallet Created",
        description: `Wallet ${result.data?.wallet.name} created successfully.`,
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
            <span className="hidden lg:block">Add Wallet</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Wallet</DialogTitle>
          <DialogDescription>
            Add a new wallet to your account.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
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
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.username}
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Initial Date</FormLabel>
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
