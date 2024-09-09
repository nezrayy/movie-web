"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import "@smastrom/react-rating/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  username: z.string().min(2, "Username harus minimal 2 karakter").max(50),
  email: z
    .string()
    .email("Masukkan email yang valid")
    .min(2, "Email harus minimal 2 karakter")
    .max(50),
  role: z.string().min(2, "Role harus minimal 2 karakter").max(50),
});

const usersData = [
  {
    id: 1,
    username: "John",
    role: "Writer",
    email: "john@mail.com",
  },
  {
    id: 2,
    username: "Doe",
    role: "Admin",
    email: "doe@mail.com",
  },
];

const CMSUsers = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:w-1/4 mb-6 space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter username..."
                    className="bg-transparent text-white placeholder:text-gray-400"
                    {...field}
                  />
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
                  <Input
                    type="email"
                    placeholder="Enter email..."
                    className="bg-transparent text-white placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Role</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="bg-transparent text-gray-400 placeholder:text-gray-400">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#14141E] text-gray-400">
                      <SelectItem value="available">Writer</SelectItem>
                      <SelectItem value="unavailable">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Submit
          </button>
        </form>
      </Form>
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">Shows</span>
            <select className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search user..."
              className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData.map((user, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="text-green-600 hover:underline cursor-pointer">
                    Send first email
                  </span>{" "}
                  |{" "}
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Rename
                  </span>{" "}
                  |{" "}
                  <span className="text-red-600 hover:underline cursor-pointer">
                    Delete
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CMSUsers;
