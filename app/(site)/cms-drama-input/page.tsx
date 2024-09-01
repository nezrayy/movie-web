"use client"

import ImageDropzone from "@/components/image-drop-zone"
import { useState } from "react"
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
  availability: z.string().optional(),
  genres: z
    .array(z.string())
    .min(1, "At least one genre must be selected")
    .max(5, "You can select up to 5 genres"),
  actors: z.string().optional(),
  trailerLink: z
    .string()
    .url("Trailer link must be a valid URL")
    .optional(),
  award: z.string().optional(),
});

const items = [
  {
    id: "romance",
    label: "Romance",
  },
  {
    id: "scifi",
    label: "Sci-Fi",
  },
  {
    id: "adventure",
    label: "Adventure",
  },
  {
    id: "action",
    label: "Action",
  },
  {
    id: "family",
    label: "Family",
  },
  {
    id: "comedy",
    label: "Comedy",
  },
] as const

const ActorCard = ({ actorName }: { actorName: string }) => {
  return (
    <div className="flex items-start justify-between space-x-2 bg-gray-200 rounded p-2">
      <div className="flex space-x-2">
        <div className="w-12 h-16 bg-gray-400 rounded"></div>
        <span className="text-gray-700">{actorName}</span>
      </div>
      <button className="text-red-500 font-semibold p-0 leading-none">x</button>
    </div>
  )
}

const CMSDramaInputPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      alternativeTitle: "",
      year: "",
      country: "",
      synopsis: "",
      availability: "",
      genres: [],
      actors: "",
      trailerLink: "",
      award: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', 'Movie Title'); // example additional data

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Data upload successfully');
    } else {
      console.error('Failed to upload image.');
    }
  }

  const handleImageUpload = (file: File) => {
    setImageFile(file);
  };

  return (
    <div className="min-h-screen p-8 flex justify-center">
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
                      <ImageDropzone value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 focus:outline-none hidden md:block">Submit</Button>
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
                      <FormLabel className="text-white">Alternative title</FormLabel>
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
                            <SelectItem value="japan">Japan</SelectItem>
                            <SelectItem value="korea">Korea</SelectItem>
                            <SelectItem value="china">China</SelectItem>
                            <SelectItem value="thailand">Thailand</SelectItem>
                            <SelectItem value="philippines">
                              Philippines
                            </SelectItem>
                            <SelectItem value="india">India</SelectItem>
                            <SelectItem value="indonesia">Indonesia</SelectItem>
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
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Availability</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Availability"
                          className="bg-transparent text-white placeholder:text-gray-400"
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
                  name="genres"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-white">Genre</FormLabel>
                      </div>
                      {items.map((item) => (
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
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
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
                        <Input
                          placeholder="Search for actor names"
                          className="bg-transparent text-white placeholder:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-4">
                  <ActorCard actorName="Actor 1" />
                  <ActorCard actorName="Actor 2" />
                </div>
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
            <Button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 focus:outline-none block md:hidden">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CMSDramaInputPage