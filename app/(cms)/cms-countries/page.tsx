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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  country: z.string().min(2).max(50),
  code: z.string().min(2).max(3).toUpperCase(),
});

const CMSCountries = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      code: "",
    },
  });

  // Fetch daftar negara saat komponen dimuat
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

  const handleDelete = async (countryId: number) => {
    try {
      const response = await fetch(`/api/countries/${countryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete country");
        return;
      }

      // Perbarui state untuk menghapus negara dari daftar
      setCountriesData((prevData) =>
        prevData.filter((country) => country.id !== countryId)
      );
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.country,
          code: values.code, // Gunakan code dari input
        }),
      });

      if (!response.ok) {
        // Jika negara sudah ada, tampilkan pesan kesalahan
        if (response.status === 400) {
          setDialogMessage("Country already exists");
        } else {
          setDialogMessage("Failed to create country");
        }
        setDialogOpen(true);
        return;
      }

      const newCountry = await response.json();
      setDialogMessage("Country added successfully!");
      setDialogOpen(true);
      form.reset(); // Reset form setelah berhasil
    } catch (error) {
      console.error("Error creating country:", error);
      setDialogMessage("Internal server error");
      setDialogOpen(true);
    }
  }

  const filteredCountries = countriesData.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

      {/* Filter Section */}
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="w-36 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map((country, index) => (
              <TableRow
                key={country.id}
                className="text-white hover:bg-muted/5"
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{country.name}</TableCell>
                <TableCell>
                  <div className="flex flex-row justify-center gap-4">
                    <Button className="bg-cyan-700 p-3 hover:bg-cyan-800 hover:text-gray-400">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(country.id)} // Panggil handleDelete dengan country.id
                      className="bg-red-600 p-3 hover:bg-red-900 hover:text-gray-400"
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
      {/* Dialog untuk menampilkan pesan */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#14141c] w-96 border-gray-700">
          <DialogHeader className="text-white">
            <DialogTitle>Notification</DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              className="bg-red-600 hover:bg-red-800 w-16"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSCountries;
