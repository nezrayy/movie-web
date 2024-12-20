'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
// const formSchema = z.object({
//   password: z
//     .string()
//     .min(6, { message: "Password must be at least 6 characters." })
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/, {
//       message:
//         "Password must contain at least one uppercase letter, one lowercase letter, one symbol, and be at least 6 characters long.",
//     }),
// });

type FormData = z.infer<typeof formSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Dapatkan token dari URL

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const { password } = data

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setSuccess("Password reset successful");
        router.push("/login"); // Redirect ke halaman login setelah reset berhasil
      } else {
        setError(result.message);
      }
      setIsSubmitting(false)
    } catch (error) {
      console.log("INTERNAL SERVER ERROR")
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                  <div className="relative w-full">
                    {/* Input field */}
                    <Input
                      type={showPassword ? "text" : "password"} // Tampilkan teks jika showPassword true, sebaliknya tampilkan password
                      placeholder="Enter your password"
                      {...field} // Spread field props (assuming this comes from useForm)
                      className="bg-[#222d3c] text-white w-full pr-10" // Tambah padding kanan untuk space icon
                    />
                    
                    {/* Icon for showing/hiding password */}
                    <Button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      variant="ghost"
                      className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-12 text-white"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-white text-center">{error}</p>
            )}

            {success && (
              <p className="text-white text-center">{success}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={isSubmitting} // Matikan tombol saat loading
            >
              {isSubmitting ? "Loading..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
