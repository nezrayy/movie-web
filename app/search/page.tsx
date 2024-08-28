"use client";

import Filter from "@/components/filter";
import MovieCard from "@/components/movie-card";
import SearchInput from "@/components/search-input";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchResult = searchParams.get("search_query");

  return (
    <div className="flex flex-col items-center max-w-screen-lg mx-auto p-4">
      <div className="w-full flex flex-col items-center mb-6">
        <SearchInput />
        <h1 className="mt-4 text-xl font-semibold">Search result for "{searchResult}"</h1>
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-6 w-full">
        <div className="w-full lg:w-1/4">
          <Filter />
        </div>
        <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <MovieCard
            imageLink="/poster-example.jpg"
            title="Deadpool"
            releaseYear="2024"
            actors={["Hue", "Kieu"]}
            genres={["Action", "Adventure"]}
          />
          <MovieCard
            imageLink="/poster-example.jpg"
            title="Deadpool"
            releaseYear="2024"
            actors={["Hue"]}
            genres={["Action"]}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchPage;