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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import ImageDropzone from "@/components/image-drop-zone-sm";
import { Country } from "@prisma/client";
import { useNotification } from "@/contexts/NotificationContext";
import SheetEditActor from "@/components/sheet-edit-actor-form";
import { usePaginationContext } from "@/contexts/CMSPaginationContext";

interface Actor {
  id: number;
  name: string;
  country: string;
  birthdate: Date;
  photoUrl: string;
}

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  endYear?: number; // Optional endYear prop
}

// Schema validasi form
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  birthdate: z.date(), // Mengizinkan nilai null
  country: z.string().min(1, { message: "Country is required" }),
  image: z.any().optional(),
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
      birthdate: new Date(), // Set default ke tanggal saat ini
      country: "",
      image: undefined,
    },
  });

  // Fetch daftar aktor
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch("/api/actors");
        const data = await response.json();
        setActorsData(data);
        setTotalItems(data.length);
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    fetchActors();
  }, [setTotalItems]);

  useEffect(() => {
    setTotalItems(
      actorsData.filter((actor) =>
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).length
    );
  }, [actorsData, searchTerm, setTotalItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

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
      showNotification("Actor deleted succesfully.");
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

  const filteredActors = actorsData
    .filter((actor) =>
      actor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const onSubmit = async (values: FormValues) => {
    const selectedCountry = countriesData.find(
      (country) => country.name === values.country
    );
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append(
      "birthdate",
      new Date(values.birthdate.setUTCHours(0, 0, 0, 0)).toISOString()
    );
    formData.append(
      "countryId",
      selectedCountry ? selectedCountry.id.toString() : ""
    );
    if (values.image) {
      formData.append("image", values.image);
    }

    try {
      const response = await fetch("/api/actors", {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        showNotification("Actor already exists or invalid data.");
        return;
      }
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex space-x-4"
        >
          <div className="w-full mb-6 sm:flex sm:items-start sm:space-y-0">
            {/* Left Column - Form Fields */}
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

              <Button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Submit
              </Button>
            </div>

            {/* Right Column - Upload Image */}
            <div className="w-full sm:w-1/4 ml-0">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="pt-8">
                        <ImageDropzone
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>

      {/* Filter Section */}
      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <Input
          type="text"
          placeholder="Search actor..."
          className="bg-transparent text-gray-400 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableHead className="w-36 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActors.map((actor, index) => (
              <TableRow key={actor.id} className="text-white hover:bg-muted/5">
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>{" "}
                <TableCell>{actor.name}</TableCell>
                <TableCell>{actor.country?.name}</TableCell>
                <TableCell>
                  {actor.birthdate
                    ? new Date(actor.birthdate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <img
                    src={actor.photoUrl || "/actor-default.png"}
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
            ))}
          </TableBody>
        </Table>
        <SheetEditActor
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            window.location.reload(); // Refresh halaman setelah dialog ditutup
          }}
          actorData={selectedActor}
          onSave={handleSave}
        />
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

export default CMSActor;
