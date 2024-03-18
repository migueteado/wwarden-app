"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { signupUser } from "./actions/signup";

export const SignupUserSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .min(1, "Email is required")
      .email("Email is invalid"),
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(5, "Username is required"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: z
      .string({
        required_error: "Confirm your password",
      })
      .min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export type SignupUserInput = z.infer<typeof SignupUserSchema>;

const formSchema = SignupUserSchema;

export function SignupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await signupUser(values);

    if (result.status) {
      toast({
        title: "User registered!",
        description: `User ${result.data?.user.username} has been succesfully created.`,
      });

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 3000);
    } else {
      toast({
        variant: "destructive",
        title: "An error occured!",
        description: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="some_username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="some@email.com" {...field} />
              </FormControl>
              <FormDescription>
                We will never share your email with anyone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Passwords must be at least 8 and less than 32 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Passwords must match.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center justify-end w-full gap-4 pt-2">
          <Button type="submit" className="w-full">
            Sign up
          </Button>
          <Link href="/auth/signin" className="text-sm">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}
