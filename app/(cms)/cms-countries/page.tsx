"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Country } from "@prisma/client";
import { useNotification } from "@/contexts/NotificationContext";
import { useEditFormContext } from "@/contexts/EditFormContext";
import { usePaginationContext } from "@/contexts/CMSPaginationContext";
import SheetEditForm from "@/components/sheet-edit-form";

const formSchema = z.object({
  country: z.string().min(2).max(50),
  code: z.string().min(2).max(3).toUpperCase(),
});

const CMSCountries = () => {
  const [countriesData, setCountriesData] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showNotification } = useNotification();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State untuk refresh data
  const { openEditForm, closeEditForm, isOpen } = useEditFormContext();
  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    totalItems,
    setTotalItems,
  } = usePaginationContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      code: "",
    },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        const data = await response.json();
        setCountriesData(data);
        setTotalItems(data.length);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [refreshTrigger, setTotalItems]); // Tambahkan refreshTrigger sebagai dependency

  // Handle ketika dialog ditutup
  useEffect(() => {
    if (!isOpen && refreshTrigger) {
      window.location.reload();
    }
  }, [isOpen, refreshTrigger]);

  useEffect(() => {
    // Reset current page to 1 whenever searchTerm changes
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

  const handleDelete = async (countryId: number) => {
    try {
      const response = await fetch(`/api/countries/${countryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.message);
        showNotification(errorData.message);
        return;
      }

      setCountriesData((prevData) =>
        prevData.filter((country) => country.id !== countryId)
      );
      showNotification("Country deleted successfully.");
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.country,
          code: values.code,
        }),
      });

      console.log("Response status:", response.status); // Tambahkan ini untuk debugging
      const responseData = await response.json();
      console.log("Response data:", responseData); // Debug respons lengkap

      if (response.status === 400) {
        showNotification(responseData.message || "Country already exists.");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to create country");
      }

      const newCountry = responseData;
      setCountriesData((prevData) => [...prevData, newCountry]);
      showNotification("Country added successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating country:", error);
      showNotification("An error occurred while creating country.");
    }
  };

  const handleEdit = (country: Country) => {
    openEditForm("country", country);
  };

  const filteredCountries = countriesData
    .filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:w-1/4 mb-6 space-y-4"
        >
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter country..."
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Country Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter country code..."
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

      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <Input
          type="text"
          placeholder="Search country..."
          className="bg-transparent text-gray-400 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="w-36 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map((country, index) => (
              <TableRow
                key={country.id}
                className="text-white hover:bg-muted/5"
              >
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.code}</TableCell>
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
                        onClick={() => handleEdit(country)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(country.id)}
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

export default CMSCountries;
