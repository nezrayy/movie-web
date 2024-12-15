"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePicker } from "@/components/ui/datepicker";
import { MoreHorizontal } from "lucide-react";
import { Country } from "@prisma/client";
import { useNotification } from "@/contexts/NotificationContext";
import SheetEditActor from "@/components/sheet-edit-actor-form";
import { usePaginationContext } from "@/contexts/CMSPaginationContext";

export type Actor = {
  id: number;
  name: string;
  birthdate: string; // Selalu string dari API
  country: { id: number; name: string }; // Country harus ada
  photoUrl: string;
};

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

const CMSActor: React.FC = () => {
  const [actorsData, setActorsData] = useState<Actor[]>([]);
  const [countriesData, setCountriesData] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showNotification } = useNotification();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    totalItems,
    setTotalItems,
  } = usePaginationContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthdate: new Date(),
      country: "",
      photoUrl: "",
    },
  });

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch(
          `/api/actors?search=${searchTerm}&page=${currentPage}&itemsPerPage=${itemsPerPage}`
        );
        const data = await response.json();

        console.log("Fetched Data:", data); // Log data yang diterima
        setActorsData(data.actors); // Memuat data actor untuk halaman tersebut
        setTotalItems(data.total); // Total actor untuk pagination
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    fetchActors();
  }, [searchTerm, currentPage, itemsPerPage]);

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

  const handleEdit = (actor: Actor) => {
    setSelectedActor(actor);
    setIsEditOpen(true);
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

  const handleDelete = async (actorId: number) => {
    try {
      const response = await fetch(`/api/actors/${actorId}`, {
        method: "DELETE",
      });

      const errorData = await response.json();
      if (!response.ok) {
        showNotification(errorData.message);
        return;
      }

      setActorsData((prevData) =>
        prevData.filter((actor) => actor.id !== actorId)
      );
      showNotification("Actor deleted successfully.");
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  const handleSave = (updatedActor: Actor) => {
    setActorsData((prevActors) =>
      prevActors.map((actor) =>
        actor.id === updatedActor.id ? updatedActor : actor
      )
    );
    showNotification("Actor updated successfully!");
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value); // Perbarui kata kunci pencarian
    setCurrentPage(1); // Reset halaman ke awal
  };  

  const onSubmit = async (values: FormValues) => {
    const selectedCountry = countriesData.find(
      (country) => country.name === values.country
    );

    if (!selectedCountry) {
      showNotification("Please select a valid country.");
      return;
    }

    const actorData = {
      name: values.name,
      birthdate: values.birthdate.toISOString(),
      countryId: selectedCountry.id,
      photoUrl: values.photoUrl,
    };

    try {
      const response = await fetch("/api/actors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actorData),
      });

      if (!response.ok) {
        throw new Error("Failed to create actor");
      }

      const newActor = await response.json();
      setActorsData((prev) => [...prev, newActor]);
      showNotification("Actor added successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating actor:", error);
      showNotification("An error occurred while creating actor.");
    }
  };

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Actors
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex space-x-4"
        >
          <div className="w-full mb-6 sm:flex sm:items-start sm:space-y-0">
            <div className="w-full sm:w-1/4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Actor Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter actor name..."
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Country</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-transparent text-gray-400 placeholder:text-gray-400">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-gray-400">
                          {countriesData.map((country) => (
                            <SelectItem key={country.id} value={country.name}>
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
                        placeholder="Enter photo URL..."
                        className="bg-transparent text-white placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <Input
          type="text"
          placeholder="Search actor..."
          className="bg-transparent text-gray-400 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto outline outline-1 rounded-md text-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Birthdate</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead className="w-36 text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actorsData && actorsData.length > 0 ? (
              actorsData.map((actor, index) => (
                <TableRow
                  key={actor.id}
                  className="text-white hover:bg-muted/5"
                >
                  <TableCell className="font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>{" "}
                  <TableCell>{actor.name}</TableCell>
                  <TableCell>{actor.country?.name}</TableCell>
                  <TableCell>
                    {actor.birthdate
                      ? new Date(actor.birthdate).toLocaleDateString("en-US") // Format MM/DD/YYYY
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <img
                      src={
                        isValidImageUrl(actor.photoUrl)
                          ? actor.photoUrl
                          : "/actor-default.png"
                      }
                      alt="Actor"
                      className="w-16 h-20 object-cover rounded"
                    />
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
                          onClick={() => handleEdit(actor)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer"
                          onClick={() => handleDelete(actor.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data available or wait a moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedActor && (
          <SheetEditActor
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            actorData={selectedActor}
            onSave={handleSave}
          />
        )}
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

export default CMSActor;
