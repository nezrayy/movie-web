"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNotification } from "@/contexts/NotificationContext";

export type Actor = {
  id: number;
  name: string;
  birthdate: string;
  country: { id: number; name: string };
  photoUrl: string;
};

interface EditActorProps {
  isOpen: boolean;
  onClose: () => void;
  actorData: Actor | null;
  onSave: (updatedActor: Actor) => void;
}

const isValidImageUrl = (url: string) => {
  try {
    // Cek apakah URL adalah path lokal (dimulai dengan "/")
    if (url.startsWith("/")) {
      // Periksa apakah path diakhiri dengan ekstensi gambar yang valid
      const path = url.toLowerCase();
      return (
        path.endsWith(".jpg") || path.endsWith(".png") || path.endsWith(".jpeg")
      );
    } else {
      // Jika URL penuh, buat objek URL untuk memisahkan path dan query
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.toLowerCase();
      return (
        path.endsWith(".jpg") || path.endsWith(".png") || path.endsWith(".jpeg")
      );
    }
  } catch (error) {
    // Jika URL tidak valid
    return false;
  }
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  birthdate: z.date(),
  countryId: z.string().min(1, { message: "Country is required" }),
  photoUrl: z
    .string()
    .url({ message: "Valid URL is required" })
    .refine((url) => isValidImageUrl(url), {
      message: "The URL must point to a valid image (.jpg, .png, .jpeg)",
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SheetEditActor: React.FC<EditActorProps> = ({
  isOpen,
  onClose,
  actorData,
  onSave,
}) => {
  const [countriesData, setCountriesData] = useState<
    { id: number; name: string }[]
  >([]);
  const { showNotification } = useNotification();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: actorData?.name || "",
      birthdate: actorData?.birthdate
        ? new Date(actorData.birthdate)
        : undefined,
      countryId: actorData?.country?.id.toString() || "",
      photoUrl: actorData?.photoUrl || "",
    },
  });

  useEffect(() => {
    // Update default values whenever actorData changes
    if (actorData) {
      form.reset({
        name: actorData.name || "",
        birthdate: actorData.birthdate
          ? new Date(actorData.birthdate)
          : undefined,
        countryId: actorData.country?.id.toString() || "",
        photoUrl: actorData?.photoUrl || "",
      });
    }
  }, [actorData, form]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        const data = await response.json();
        setCountriesData(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(`/api/actors/${actorData?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          birthdate: data.birthdate.toISOString(),
          countryId: data.countryId,
          photoUrl: data.photoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update actor");
      }

      const updatedActor = await response.json();
      onSave(updatedActor);
      showNotification("Actor updated successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating actor:", error);
      showNotification("An error occurred while updating actor.");
    }
  };

  const handleCloseSheet = () => {
    onClose();
    window.location.reload();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseSheet();
        }
      }}
    >
      <SheetContent className="bg-[#14141c] border-none">
        <SheetHeader>
          <SheetTitle className="text-white">Edit Actor</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-[#14141c] text-gray-400 placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Birthdate</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={(date) => date && field.onChange(date)}
                      endYear={2024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Country</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-[#14141c] text-gray-400 placeholder:text-gray-400">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#14141c] text-gray-400">
                        {countriesData.map((country) => (
                          <SelectItem
                            key={country.id}
                            value={country.id.toString()}
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Photo URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter photo URL..."
                      className="bg-[#14141c] text-gray-400 placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button
                type="submit"
                className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default SheetEditActor;
