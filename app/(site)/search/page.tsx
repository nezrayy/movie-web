"use client";

import { useState, useEffect } from "react";
import Filter from "@/components/filter";
import MovieCard from "@/components/movie-card";
import { useSearchParams } from "next/navigation";

interface Actor {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  releaseYear: string;
  posterUrl: string;
  actors: Actor[];
  genres: Genre[];
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchResult = searchParams.get("search_query");

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0); // Offset untuk "Load More"
  const [hasMore, setHasMore] = useState(true); // Untuk "Load More"

  const limit = 12;

  // Fetch movies berdasarkan searchQuery dan offset
  const fetchMovies = async (offset = 0) => {
    setLoading(true);
  
    try {
      const response = await fetch(
        `/api/get-movie-by-search?search_query=${searchResult}&offset=${offset}&limit=${limit}`
      );
      const data = await response.json();
  
      // Jika movies yang diambil kurang dari limit, berarti tidak ada lagi
      if (data.length < limit) {
        setHasMore(false);
      }
  
      // Periksa dan tambahkan hanya movie yang belum ada
      setMovies((prevMovies) => {
        const newMovies = data.filter((newMovie: Movie) =>
          !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );
        return [...prevMovies, ...newMovies];
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  
    setLoading(false);
  };

  // Fetch movies ketika halaman pertama kali dimuat atau search berubah
  useEffect(() => {
    if (searchResult) {
      setMovies([]); // Reset movies ketika search berubah
      setOffset(0); // Reset offset ke 0
      setHasMore(true); // Reset hasMore
      fetchMovies(0); // Fetch movies pertama kali
    }
  }, [searchResult]);

  // Load more handler
  const handleLoadMore = () => {
    const newOffset = offset + limit;
    fetchMovies(newOffset);
    setOffset(newOffset);
  };

  const isValidImageUrl = (url: string) => {
    // Cek apakah URL dimulai dengan http:// atau https://
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-screen-xl mx-auto p-4 mt-4">
      <div className="w-full flex flex-col items-center mb-6">
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
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              imageLink={isValidImageUrl(movie.posterUrl) ? movie.posterUrl : "/placeholder-image.jpg"}
              title={movie.title}
              releaseYear={movie.releaseYear}
              actors={movie.actors.map((actor) => actor.name)}
              genres={movie.genres.map((genre) => genre.name)}
            />
          ))}
        </div>
      </div>

      {/* Tombol Load More */}
      {hasMore && !loading && movies.length > 0 && (
        <button
          onClick={handleLoadMore}
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Load More
        </button>
      )}

      {loading && (
        <p className="text-white mt-4">Loading...</p>
      )}
    </div>
  );
};

export default SearchPage;
