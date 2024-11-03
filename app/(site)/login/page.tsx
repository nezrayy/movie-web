"use client";

import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
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
import { useNotification } from "@/contexts/NotificationContext";
import { fetchUserByEmail } from "@/lib/get-user-by-email";

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
  const [wrongCredentials, setWrongCredentials] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      const user = await fetchUserByEmail(data.email)
      if (user) {
        if (user.status === "SUSPENDED") {
          setWrongCredentials("Your account has been suspended.");
          setIsSubmitting(false);
          return;
        }
      }

      if (!user) {
        setWrongCredentials("User not found");
        setIsSubmitting(false);
        return;
      }

      if (result?.error) {
        setWrongCredentials("Wrong email or password");
        setIsSubmitting(false);
        return;
      }

      const session = await getSession();
      if (session?.user?.status === "SUSPENDED") {
        setWrongCredentials("Your account has been suspended.");
        setIsSubmitting(false);
        return;
      }

      const role = session?.user?.role;
      if (role === "ADMIN") {
        window.location.href = "/cms-films";
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setWrongCredentials("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "OAuthAccountNotLinked") {
      form.setError("email", { message: "Email already in use." });
    }
  }, [searchParams]);

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
                    <div className="relative w-full">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="bg-[#222d3c] text-white w-full pr-10"
                      />
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
            {wrongCredentials && (
              <p className="text-red-500 text-sm">{wrongCredentials}</p>
            )}
            <p className="text-white text-sm">
              Forgot password?{" "}
              <Link
                href="/forgot-password"
                className="hover:underline underline-offset-4 text-blue-500"
              >
                Reset here
              </Link>
            </p>
            <Button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Sign in"}
            </Button>
            <Button
              type="button"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
              onClick={() => signIn("google")}
              disabled={isSubmitting}
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
          <Link
            href="/register"
            className="hover:underline underline-offset-4 text-blue-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
