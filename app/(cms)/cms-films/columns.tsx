"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type Film = {
  id: number;
  title: string;
  releaseYear: number;
  actors: { actor: { id: number; name: string } }[]; // Menyimpan relasi actor dalam array objek
  genres: { genre: { id: number; name: string } }[]; // Menyimpan relasi genre dalam array objek
  availabilities: { availability: { id: number; name: string } }[]; 
  synopsis: string;
  status: "APPROVE" | "UNAPPROVE";
};

const updateStatus = async (
  id: number,
  status: "APPROVE" | "UNAPPROVE",
  onStatusUpdate: () => void
) => {
  try {
    const res = await fetch(`/api/movies/${id}/update-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Failed to update status");
    }

    // Memicu callback untuk memperbarui data film di halaman
    onStatusUpdate();
  } catch (error) {
    console.error("Error updating movie status:", error);
  }
};

export const columns = (onStatusUpdate: () => void): ColumnDef<Film>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "releaseYear",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Release Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "actors",
    header: "Actors",
    cell: ({ row }) => {
      return row.original.actors.map((a) => a.actor.name).join(", ");
    },
  },
  {
    accessorKey: "genres",
    header: "Genres",
    cell: ({ row }) => {
      return row.original.genres.map((g) => g.genre.name).join(", ");
    },
  },
  {
    accessorKey: "availabilities",
    header: "Availabilities",
    cell: ({ row }) => {
      return row.original.availabilities.map((a) => a.availability.name).join(", ");
    },
  },
  {
    accessorKey: "synopsis",
    header: "Synopsis",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const film = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                updateStatus(
                  film.id,
                  film.status === "APPROVE" ? "UNAPPROVE" : "APPROVE",
                  onStatusUpdate
                )
              }
              className="hover:cursor-pointer"
            >
              {film.status === "APPROVE" ? "Unapprove film" : "Approve film"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="hover:cursor-pointer"
              onClick={() => router.push(`/cms-film-update/${film.id}`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
