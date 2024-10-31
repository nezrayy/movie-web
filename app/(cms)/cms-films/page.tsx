"use client"
import { useEffect, useState } from "react";
import { Film, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const CMSDrama = () => {
  const [films, setFilms] = useState([])

  const fetchFilms = async () => {
    const res = await fetch("/api/movies")
    const data = await res.json()
    setFilms(data)
  }

  useEffect(() => {
    fetchFilms()
  }, [])

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <DataTable columns={columns} data={films} filter="title" />
    </div>
  )
}

export default CMSDrama