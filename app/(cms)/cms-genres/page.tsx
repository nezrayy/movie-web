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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

const formSchema = z.object({
  country: z.string().min(2).max(50),
  year: z.string().min(2).max(50),
  genre: z.string().min(2).max(50),
});

const genresData = [
  {
    id: 1,
    genre: "Romance",
  },
  {
    id: 2,
    genre: "Thriller",
  },
];

const CMSGenre = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
            name="country"
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
        <input
          type="text"
          placeholder="Search genre..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="w-32 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genresData.map((genre, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{genre.genre}</TableCell>
                <TableCell>
                  <div className="flex flex-row justify-center">
                    <Button className="bg-transparent p-3 hover:bg-transparent hover:text-gray-400">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button className="bg-transparent p-3 hover:bg-transparent hover:text-gray-400">
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
