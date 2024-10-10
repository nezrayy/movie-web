"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

// Schema untuk validasi menggunakan Zod
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const RegisterPage = () => {
  // Menginisialisasi form dengan react-hook-form dan zodResolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const [isVerificationSent, setIsVerificationSent] = useState(false); // State untuk verifikasi
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true); // Mulai loading

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json(); // Dapatkan hasil response

      if (!response.ok) {
        // Jika email sudah digunakan, tampilkan pesan error
        if (result.message === "Email sudah digunakan") {
          form.setError("email", { type: "manual", message: "Email sudah digunakan" });
        } else {
          console.error("Error:", result.message);
        }
        setIsSubmitting(false);
        return;
      }

      // Jika berhasil, ubah state menjadi true dan tampilkan pesan verifikasi
      setIsVerificationSent(true);
      setIsSubmitting(false); // Hentikan loading

    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false); // Hentikan loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#0C0D11] p-8 rounded-lg shadow-lg w-96">
        {/* <h1 className="text-center text-2xl font-semibold mb-6 text-white">Dramaku</h1> */}
        <Image 
          src="/rewatch.png"
          alt="Rewatch Logo"
          width={200}
          height={50}
          className="w-full px-10 py-4"
        />

        {isVerificationSent ? (  // Jika verifikasi telah dikirim, tampilkan pesan
          <p className="text-white text-center mb-6">
            Verifikasi telah dikirim ke email Anda. Silakan cek email Anda untuk melanjutkan.
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} className="bg-[#222d3c] text-white" />
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
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} className="bg-[#222d3c] text-white" />
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

              <Button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                disabled={isSubmitting} // Matikan tombol ketika loading
              >
                {isSubmitting ? "Loading..." : "Sign up"}
              </Button>

              <Button
                type="button"
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
                disabled={isSubmitting} // Matikan tombol ketika loading
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
        )}

        {/* Link to Login */}
        {!isVerificationSent && (
          <p className="text-white mt-5 text-center">
            Already have an account?{" "}
            <Link href="/login" className="hover:underline underline-offset-4 text-blue-500">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
