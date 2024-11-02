import { useState, useEffect } from "react";

interface Actor {
    id: number;
    name: string;
  }
  
  interface Availability {
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
    synopsis: string;
    linkTrailer: string;
    availabilities: Availability[];
    rating: number;
    posterUrl: string;
    actors: Actor[];
    genres: Genre[];
  }

export const useFilterSort = () => {
  const [sortBy, setSortBy] = useState<string>("title_asc");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`/api/movies?sort=${sortBy}&year=${yearFilter}&category=${categoryFilter}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [sortBy, yearFilter, categoryFilter, availabilityFilter]);

  return {
    movies,
    sortBy,
    yearFilter,
    categoryFilter,
    setSortBy,
    setYearFilter,
    setCategoryFilter,
  };
};
