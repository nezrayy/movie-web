"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { Suspense, useEffect, useState } from "react";
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
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Textarea } from "@/components/ui/textarea";
import { Country } from "@/types/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Movie } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a valid 4-digit number"),
  country: z.string().min(1, "Country is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  movie: z.string().min(1, "Movie is required"),
});

const fetchCountries = async () => {
  const response = await fetch("/api/get-countries");
  const countries = await response.json();
  return countries;
};

const fetchMovies = async () => {
  const response = await fetch("/api/movies");
  const movies = await response.json();
  return movies;
};

// Lazy load CountriesSelect
const CountriesSelect = React.lazy(async () => ({
  default: function ({
    field,
    countries,
  }: {
    field: any;
    countries: Country[];
  }) {
    return (
      <Select value={field.value} onValueChange={field.onChange}>
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
    );
  },
}));

// Lazy load MoviesSelect
const MoviesSelect = React.lazy(async () => ({
  default: function ({ field, movies }: { field: any; movies: Movie[] }) {
    return (
      <Select value={field.value} onValueChange={field.onChange}>
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
    );
  },
}));

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
  });

  const [awards, setAwards] = useState([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [awardId, setAwardId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const fetchAwards = async () => {
    const res = await fetch("/api/awards");
    const data = await res.json();
    setAwards(data);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      if (!awardId) {
        const response = await fetch("/api/awards", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          form.reset();
          toast({
            variant: "success",
            description: "Award created successfully",
          });
        }
      }

      if (awardId) {
        const response = await fetch(`/api/awards/${awardId}`, {
          method: "PUT",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          form.reset();
          toast({
            variant: "success",
            description: "Award updated successfully",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to create award",
      });
    } finally {
      setLoading(false);
      fetchAwards();
    }
  }

  const getAwardId = () => {
    const awardId = searchParams.get("edit") || "";
    if (awardId) {
      setAwardId(parseInt(awardId));
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

  const fetchEditAwards = async (id: number) => {
    try {
      const res = await fetch(`/api/awards/${id}`);
      const data = await res.json();
      form.setValue("name", data.name || "");
      form.setValue("year", data.awardYear ? data.awardYear.toString() : "");
      form.setValue("country", data.countryId ? data.countryId.toString() : "");
      form.setValue("description", data.description || "");
      form.setValue("movie", data.movieId ? data.movieId.toString() : "");
    } catch (error) {
      console.error("Failed to fetch award details:", error);
    }
  };

  const handleUpdate = () => {
    fetchAwards();
  };

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Awards
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:w-1/4 mb-6 space-y-4"
        >
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
                  <Suspense fallback={<div>Loading countries...</div>}>
                    <CountriesSelect field={field} countries={countries} />
                  </Suspense>
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
                  <Suspense fallback={<div>Loading movies...</div>}>
                    <MoviesSelect field={field} movies={movies} />
                  </Suspense>
                </FormControl>
                <FormDescription>Select movie for this award</FormDescription>
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
  );
};

export default CMSAwards;
