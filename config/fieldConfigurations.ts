import { z, ZodSchema } from "zod";

export const formConfigurations = {
  country: [
    { name: "name", type: "text", label: "Country Name", placeholder: "Enter country name", validation: z.string().min(2).max(50) },
    { name: "code", type: "text", label: "Country Code", placeholder: "Enter country code", validation: z.string().min(2).max(3).toUpperCase() },
  ],
  genre: [
    { name: "name", type: "text", label: "Genre Name", placeholder: "Enter genre name", validation: z.string().min(2).max(50) },
  ],
  actor: [
    { name: "name", type: "text", label: "Actor Name", placeholder: "Enter actor name", validation: z.string().min(1, { message: "Name is required" }) },
    { name: "birthdate", type: "date", label: "Birthdate", placeholder: "Select birthdate", validation: z.date() },
    { name: "countryId", type: "select", label: "Country", placeholder: "Select country", validation: z.number().min(1, { message: "Country is required" }) },
    { name: "photoUrl", type: "file", label: "Photo", placeholder: "Upload photo", validation: z.any().optional() },
  ],
};

export type EntityTypes = keyof typeof formConfigurations;
