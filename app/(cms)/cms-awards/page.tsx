"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns";
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Country } from "@/types/type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Movie } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
 
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a valid 4-digit number"),
  country: z.string().min(1, "Country is required"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  movie: z.string().min(1, "Movie is required"),
})

const CMSAwards = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      year: "",
      name: "",
      description: "",
      movie: "",
    },
  })

  const [awards, setAwards] = useState([])
  const [countries, setCountries] = useState<Country[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [awardId, setAwardId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const fetchAwards = async () => {
    const res = await fetch("/api/awards")
    const data = await res.json()
    setAwards(data)
  }

  const fetchCountries = async () => {
    const response = await fetch("/api/get-countries");
    const countries = await response.json();
    return countries;
  }

  const fetchMovies = async () => {
    const response = await fetch("/api/movies");
    const movies = await response.json();
    return movies;
  }
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      if (!awardId) {
        const response = await fetch("/api/awards", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          form.reset()
          toast({
            variant: "success",
            description: "Award created successfully",
          })
        }
      }

      if (awardId) {
        console.log("VALUES YANG DIKIRIM", values);
        const response = await fetch(`/api/awards/${awardId}`, {
          method: "PUT",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          form.reset()
          toast({
            variant: "success",
            description: "Award updated successfully",
          })
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to create award",
      })
    } finally {
      setLoading(false)
      fetchAwards()
    }
  }

  const getAwardId = () => {
    const awardId = searchParams.get("edit") || "";
    if (awardId) {
      console.log("AWARD ID YANG MAU DIEDIT", awardId);
      setAwardId(parseInt(awardId));
    }
  }

  const fetchEditAwards = async (id: number) => {
    try {
      const res = await fetch(`/api/awards/${id}`);
      const data = await res.json();
  
      // Set nilai form yang diperoleh dari data
      form.setValue('name', data.name || '');
      form.setValue('year', data.awardYear ? data.awardYear.toString() : '');
      form.setValue('country', data.countryId ? data.countryId.toString() : '');
      form.setValue('description', data.description || '');
      form.setValue('movie', data.movieId ? data.movieId.toString() : '');
    } catch (error) {
      console.error('Failed to fetch award details:', error);
    }
  };
  
  
  useEffect(() => {
    fetchAwards();
    fetchCountries().then((countries) => {
      setCountries(countries);
    });
    fetchMovies().then((movies) => {
      setMovies(movies);
    });
  }, []);
  
  useEffect(() => {
    if (awardId !== null) {
      fetchEditAwards(awardId);
    }
  }, [awardId]);  

  useEffect(() => {
    getAwardId(); 
  }, [searchParams]);

  const handleUpdate = () => {
    fetchAwards(); // Ambil ulang data film setelah update status
  };

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:w-1/4 mb-6 space-y-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Name of Award..."
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Country</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full bg-[#0C0D11] text-gray-400">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0D11] text-white">
                      {countries.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the award..."
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
            name="movie"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Movie</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full bg-[#0C0D11] text-gray-400">
                      <SelectValue placeholder="Movie" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0D11] text-white">
                      {movies
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select movie for this award
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            disabled={loading}
          >
            {awardId ? "Update award" : "Create award"}
          </button>
        </form>
      </Form>

      <DataTable columns={columns(handleUpdate)} data={awards} filter="name" />
    </div>
  )
}

export default CMSAwards