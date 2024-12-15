"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@smastrom/react-rating/style.css";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import EditUserSheet from "@/components/sheet-edit-user-form";
import { usePaginationContext } from "@/contexts/CMSPaginationContext";

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
  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    totalItems,
    setTotalItems,
  } = usePaginationContext();

  const onPageChange = (direction: "next" | "prev") => {
    if (
      direction === "next" &&
      currentPage < Math.ceil(totalItems / itemsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsersData(data);
        setTotalItems(data.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [setTotalItems]);

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

  useEffect(() => {
    // Reset current page to 1 whenever searchTerm changes
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

  const filteredUsers = usersData.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Users
        </h1>
      </div>
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
      <div className="overflow-x-auto outline outline-1 rounded-md text-white">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead className="w-auto">Username</TableHead>
              <TableHead className="w-auto">Email</TableHead>
              <TableHead className="w-auto">Role</TableHead>
              <TableHead className="w-auto">Status</TableHead>
              <TableHead className="w-20 text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id} className="text-white">
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      user.status === "ACTIVE"
                        ? "text-green-400" // Warna hijau untuk ACTIVE
                        : user.status === "SUSPENDED"
                        ? "text-red-500" // Warna merah untuk SUSPENDED
                        : "text-gray-400" // Warna default untuk status lain
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex justify-center">
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedUser && (
          <EditUserSheet
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              window.location.reload(); // Refresh halaman setelah dialog ditutup
            }}
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
      {/* Pagination Buttons */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange("next")}
          disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CMSUsers;
