"use client";

import React, { useEffect } from "react";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNotification } from "@/contexts/NotificationContext";
import { useEditUserContext } from "@/contexts/EditUserFormContext";

interface SheetEditFormProps {
  onClose?: () => void;
}

const formSchema = z.object({
  role: z.enum(["ADMIN", "WRITER", "USER"]),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  initialData: {
    role: string;
    status: string;
  };
  onSave: (updatedUser: any) => void; // Pastikan ini ada
}

const EditUserSheet: React.FC<EditUserSheetProps> = ({
  isOpen,
  onClose,
  userId,
  initialData,
  onSave,
}) => {
  const { showNotification } = useNotification();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      onSave(updatedUser);
      showNotification("User updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("An error occurred while updating the user.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {" "}
      <SheetContent className="bg-[#14141c] border-none">
        <SheetHeader>
          <SheetTitle className="text-white">Edit User</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-[#14141c] text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#14141c] text-gray-400">
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-[#14141c] text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#14141c] text-gray-400">
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
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

export default EditUserSheet;
