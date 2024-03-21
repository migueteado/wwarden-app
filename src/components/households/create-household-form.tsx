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
import { Ellipsis, PlusIcon } from "lucide-react";
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
import { createHousehold } from "./actions";

export const CreateHouseholdSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, "Name is required"),
});

export type CreateHouseholdInput = z.infer<typeof CreateHouseholdSchema>;

const formSchema = CreateHouseholdSchema;

interface CreateHouseholdFormProps {
  iconButton?: boolean;
}

export default function CreateHouseholdForm({
  iconButton,
}: CreateHouseholdFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await createHousehold(values);
    if (result.status) {
      toast({
        title: "Household Created",
        description: `Household ${result.data?.household.name} created successfully.`,
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
            <span className="hidden lg:block">New Household</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Household</DialogTitle>
          <DialogDescription>
            Create a new household to manage your expenses.
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
