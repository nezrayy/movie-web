"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
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
import { useNotification } from "@/contexts/NotificationContext";
import { useEditFormContext } from "@/contexts/EditFormContext";
import { formConfigurations } from "@/config/fieldConfigurations";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SheetEditForm: React.FC = () => {
  const { isOpen, closeEditForm, entityType, entityData } =
    useEditFormContext();
  const { showNotification } = useNotification();

  if (!entityType || !formConfigurations[entityType]) {
    return null; // Tidak ada entityType atau tidak valid
  }

  const formSchema = z.object(
    formConfigurations[entityType].reduce((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {} as Record<string, ZodType>)
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: entityData || {},
  });

  const handleSubmit = async (data: any) => {
    if (!entityType) return;

    try {
      const response = await fetch(
        `/api/${pluralize(entityType)}/${entityData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      showNotification("Data updated successfully.");
      closeEditForm();
    } catch (error) {
      console.error("Error updating data:", error);
      showNotification("An error occurred while updating data.");
    }
  };

  // // Log untuk memeriksa elemen anak
  // console.log(
  //   "Sheet Content Children:",
  //   <SheetContent>
  //     <SheetHeader>
  //       <SheetTitle>
  //         Edit {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
  //       </SheetTitle>
  //       <SheetClose />
  //     </SheetHeader>
  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
  //         {formConfigurations[entityType].map((field) => (
  //           <FormField
  //             key={field.name}
  //             control={form.control}
  //             name={field.name}
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>{field.label}</FormLabel>
  //                 <FormControl>
  //                   <Input
  //                     className="bg-[#14141c] text-white placeholder:text-gray-400"
  //                     placeholder={field.placeholder}
  //                     {...field}
  //                     defaultValue={entityData[field.name] || ""}
  //                   />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //         ))}
  //         <SheetFooter>
  //           <Button
  //             type="submit"
  //             className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors"
  //           >
  //             Save Changes
  //           </Button>
  //         </SheetFooter>
  //       </form>
  //     </Form>
  //   </SheetContent>
  // );

  return (
    <Sheet open={isOpen} onOpenChange={closeEditForm}>
      <SheetContent className="bg-[#14141c] border-none">
        <SheetHeader>
          <SheetTitle>
            Edit {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </SheetTitle>
          <SheetClose />
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {formConfigurations[entityType].map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#14141c] text-white placeholder:text-gray-400"
                        placeholder={field.placeholder}
                        {...field}
                        defaultValue={entityData[field.name] || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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

export default SheetEditForm;
