// components/SheetEditActor.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import ImageDropzone from "@/components/image-drop-zone-sm";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Country } from "@prisma/client";
import { useNotification } from "@/contexts/NotificationContext";

interface EditActorProps {
  isOpen: boolean;
  onClose: () => void;
  actorData: {
    id: number;
    name: string;
    birthdate: Date;
    countryId: number;
    photoUrl: string;
  };
  onSave: (updatedActor: any) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  birthdate: z.date(),
  countryId: z.string().min(1, { message: "Country is required" }),
  image: z.any().optional(),
});

const SheetEditActor: React.FC<EditActorProps> = ({
  isOpen,
  onClose,
  actorData,
  onSave,
}) => {
  const [countriesData, setCountriesData] = useState<Country[]>([]);
  const { showNotification } = useNotification();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: actorData || {
      name: "",
      birthdate: new Date(),
      countryId: "",
      image: null,
    },
  });

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

  useEffect(() => {
    if (actorData) {
      form.reset({
        name: actorData.name,
        birthdate: new Date(actorData.birthdate),
        countryId: actorData.countryId.toString(),
        image: null,
      });
    }
  }, [actorData, form]);

  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("birthdate", data.birthdate.toISOString());
      formData.append("countryId", data.countryId);
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await fetch(`/api/actors/${actorData?.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update actor");
      }

      const updatedActor = await response.json();
      showNotification("Actor updated successfully!");
      onSave(updatedActor);
      onClose();
    } catch (error) {
      console.error("Error updating actor:", error);
      showNotification("An error occurred while updating actor.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
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
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#14141c] text-white placeholder:text-gray-400"
                      placeholder="Enter actor name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birthdate Field */}
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Birthdate</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
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
                      <SelectTrigger className="bg-transparent text-gray-400 placeholder:text-gray-400">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#21212E] text-gray-400">
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

            {/* Image Upload Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Photo</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
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
