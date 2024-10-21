'use client'

import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const ForgotPasswordPage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const { email } = data

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
      setMessage(result.message);
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
      setIsSubmitting(false)
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

            {message && (
              <p className="text-white text-center">{message}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={isSubmitting} // Matikan tombol saat loading
            >
              {isSubmitting ? "Loading..." : "Send Email"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
