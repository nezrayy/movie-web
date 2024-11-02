"use client";

import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RotateCcwIcon } from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useFilterSort } from "../../contexts/FilterSortContext";
import { Availability } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  releaseYear: string;
  rating: number;
  posterUrl: string;
  genres: Genre[];
}

export default function Home() {
  const {
    sortBy,
    yearFilter,
    availabilityFilter,
    categoryFilter,
    setSortBy,
    setAvailabilityFilter,
    setYearFilter,
    setCategoryFilter,
  } = useFilterSort();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Calculate total pages
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  // Get current items based on the page
  const currentItems =
    movies.length > 0
      ? movies.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : []; // Pastikan `movies` diproses hanya jika ada data

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch movies based on filters and sort
  const fetchMovies = async () => {
    try {
      const queryParams = new URLSearchParams({
        sort: sortBy || "title_asc",
        year: yearFilter || "",
        genre: categoryFilter || "",
        availability: availabilityFilter || "",
      });

      const response = await fetch(`/api/movies?${queryParams}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/get-genres");
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch("/api/get-availabilities");
      const data = await response.json();
      setAvailabilities(data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const resetFilters = () => {
    setYearFilter("");
    setCategoryFilter("");
    setAvailabilityFilter("");
    setSortBy("year_desc");
  };

  useEffect(() => {
    fetchMovies();
  }, [sortBy, yearFilter, categoryFilter, availabilityFilter]);

  useEffect(() => {
    fetchGenres();
    fetchAvailabilities();
  }, []);

  const isValidImageUrl = (url: string) => {
    // Cek apakah URL dimulai dengan http:// atau https://
    // return url.startsWith("http://") || url.startsWith("https://");
    return (
      url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg")
    );
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (totalPages <= 5) {
      // Jika total halaman 5 atau kurang, tampilkan semua halaman
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={
                currentPage === i
                  ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E] hover:text-gray-500" // Border untuk halaman aktif
                  : "hover:bg-[#21212E] hover:text-gray-400 focus:border"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Jika total halaman lebih dari 5
      // Tampilkan halaman pertama
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={
              currentPage === 1
                ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E] hover:text-gray-500"
                : "hover:bg-[#21212E] hover:text-gray-400 focus:border"
            }
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Tampilkan halaman kedua hingga kelima atau sampai sebelum halaman terakhir
      if (currentPage > 4) {
        paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(currentPage + 1, totalPages - 1);

      for (let i = startPage; i <= endPage; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={
                currentPage === i
                  ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E] hover:text-gray-500"
                  : "hover:bg-[#21212E] hover:text-gray-400 focus:border"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Tampilkan ellipsis jika halaman terakhir belum ditampilkan
      if (currentPage < totalPages - 3) {
        paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      // Tampilkan halaman terakhir
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E] hover:text-gray-500"
                : "hover:bg-[#21212E] hover:text-gray-400 focus:border"
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  return (
    <main>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="w-full items-center">
          {/* Image Header with Fade Effect */}
          <div
            className="relative w-full h-[200px] md:h-[420px] bg-center bg-cover bg-no-repeat fade-mask"
            style={{
              backgroundImage: "url('/wolverine.jpg')",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-10">
              <h1 className="text-white sm:text-2xl md:text-5xl lg:text-6xl font-bold text-center">
                Explore the World of Entertainment.
              </h1>
              <h1 className="text-white sm:text-2xl sm:mt-2 md:text-5xl lg:text-6xl font-bold text-center md:mt-4">
                Find, Review, and Enjoy.
              </h1>
              <h3 className="absolute top-96 flex items-center text-gray-500 text-lg font-light italic origin-top-right z-50">
                Deadpool and Wolverine (2024)
              </h3>
            </div>
          </div>

          <div className="text-gray-500 p-4 mb-8">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="border-b border-[#21212E]"
              >
                <AccordionTrigger>Filter & Sort</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
                    {/* Left Section: Filtered by and Selects */}
                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
                      <p className="text-white">Filtered by:</p>

                      <Select onValueChange={(value) => setYearFilter(value)}>
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-white">
                          <SelectItem value="<1990">&lt;1990</SelectItem>
                          <SelectItem value="1990_1994">1990 - 1994</SelectItem>
                          <SelectItem value="1995_1999">1995 - 1999</SelectItem>
                          <SelectItem value="2000_2004">2000 - 2004</SelectItem>
                          <SelectItem value="2005_2009">2005 - 2009</SelectItem>
                          <SelectItem value="2010_2014">2010 - 2014</SelectItem>
                          <SelectItem value="2015_2019">2015 - 2019</SelectItem>
                          <SelectItem value="2020_2024">2020 - 2024</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={(value) => setCategoryFilter(value)}
                      >
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-gray-400">
                          <SelectGroup>
                            {genres.map((genre) => (
                              <SelectItem key={genre.id} value={genre.name}>
                                {genre.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={(value) => setAvailabilityFilter(value)}
                      >
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Availability" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-gray-400">
                          <SelectGroup>
                            {availabilities.map((availability) => (
                              <SelectItem
                                key={availability.id}
                                value={availability.name}
                              >
                                {availability.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {/* Reset Button */}
                      <Button
                        onClick={resetFilters}
                        className="bg-[#21212E] text-gray-400 hover:bg-[#1c1c26]"
                      >
                        <RotateCcwIcon className="w-4 h-4 inline" />
                      </Button>
                    </div>

                    {/* Right Section: Sorted by */}
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-2 md:mt-0">
                      <p className="text-white">Sorted by:</p>

                      <Select onValueChange={(value) => setSortBy(value)}>
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-white">
                          <SelectItem value="title_asc">
                            Title: A to Z
                          </SelectItem>
                          <SelectItem value="title_desc">
                            Title: Z to A
                          </SelectItem>
                          <SelectItem value="rating_asc">
                            Rating: Low to High
                          </SelectItem>
                          <SelectItem value="rating_desc">
                            Rating: High to Low
                          </SelectItem>
                          <SelectItem value="year_asc">Oldest</SelectItem>
                          <SelectItem value="year_desc">Newest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {currentItems.length > 0 ? (
            <div className="container flex-1 relative mx-auto">
              <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 text-white">
                {currentItems.map((card) => (
                  <div key={card.id} className="container mb-6 mx-auto sm:mx-0">
                    <div className="relative w-[200px] h-[297px] overflow-hidden rounded-xl shadow-2xl mx-auto">
                      <a href={`./movie/${card.id}`}>
                        <img
                          src={
                            isValidImageUrl(card.posterUrl)
                              ? card.posterUrl
                              : "/placeholder-image.jpg"
                          }
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[102%]"
                        />

                        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 transition-opacity duration-500 ease-in-out flex items-center justify-center hover:opacity-100">
                          <div className="pt-60">
                            <Rating
                              style={{ maxWidth: 80 }}
                              value={card.rating}
                            />
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="pt-4 font-bold">
                        {card.title} ({card.releaseYear})
                      </h3>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start">
                      {card.genres && card.genres.length > 0 ? (
                        card.genres.slice(0, 3).map((movieGenre, index) => (
                          <p
                            key={index}
                            className={`bg-transparent hover:bg-transparent pl-0 pr-1 text-gray-400 text-xs font-normal rounded-none mb-1 ${
                              index < card.genres.slice(0, 3).length - 1
                                ? "after:content-['/'] after:ml-0"
                                : ""
                            }`}
                          >
                            {/* @ts-ignore */}
                            {movieGenre.genre.name} {/* Mengakses nama genre */}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-400 text-xs font-normal"></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Component */}
              <Pagination>
                <PaginationContent className="text-gray-400">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#21212E] hover:text-gray-400"
                      }
                    />
                  </PaginationItem>

                  {/* Render pagination items */}
                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
                          : "hover:bg-[#21212E] hover:text-gray-400"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : (
            // Pesan jika tidak ada film yang cocok
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">
                Sorry! No movies found. Try another filter.{" "}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
