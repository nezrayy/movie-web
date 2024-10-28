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
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Import context notification
import { useNotification } from "@/contexts/NotificationContext";

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

  // Gunakan context notification
  const { showNotification } = useNotification();

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
      } catch (error) {
        console.error("Error fetching genres:", error);
        showNotification("Error fetching genres.", "error");
      }
    };

    fetchGenres();
  }, []);

  const filteredGenres = genresData.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (genreId: number) => {
    try {
      const response = await fetch(`/api/genres/${genreId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete country");
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
      <div className="overflow-x-auto">
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
              <TableRow key={genre.id} className="text-white">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{genre.name}</TableCell>
                <TableCell>
                  <div className="flex flex-row justify-center gap-4">
                    <Button className="bg-cyan-700 p-3 hover:bg-cyan-800 hover:text-gray-400">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(genre.id)}
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
      </div>
    </div>
  );
};

export default CMSGenre;
