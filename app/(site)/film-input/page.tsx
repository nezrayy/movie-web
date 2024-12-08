"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Availability, Country, Genre } from "@/types/type";
import { ActorSearch } from "@/components/actor-search";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const isValidImageUrl = (url: string) => {
  try {
    // Cek apakah URL adalah path lokal (dimulai dengan "/")
    if (url.startsWith("/")) {
      // Periksa apakah path diakhiri dengan ekstensi gambar yang valid
      const path = url.toLowerCase();
      return (
        path.endsWith(".jpg") || path.endsWith(".png") || path.endsWith(".jpeg")
      );
    } else {
      // Jika URL penuh, buat objek URL untuk memisahkan path dan query
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.toLowerCase();
      return (
        path.endsWith(".jpg") || path.endsWith(".png") || path.endsWith(".jpeg")
      );
    }
  } catch (error) {
    // Jika URL tidak valid
    return false;
  }
};

const formSchema = z.object({
  posterUrl: z
    .string()
    .url({ message: "Valid URL is required" })
    .refine((url) => isValidImageUrl(url), {
      message: "The URL must point to a valid image (.jpg, .png, .jpeg)",
    })
    .optional(),
  title: z.string().min(1, "Title is required"),
  alternativeTitle: z.string().optional(),
  year: z.string().regex(/^\d{4}$/, "Year must be a valid 4-digit number"),
  country: z.string().min(1, "Country is required"),
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters long"),
  availabilities: z
    .array(z.string())
    .min(1, "At least one availability must be selected")
    .max(5, "You can select up to 5 availabilities"),
  genres: z
    .array(z.string())
    .min(1, "At least one genre must be selected")
    .max(7, "You can select up to 7 genres"),
  actors: z
    .array(z.number())
    .min(1, "At least one actor must be selected")
    .max(9, "You can select up to 9 actors"),
  trailerLink: z.string().url("Trailer link must be a valid URL"),
});

const CMSDramaInputPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      posterUrl: "",
      title: "",
      alternativeTitle: "",
      year: "",
      country: "",
      synopsis: "",
      availabilities: [],
      genres: [],
      actors: [],
      trailerLink: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("VALUES", values);
    try {
      const response = await fetch("/api/movies/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          posterUrl: values.posterUrl,
          title: values.title,
          alternativeTitle: values.alternativeTitle,
          releaseYear: values.year,
          synopsis: values.synopsis,
          linkTrailer: values.trailerLink,
          createdById: session?.user.id,
          countryId: values.country,
          genres: values.genres,
          actors: values.actors,
          availabilities: values.availabilities,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong while saving movie data.");
      }

      const responseData = await response.json();
      console.log("Upload Movie Response", responseData);
      toast({
        variant: "success",
        description: "New movie has been added",
      });
      router.push("/cms-films");
    } catch (error) {
      console.error("Upload Error", error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchGenres = async () => {
    const response = await fetch("/api/get-genres");
    const genres = await response.json();
    return genres;
  };

  const fetchAvailabilities = async () => {
    const response = await fetch("/api/get-availabilities");
    const availabilities = await response.json();
    return availabilities;
  };

  const fetchCountries = async () => {
    const response = await fetch("/api/get-countries");
    const countries = await response.json();
    return countries;
  };

  useEffect(() => {
    fetchGenres().then((genres) => {
      setGenres(genres);
    });
    fetchAvailabilities().then((availabilities) => {
      setAvailabilities(availabilities);
    });
    fetchCountries().then((countries) => {
      setCountries(countries);
    });
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-8 justify-center items-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Input Film
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-[#0C0D11] p-6 rounded-lg shadow-md w-full max-w-4xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title"
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
                  name="alternativeTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Alternative Title (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Alternative title"
                          className="bg-transparent text-white placeholder:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Year</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Year"
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
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
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
              </div>
              <FormField
                control={form.control}
                name="posterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Poster URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter poster URL..."
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
                name="synopsis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Synopsis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Synopsis"
                        className="bg-[#0C0D11] placeholder:text-gray-400 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
  
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="availabilities"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white mb-4">
                      Availabilities (Up to 5)
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {availabilities.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="availabilities"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 text-white">
                              <FormControl>
                                <Checkbox
                                  className="border-white"
                                  checked={field.value?.includes(
                                    item.id.toString()
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id.toString(),
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) =>
                                              value !== item.id.toString()
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel>{item.name}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
  
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="genres"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white mb-4">
                      Genres (Up to 7)
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {genres.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="genres"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 text-white">
                              <FormControl>
                                <Checkbox
                                  className="border-white"
                                  checked={field.value?.includes(
                                    item.id.toString()
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id.toString(),
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) =>
                                              value !== item.id.toString()
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel>{item.name}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
  
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="actors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white mb-4">
                      Add Actors (Up to 9)
                    </FormLabel>
                    <FormControl>
                      <ActorSearch control={form.control} field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
  
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="trailerLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Link Trailer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Link trailer"
                        className="bg-transparent text-white placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
  
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full mt-6 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 focus:outline-none"
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
  
};

export default CMSDramaInputPage;
