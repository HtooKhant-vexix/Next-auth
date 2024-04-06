"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().min(1, "Email cannot be empty.").email("Invalid Email"),
  password: z
    .string()
    .min(1, "Password cannot be empty.")
    .min(8, "Password should have minimum 8 characters."),
});

const SignInForm = () => {
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log(signInData);

    if (signInData?.error) {
      toast({
        title: "Error",
        description: "Oops! Something was wrong !",
        variant: "destructive",
      });
    } else {
      router.refresh();
      router.push("/admin");
    }
  };

  return (
    <div className="w-[400px] p-6 rounded-xl bg-gray-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-2">
            Sign In
          </Button>
        </form>
      </Form>
      <p className="text-center mt-4">
        Doesn't have a account?
        <Link className="text-blue-600 ms-2" href="/sign-up">
          sign up here.
        </Link>
      </p>
      <Button className="w-full mt-2">Sign Up with Google</Button>
    </div>
  );
};

export default SignInForm;
