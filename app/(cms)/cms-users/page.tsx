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
import { Input } from "@/components/ui/input";
import "@smastrom/react-rating/style.css";
import { MailCheck, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import EditUserSheet from "@/components/sheet-edit-user-form";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

const formSchema = z.object({
  username: z.string().min(2, "Username harus minimal 2 karakter").max(50),
  email: z
    .string()
    .email("Masukkan email yang valid")
    .min(2, "Email harus minimal 2 karakter")
    .max(50),
  role: z.string().min(2, "Role harus minimal 2 karakter").max(50),
});

const CMSUsers = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showNotification } = useNotification();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
    },
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete user");
        showNotification("Failed to delete user.");
        return;
      }

      setUsersData((prevData) => prevData.filter((user) => user.id !== userId));
      showNotification("User deleted succesfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = usersData.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      {/* Filter and Search Section */}
      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <div className="w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search user..."
            className="bg-transparent text-gray-400 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-36">Role</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-40 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id} className="text-white">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <div className="flex flex-row justify-center gap-4">
                    <Button className="bg-green-700 p-3 hover:bg-green-800 hover:text-gray-400">
                      <MailCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleEdit(user)}
                      className="bg-cyan-700 p-3 hover:bg-cyan-800 hover:text-gray-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(user.id)} // Panggil handleDelete dengan country.id
                      className="bg-red-800 p-3 hover:bg-red-900 hover:text-gray-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedUser && (
          <EditUserSheet
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            userId={selectedUser.id}
            initialData={{
              role: selectedUser.role,
              status: selectedUser.status,
            }}
            onSave={(updatedUser) => {
              // Fungsi yang menangani logika setelah user diperbarui
              setUsersData((prevData) =>
                prevData.map((user) =>
                  user.id === updatedUser.id ? updatedUser : user
                )
              );
              showNotification("User updated successfully!");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CMSUsers;
