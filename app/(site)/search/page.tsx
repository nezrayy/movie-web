"use client";

import { useState, useEffect, useRef } from "react";
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
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMovies = async (offset = 0) => {
    if (!searchResult || searchResult.trim() === "") {
      setMovies([]);
      return;
    }

    setLoading(true);

    // Batalkan request sebelumnya jika ada
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const queryString = new URLSearchParams({
        search_query: searchResult,
        year: searchParams.get("year") || "",
        genre: searchParams.get("genre") || "",
        status: searchParams.get("status") || "",
        availability: searchParams.get("availability") || "",
        award: searchParams.get("award") || "",
        sortedBy: searchParams.get("sortedBy") || "",
        offset: offset.toString(),
        limit: limit.toString(),
      }).toString();

      const response = await fetch(`/api/get-movie-by-search?${queryString}`, {
        signal: abortControllerRef.current.signal,
      });
      const data = await response.json();

      console.log("Fetched Movies:", data);

      if (data.length === 0 || data.length < limit) {
        setHasMore(false);
      }

      setMovies((prev) => {
        const newMovies = data.filter(
          (newMovie: Movie) =>
            !prev.some((prevMovie) => prevMovie.id === newMovie.id)
        );
        return offset === 0 ? newMovies : [...prev, ...newMovies];
      });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching movies:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Search params changed, resetting movies.");
    setMovies([]);
    setOffset(0);
    setHasMore(true);
    fetchMovies(0);
  }, [searchParams]);

  const handleLoadMore = () => {
    if (hasMore) {
      const newOffset = offset + limit;
      fetchMovies(newOffset);
      setOffset(newOffset);
    }
  };

  const isValidImageUrl = (url: string) => {
    try {
      if (url.startsWith("/")) {
        const path = url.toLowerCase();
        return (
          path.endsWith(".jpg") ||
          path.endsWith(".png") ||
          path.endsWith(".jpeg")
        );
      } else {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname.toLowerCase();
        return (
          path.endsWith(".jpg") ||
          path.endsWith(".png") ||
          path.endsWith(".jpeg")
        );
      }
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-screen-xl mx-auto p-4 mt-4">
      <div className="w-full flex flex-col items-center mb-6">
        {searchResult?.trim() && (
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
            <div
              key={movie.id}
              className="hover:cursor-pointer group"
              onClick={() => router.push(`/movie/${movie.id}`)}
            >
              <MovieCard
                imageLink={
                  isValidImageUrl(movie.posterUrl)
                    ? movie.posterUrl
                    : "/placeholder-image.jpg"
                }
                title={movie.title}
                releaseYear={movie.releaseYear}
                actors={movie.actors}
                genres={movie.genres}
              />
            </div>
          ))}
        </div>
      </div>
      {hasMore && !loading && movies.length > 0 && (
        <button
          onClick={handleLoadMore}
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Load More
        </button>
      )}
      {loading && <p className="text-white mt-4">Loading...</p>}
    </div>
  );
};

export default SearchPage;
