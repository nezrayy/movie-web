"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns";
import { useEffect, useState } from "react"
 
const formSchema = z.object({
  country: z.string().min(2).max(50),
  year: z.string().min(2).max(50),
  award: z.string().min(2).max(50),
})

const CMSAwards = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      year: "",
      award: "",
    },
  })

  const [awards, setAwards] = useState([])

  const fetchAwards = async () => {
    const res = await fetch("/api/awards")
    const data = await res.json()
    setAwards(data)
  }

  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  
  useEffect(() => {
    fetchAwards()
  }, [])
  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
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

      <DataTable columns={columns} data={awards} filter="name" />
    </div>
  )
}

export default CMSAwards