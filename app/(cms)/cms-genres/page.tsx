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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useEditFormContext } from "@/contexts/EditFormContext";
import SheetEditForm from "@/components/sheet-edit-form";
import { usePaginationContext } from "@/contexts/CMSPaginationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Genre {
  id: number;
  name: string;
}

const formSchema = z.object({
  genre: z.string().min(2).max(50),
});

const CMSGenre = () => {
  const [genresData, setGenresData] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showNotification } = useNotification();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State untuk refresh data
  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    totalItems,
    setTotalItems,
  } = usePaginationContext();

  const { openEditForm, isOpen } = useEditFormContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: "",
    },
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        if (!response.ok) throw new Error("Failed to fetch genres");
        const data = await response.json();
        setGenresData(data);
        setTotalItems(data.length);
      } catch (error) {
        console.error("Error fetching genres:", error);
        showNotification("Error fetching genres.");
      }
    };

    fetchGenres();
  }, [refreshTrigger, setTotalItems]);

  // Handle ketika dialog ditutup
  useEffect(() => {
    if (!isOpen && refreshTrigger) {
      window.location.reload();
    }
  }, [isOpen, refreshTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

  // Filter data yang akan ditampilkan di tabel berdasarkan pagination
  const filteredGenres = genresData
    .filter((genre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (genre: Genre) => {
    openEditForm("genre", genre);
  };

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

  const handleDelete = async (genreId: number) => {
    try {
      const response = await fetch(`/api/genres/${genreId}`, {
        method: "DELETE",
      });

      const errorData = await response.json();
      if (!response.ok) {
        console.error(errorData.message);
        showNotification(errorData.message);
        return;
      }

      // Perbarui state untuk menghapus negara dari daftar
      setGenresData((prevData) =>
        prevData.filter((genre) => genre.id !== genreId)
      );
    } catch (error) {
      console.error("Error deleting genre:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.genre,
        }),
      });

      if (!response.ok) {
        showNotification("Failed to create genre. It may already exist.");
        return;
      }

      const newGenre = await response.json();
      // Tambahkan genre baru ke genresData
      setGenresData((prevData) => [...prevData, newGenre]);
      showNotification("Genre added successfully!");

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error creating genre:", error);
      showNotification("An error occurred while creating genre.");
    }
  }

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:w-1/4 mb-6 space-y-4"
        >
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Genre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter genre..."
                    className="bg-transparent text-white placeholder:text-gray-400"
                    {...field}
                  />
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
      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <Input
          type="text"
          placeholder="Search genre..."
          className="bg-transparent text-gray-400 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto outline outline-1 rounded-md text-white">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="w-32 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGenres.map((genre, index) => (
              <TableRow key={genre.id} className="text-white" data-testid="row">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{genre.name}</TableCell>
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
                        onClick={() => handleEdit(genre)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(genre.id)}
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
        <SheetEditForm onClose={() => window.location.reload()} />
      </div>
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

export default CMSGenre;
