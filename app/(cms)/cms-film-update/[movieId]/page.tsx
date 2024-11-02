"use client"

import ImageDropzone from "@/components/image-drop-zone"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Availability, Country, Genre } from "@/types/type"
import { ActorSearch } from "@/components/actor-search"
import { useSession } from "next-auth/react"
import { redirect, useParams, useRouter } from "next/navigation"

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
 
const formSchema = z.object({
  image: z
    .any()
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  title: z.string().min(1, "Title is required"),
  alternativeTitle: z.string().optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a valid 4-digit number"),
  country: z.string().min(1, "Country is required"),
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters long"),
  availabilities: z
    .array(z.string())
    .min(1, "At least one availability must be selected")
    .max(4, "You can select up to 4 availabilities"),
  genres: z
    .array(z.string())
    .min(1, "At least one genre must be selected")
    .max(7, "You can select up to 7 genres"),
  actors: z
    .array(z.number())
    .min(1, "At least one actor must be selected")
    .max(9, "You can select up to 9 actors"),
  trailerLink: z
    .string()
    .url("Trailer link must be a valid URL"),
  award: z.string().optional(),
});

const CMSDramaUpdatePage = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession();
  const params = useParams<{ movieId: string }>(); 
  const movieId = params.movieId;
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      alternativeTitle: "",
      year: "",
      country: "",
      synopsis: "",
      availabilities: [],
      genres: [],
      actors: [],
      trailerLink: "",
      award: "",
    },
  })

  const { reset } = form;
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let base64String = null;
      let fileName = null;
  
      if (values.image) {
        const file = values.image;
  
        // Baca file dan konversi ke base64 hanya jika ada file baru
        const reader = new FileReader();
        reader.readAsDataURL(file);
  
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            base64String = reader.result;
            fileName = file.name;
            resolve(null);
          };
          reader.onerror = reject;
        });
      }
  
      // Persiapkan payload data untuk dikirim ke backend
      const payload: any = {
        id: movieId, // Mengirim id dari movie
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
      };
  
      // Tambahkan field image jika ada file baru
      if (base64String && fileName) {
        payload.image = base64String;
        payload.fileName = fileName;
      }
  
      // Kirim data ke API backend
      console.log("Payload:", payload);
      const response = await fetch(`/api/movies/${movieId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Something went wrong while uploading the image and saving movie data.");
      }
  
      const responseData = await response.json();
      console.log("Upload Movie Response", responseData);
    } catch (error) {
      console.error("Upload Error", error);
    } finally {
      setIsLoading(false);
      router.push("/cms-films")
    }
  }

  const fetchMovieDetails = async (movieId: string) => {
    const response = await fetch(`/api/get-movie-details/${movieId}`);
    const movie = await response.json();
    return movie;
  }

  const fetchGenres = async () => {
    const response = await fetch("/api/get-genres");
    const genres = await response.json();
    return genres;
  }

  const fetchAvailabilities = async () => {
    const response = await fetch("/api/get-availabilities");
    const availabilities = await response.json();
    return availabilities;
  }

  const fetchCountries = async () => {
    const response = await fetch("/api/get-countries");
    const countries = await response.json();
    return countries;
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch genres, availabilities, and countries in parallel
        const [genres, availabilities, countries, movieDetails] = await Promise.all([
          fetchGenres(),
          fetchAvailabilities(),
          fetchCountries(),
          fetchMovieDetails(movieId),
        ]);
  
        setGenres(genres);
        setAvailabilities(availabilities);
        setCountries(countries);
        setMovieDetails(movieDetails);
  
        if (movieDetails) {
          reset({
            image: movieDetails.posterUrl ?? "",
            title: movieDetails.title ?? "",
            alternativeTitle: movieDetails.alternativeTitle ?? "",
            year: movieDetails.releaseYear?.toString() ?? "",
            country: movieDetails.countryId?.toString() ?? "",
            synopsis: movieDetails.synopsis ?? "",
            availabilities: movieDetails.availabilities
              ? movieDetails.availabilities.map((a: any) => a.availability?.id?.toString() ?? "")
              : [],
            genres: movieDetails.genres
              ? movieDetails.genres.map((g: any) => g.genre?.id?.toString() ?? "")
              : [],
            actors: movieDetails.actors
              ? movieDetails.actors.map((a: any) => a.actor?.id ?? 0)
              : [],
            trailerLink: movieDetails.linkTrailer ?? "",
            award: movieDetails.award?.id?.toString() ?? "",
          });
          console.log("MOVIE DETAILS", movieDetails)
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
  
    fetchInitialData();
  }, [movieId, reset]);
  

  return (
    <div className="flex flex-col w-full h-full p-8 justify-center items-center">
      {movieDetails && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-[#0C0D11] p-6 rounded-lg shadow-md w-full max-w-4xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-white">Upload Image</FormLabel>
                    <FormControl>
                      <ImageDropzone
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file); // Update field di form
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 focus:outline-none hidden md:block"
                  disabled={isLoading}
                >
                  Submit
                </Button>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <FormLabel className="text-white">Alternative title (Optional)</FormLabel>
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

                <div className="col-span-1">
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
                </div>

                <div className="col-span-1">
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
                </div>

                <div className="col-span-2">
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

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="availabilities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-white">Availabilities</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {availabilities.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="availabilities"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 text-white"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        className="border-white"
                                        checked={field.value?.includes(item.id.toString())}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.id.toString()])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== item.id.toString())
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="genres"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-white">Genre</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {genres.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="genres"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 text-white"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        className="border-white"
                                        checked={field.value?.includes(item.id.toString())}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.id.toString()])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== item.id.toString())
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="actors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Add Actors (Up to 9)</FormLabel>
                        <FormControl>
                          <ActorSearch 
                            control={form.control} 
                            field={field} 
                            defaultValues={movieDetails.actors ? movieDetails.actors.map((a) => ({ id: a.actor?.id, name: a.actor?.name })) : []} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
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

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="award"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Award</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full bg-[#0C0D11] text-gray-400">
                              <SelectValue placeholder="Award" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0C0D11] text-white">
                              <SelectItem value="japan-award">Japan Award</SelectItem>
                              <SelectItem value="korea-award">Korea Award</SelectItem>
                              <SelectItem value="china-award">China Award</SelectItem>
                              <SelectItem value="thailand-award">Thailand Award</SelectItem>
                              <SelectItem value="philippines-award">
                                Philippines Award
                              </SelectItem>
                              <SelectItem value="india-award">India Award</SelectItem>
                              <SelectItem value="indonesia-award">Indonesia Award</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 focus:outline-none block md:hidden"
                disabled={isLoading}
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default CMSDramaUpdatePage