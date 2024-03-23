"use client";

import { EllipsisIcon, PlusIcon, UserIcon, WalletIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "../ui/table";
import { CustomHousehold } from "./custom-types";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { addMember, addWallet } from "./actions";
import { CustomWallet } from "../wallets/wallet-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface HouseholdViewProps {
  household: CustomHousehold;
  wallets: CustomWallet[];
}

export default function HouseholdView({
  household,
  wallets,
}: HouseholdViewProps) {
  return (
    <div className="w-full pb-12">
      <p className="text-gray-500">
        Manage your household wallets and members.
      </p>
      <Separator className="my-4" />
      <div className="grid lg:grid-cols-2 gap-4">
        <MembersTable household={household} />
        <WalletsTable household={household} wallets={wallets} />
      </div>
    </div>
  );
}

export const AddMemberSchema = z.object({
  householdId: z.string(),
  username: z.string({
    required_error: "Username is required",
  }),
});

export type AddMemberInput = z.infer<typeof AddMemberSchema>;

const addMemberFormSchema = AddMemberSchema;

function MembersTable({ household }: { household: CustomHousehold }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof addMemberFormSchema>>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      householdId: household.id,
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addMemberFormSchema>) {
    setIsLoading(true);
    const result = await addMember(values);
    if (result.status) {
      toast({
        title: "Household Member Added!",
        description: `${values.username} added to ${household.name} successfully.`,
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
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button variant="ghost" className="w-full flex mb-2">
            <PlusIcon className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:block">Add Member</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Add members to your household to manage your expenses.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Member Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col items-center justify-end w-full gap-4 pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <EllipsisIcon className="w-4 h-4" />
                    ) : (
                      "Add Member"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <div className="rounded border">
        <Table>
          <TableBody>
            {household.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center justify-start">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {member.user.username}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{member.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const AddWalletSchema = z.object({
  householdId: z.string(),
  walletId: z.string(),
});

export type AddWalletInput = z.infer<typeof AddWalletSchema>;

const addWalletFormSchema = AddWalletSchema;

function WalletsTable({
  household,
  wallets,
}: {
  household: CustomHousehold;
  wallets: CustomWallet[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof addWalletFormSchema>>({
    resolver: zodResolver(addWalletFormSchema),
    defaultValues: {
      householdId: household.id,
      walletId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addWalletFormSchema>) {
    setIsLoading(true);
    const result = await addWallet(values);
    if (result.status) {
      toast({
        title: "Household Wallet Added!",
        description: `Wallet added successfully.`,
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
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button variant="ghost" className="w-full flex mb-2">
            <PlusIcon className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:block">Add Wallet</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wallet</DialogTitle>
            <DialogDescription>
              Add wallets to your household to manage your expenses.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
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
                          {wallets
                            .filter(
                              (w) =>
                                !household.wallets
                                  .map((hw) => hw.wallet.id)
                                  .includes(w.id)
                            )
                            .map((w) => (
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
                <div className="flex flex-col items-center justify-end w-full gap-4 pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <EllipsisIcon className="w-4 h-4" />
                    ) : (
                      "Add Wallet"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <div className="rounded border">
        <Table>
          <TableBody>
            {household.wallets.map((wallet) => (
              <TableRow key={wallet.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center justify-start">
                    <WalletIcon className="h-4 w-4 mr-2" />
                    {wallet.wallet.name}{" "}
                    <div className="text-xs ml-2 text-slate-500">
                      {wallet.wallet.currency}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {wallet.wallet.user.username}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
