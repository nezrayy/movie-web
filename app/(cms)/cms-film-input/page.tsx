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
import { redirect } from "next/navigation"

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
 
const formSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
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

const CMSDramaInputPage = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession();

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
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // try {
    //   const file = values.image;
  
    //   // Baca file dan konversi ke base64
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
  
    //   reader.onload = async () => {
    //     const base64String = reader.result;
  
    //     // Kirim file base64 ke API backend
    //     const response = await fetch('/api/movies/upload', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         image: base64String,
    //         fileName: file.name,
    //       }),
    //     });
  
    //     if (!response.ok) {
    //       throw new Error('Something went wrong while uploading the image.');
    //     }
  
    //     const responseData = await response.json();
    //     console.log('Upload Image Response', responseData);
    //   };
  
    //   reader.onerror = (error) => {
    //     console.error('Error reading file:', error);
    //   };
    // } catch (error) {
    //   console.error('Upload Error', error);
    // }
    setIsLoading(true)
    console.log("VALUES", values)
    try {
      const file = values.image;
  
      // Baca file dan konversi ke base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = async () => {
        const base64String = reader.result;
  
        // Kirim data ke API backend
        const response = await fetch('/api/movies/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64String,
            fileName: file.name,
            title: values.title,
            alternativeTitle: values.alternativeTitle,
            releaseYear: values.year,
            synopsis: values.synopsis,
            linkTrailer: values.trailerLink,
            createdById: session?.user.id, // Pastikan ini adalah ID user
            countryId: values.country, // Ambil ID negara dari nama negara
            genres: values.genres, // Ambil array ID genres dari nama genres
            actors: values.actors, // Ambil array ID actors dari nama actors
            availabilities: values.availabilities, // Ini seharusnya ID availabilities jika sudah valid
          }),
        });
  
        if (!response.ok) {
          throw new Error('Something went wrong while uploading the image and saving movie data.');
        }
  
        const responseData = await response.json();
        console.log('Upload Movie Response', responseData);
      };
  
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    } catch (error) {
      console.error('Upload Error', error);
    } finally {
      setIsLoading(false)
      redirect('/cms-films')
    }
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
                        <ActorSearch control={form.control} field={field} />
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
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CMSDramaInputPage