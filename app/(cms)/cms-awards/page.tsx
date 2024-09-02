"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 
const formSchema = z.object({
  country: z.string().min(2).max(50),
  year: z.string().min(2).max(50),
  award: z.string().min(2).max(50),
})

const awardsData = [
  {
    id: 1,
    country: "Japan",
    year: '2024',
    award: "Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award",
  },
  {
    id: 2,
    country: "Japan",
    year: '2022',
    award: "Japanese Spring Drama Award",
  },
]

const CMSDrama = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      year: "",
      award: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 flex flex-col justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:w-1/4 mb-6 space-y-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Country..."
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
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Year</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Year..."
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
            name="award"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Award</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Award..."
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
          placeholder="Search awards..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Award</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awardsData.map((award, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">{index+1}</TableCell>
                <TableCell>{award.country}</TableCell>
                <TableCell>{award.year}</TableCell>
                <TableCell>{award.award}</TableCell>
                <TableCell>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Edit
                  </span>{" "}
                  |{" "}
                  <span className="text-red-600 hover:underline cursor-pointer">
                    Delete
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default CMSDrama