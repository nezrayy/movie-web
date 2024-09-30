"use client";

import { useState, useEffect } from "react";
import SelectElement from "@/components/select-element";
import { useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState("");
  const [award, setAward] = useState("");
  const [sortedBy, setSortedBy] = useState("");
  const [genres, setGenres] = useState([])
  const [availabilities, setAvailabilities] = useState([])

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search_query"); // Mendapatkan search_query jika ada

  const handleSubmit = () => {
    const query = new URLSearchParams(searchParams.toString()); // Salin parameter yang ada

    if (year) query.set('year', year);
    if (genre) query.set('genre', genre);
    if (status) query.set('status', status);
    if (availability) query.set('availability', availability);
    if (award) query.set('award', award);
    if (sortedBy) query.set('sortedBy', sortedBy);

    // Pastikan search_query tidak hilang
    if (searchQuery) query.set("search_query", searchQuery);

    router.push(`/search?${query.toString()}`);
  };

  const fetchGenres = async () => {
    const response = await fetch("/api/get-genres");
    setGenres(await response.json());
  }

  const fetchAvailabilities = async () => {
    const response = await fetch("/api/get-availabilities");
    setAvailabilities(await response.json());
  }

  const handleReset = () => {
    const query = new URLSearchParams(); // Reset semua parameter filter

    // Pastikan search_query tetap ada
    if (searchQuery) query.set("search_query", searchQuery);

    // Set filter ke URL tanpa filter lain selain search_query
    router.push(`/search?${query.toString()}`);

    // Reset state filter di frontend
    setYear("");
    setGenre("");
    setStatus("");
    setAvailability("");
    setAward("");
    setSortedBy("");
  };

  useEffect(() => {
    fetchGenres();
    fetchAvailabilities();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 items-center p-4 max-w-screen-lg mx-auto">
      <span className="font-extrabold col-span-1 text-white">Filtered by:</span>
      <div className="grid grid-cols-2 gap-4 col-span-1">
        <SelectElement 
          label="Year"
          elements={Array.from({ length: 55 }, (_, i) => `${1970 + i}`)}
          value={year}
          onChange={setYear}
        />
        <SelectElement 
          label="Genre"
          // @ts-ignore
          elements={genres.map((genre) => genre.name)}
          value={genre}
          onChange={setGenre}
        />
        {/* <SelectElement 
          label="Status"
          elements={['Ongoing', 'Completed']}
          value={status}
          onChange={setStatus}
        /> */}
        <SelectElement 
          label="Availability"
          // @ts-ignore
          elements={availabilities.map((a) => a.name)}
          value={availability}
          onChange={setAvailability}
        />
        {/* <SelectElement 
          label="Award"
          elements={['Oscar', 'Golden Globe']}
          value={award}
          onChange={setAward}
        /> */}
        <SelectElement 
          label="Sorted By"
          elements={['A-Z', 'Z-A', 'Oldest', 'Newest']}
          value={sortedBy}
          onChange={setSortedBy}
        />
      </div>

      <div className="col-span-1 flex justify-center gap-4">
        <button 
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none">
          Submit
        </button>
        <button 
          onClick={handleReset}
          className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none">
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default Filter;
