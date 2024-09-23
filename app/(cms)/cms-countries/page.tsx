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

const formSchema = z.object({
  country: z.string().min(2).max(50),
});
const countriesData = [
  {
    id: 1,
    country: "Japan",
  },
  {
    id: 2,
    country: "Indonesia",
  },
  {
    id: 3,
    country: "United States",
  },
  {
    id: 4,
    country: "England",
  },
];

const CMSCountries = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
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
          placeholder="Search country..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
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
            {countriesData.map((country, index) => (
              <TableRow key={index} className="text-white hover:bg-muted/5">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{country.country}</TableCell>
                <TableCell>
                  <div className="flex flex-row justify-center gap-4">
                    <Button className="bg-cyan-700 p-3 hover:bg-cyan-800 hover:text-gray-400">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button className="bg-red-800 p-3 hover:bg-red-900 hover:text-gray-400">
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

export default CMSCountries;
