"use client";

import Filter from "@/components/filter";
import MovieCard from "@/components/movie-card";
import SearchInput from "@/components/search-input";
import Sidebar, { SidebarInputItem, SidebarItem } from "@/components/sidebar";
import { Medal, MonitorPlay, Search, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchResult = searchParams.get("search_query");

  return (
    <div className="flex lg:flex-row">
      <div className="sticky top-0 h-screen hidden lg:block">
        <Sidebar>
          <SidebarInputItem icon={<Search />} placeholder="Search..." />
          <SidebarItem icon={<MonitorPlay />} text="Films" />
          <SidebarItem icon={<Medal />} text="Awards" />
          <SidebarItem icon={<Users />} text="Celebs" />
        </Sidebar>
      </div>
      <div className="flex flex-col items-center w-full max-w-screen-xl mx-auto p-4">
        <div className="w-full flex flex-col items-center mb-6">
          <SearchInput />
          {searchResult?.trim() !== "" && (
            <h1 className="mt-4 text-xl font-semibold text-white">
              Search result for "{searchResult}"
            </h1>
          )}
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-6 w-full">
          <div className="w-full lg:w-1/4">
            <Filter />
          </div>
          <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
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
            <MovieCard
              imageLink="/poster-example.jpg"
              title="Deadpool"
              releaseYear="2024"
              actors={["Hue"]}
              genres={["Action"]}
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
    </div>
  )
}

export default SearchPage;