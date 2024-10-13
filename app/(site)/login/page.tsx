"use client";

import Image from "next/image";
import { signIn } from "next-auth/react"
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema validasi dengan Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true); // Mulai loading

    try {
      signIn("credentials", data)

      setIsSubmitting(false); // Hentikan loading
    } catch (error) {
      console.error("Login error:", error);
      setIsSubmitting(false); // Hentikan loading jika gagal
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#0C0D11] p-8 rounded-lg shadow-lg w-96">
        <Image
          src="/rewatch.png"
          alt="Rewatch Logo"
          width={200}
          height={50}
          className="w-full px-10 py-4"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="bg-[#222d3c] text-white"
                    />
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="bg-[#222d3c] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={isSubmitting} // Matikan tombol saat loading
            >
              {isSubmitting ? "Loading..." : "Sign in"}
            </Button>

            <Button
              type="button"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
            >
              <img
                src="/google-icon.svg"
                alt="Google Icon"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm font-medium">Continue with Google</span>
            </Button>
          </form>
        </Form>

        <p className="text-white mt-5 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="hover:underline underline-offset-4">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
