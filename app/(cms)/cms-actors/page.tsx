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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePicker } from "@/components/ui/datepicker";
import { Pencil, Trash2 } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import ImageDropzone from "@/components/image-drop-zone-sm";
import { Country } from "@prisma/client";

// Tipe data untuk aktor
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
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    fetchActors();
  }, []);

  // Fetch daftar negara
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

  // const handleDelete = (id: number) => {
  //   setActors(actors.filter((actor) => actor.id !== id));
  // };

  // const handleEdit = (actor: Actor) => {
  //   // Konversi tipe untuk mencocokkan dengan expectasi form
  //   form.reset({
  //     name: actor.name,
  //     country: actor.country,
  //     birthdate: actor.birthdate,
  //     image: undefined, // Anda mungkin perlu menangani ini secara berbeda tergantung pada kebutuhan
  //   });
  // };

  const filteredActors = actorsData.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: FormValues) => {
    const selectedCountry = countriesData.find(
      (country) => country.name === values.country
    );
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("birthdate", new Date(values.birthdate.setUTCHours(0, 0, 0, 0)).toISOString()); // Set to UTC
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
      const newActor = await response.json();
      setActorsData((prev) => [...prev, newActor]);
      form.reset();
    } catch (error) {
      console.error("Error creating actor:", error);
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
      <div className="overflow-x-auto">
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
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{actor.name}</TableCell>
                <TableCell>{actor.country}</TableCell>
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
                  <div className="flex flex-row justify-center gap-4">
                    <Button
                      className="bg-cyan-700 p-3 hover:bg-cyan-800 hover:text-gray-400"
                      onClick={() => handleEdit(actor)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-red-800 p-3 hover:bg-red-900 hover:text-gray-400"
                      onClick={() => handleDelete(actor.id)}
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

export default CMSActor;
