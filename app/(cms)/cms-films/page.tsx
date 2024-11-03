"use client"
import { useEffect, useState } from "react";
import { Film, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const CMSDrama = () => {
  const [films, setFilms] = useState<Film[]>([]);

  const fetchFilms = async () => {
    try {
      const res = await fetch("/api/movies");
      if (!res.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await res.json();
      setFilms(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  // Fungsi untuk menangani update status
  const handleStatusUpdate = () => {
    fetchFilms(); // Ambil ulang data film setelah update status
  };

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <DataTable columns={columns(handleStatusUpdate)} data={films} filter="title" />
    </div>
  );
};

export default CMSDrama;
