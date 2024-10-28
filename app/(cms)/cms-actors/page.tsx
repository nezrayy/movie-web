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

// Tipe data untuk aktor
interface Actor {
  id: number;
  name: string;
  country: string;
  birthdate: Date;
  photo_url: string;
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
  const onSubmit = (values: FormValues) => {
    console.log(values);
    // Implementasi logika untuk menambahkan atau memperbarui aktor
    const newActor: Actor = {
      id: actors.length + 1,
      name: values.name,
      country: values.country,
      birthdate: values.birthdate,
      photo_url: values.image ? URL.createObjectURL(values.image as Blob) : "",
    };
    setActors([...actors, newActor]);
    form.reset();
  };

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

  // const filteredActors = actors.filter((actor) =>
  //   actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex space-x-4"
        >
          {/* Left Column */}
          <div className="w-full mb-6 sm:w-1/4 space-y-4">
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

            <Controller
              name="birthdate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Birthdate</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      placeholderText="Select birthdate"
                      className="bg-transparent text-white placeholder:text-gray-400"
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-transparent text-gray-400 placeholder:text-gray-400">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#21212E] text-gray-400">
                        <SelectItem value="Indonesia">Indonesia</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
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
          <div className="w-full sm:w-1/3 space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-white">Upload Image</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      {/* Filter Section */}
      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <input
          type="text"
          placeholder="Search actor..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
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
            {actorsData.map((actor, index) => (
              <TableRow key={actor.id} className="text-white hover:bg-muted/5">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{actor.name}</TableCell>
                <TableCell>{actor.country.name}</TableCell>
                <TableCell>{actor.birthdate?.toLocaleDateString()}</TableCell>
                <TableCell>{actor.photo_url ? "Yes" : "No"}</TableCell>
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
