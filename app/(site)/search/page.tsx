"use client";

import { useState, useEffect } from "react";
import Filter from "@/components/filter";
import MovieCard from "@/components/movie-card";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter()

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0); // Offset untuk "Load More"
  const [hasMore, setHasMore] = useState(true); // Untuk "Load More"

  const limit = 12;

  const fetchMovies = async (offset = 0) => {
    setLoading(true);

    try {
      // Buat URL berdasarkan semua parameter di searchParams
      const searchQuery = searchParams.get("search_query") || "";
      const year = searchParams.get("year") || "";
      const genre = searchParams.get("genre") || "";
      const status = searchParams.get("status") || "";
      const availability = searchParams.get("availability") || "";
      const award = searchParams.get("award") || "";
      const sortedBy = searchParams.get("sortedBy") || "";

      // Bangun query string untuk dikirim ke backend
      const queryString = new URLSearchParams({
        search_query: searchQuery,
        year,
        genre,
        status,
        availability,
        award,
        sortedBy,
        offset: offset.toString(),
        limit: limit.toString(),
      }).toString();

      const response = await fetch(`/api/get-movie-by-search?${queryString}`);
      const data = await response.json();

      // Jika movies yang diambil kurang dari limit, berarti tidak ada lagi
      if (data.length > limit) {
        setHasMore(true);  // Masih ada lebih banyak movie
        data.pop(); // Buang movie ke-13
      } else {
        setHasMore(false); // Tidak ada lebih banyak movie
      }

      // Periksa dan tambahkan hanya movie yang belum ada
      setMovies((prevMovies) => {
        console.log("DATA YANG DIDAPATKAN", data);
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

  useEffect(() => {
    setMovies([]); // Reset movies ketika filter berubah
    setOffset(0); // Reset offset ke 0
    setHasMore(true); // Reset hasMore
    fetchMovies(0); // Fetch movies pertama kali
  }, [searchParams]); // Trigger fetch setiap searchParams berubah

  // Load more handler
  const handleLoadMore = () => {
    if (hasMore) {
      const newOffset = offset + limit;
      fetchMovies(newOffset);
      setOffset(newOffset);
    }
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
        <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
          {movies.map((movie) => (
            <div key={movie.id} className="hover:cursor-pointer group" onClick={() => router.push(`/movie/${movie.id}`)}>
              <MovieCard
                imageLink={isValidImageUrl(movie.posterUrl) ? movie.posterUrl : "/placeholder-image.jpg"}
                title={movie.title}
                releaseYear={movie.releaseYear}
                actors={movie.actors}
                genres={movie.genres} 
              />
            </div>
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
