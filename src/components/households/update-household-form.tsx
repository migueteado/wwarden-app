"use client";

import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import React from "react";
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
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { EllipsisIcon } from "lucide-react";
import { Button } from "../ui/button";
import { CustomHousehold } from "./custom-types";
import { updateHousehold } from "./actions";

export const UpdateHouseholdSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: "Wallet is required",
  }),
});

export type UpdateHouseholdInput = z.infer<typeof UpdateHouseholdSchema>;

const formSchema = UpdateHouseholdSchema;

interface UpdateHouseholdFormProps {
  household: CustomHousehold;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}
export default function UpdateHouseholdForm({
  household,
  isLoading,
  setIsLoading,
  setIsOpen,
}: UpdateHouseholdFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: household.id,
      name: household.name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);
    const result = await updateHousehold(values);
    if (result.status) {
      toast({
        title: "Transaction Updated",
        description: `Transaction updated successfully.`,
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
        <DialogTitle>Update {household.name}</DialogTitle>
      </DialogHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Household Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Household Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-end w-full gap-4 pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <EllipsisIcon className="w-4 h-4" /> : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  ); /* 971.54 */
}
