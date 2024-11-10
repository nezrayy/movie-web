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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Actor {
  id: number;
  name: string;
  birthdate: string;
  photoUrl?: string;
  country: {
    name: string;
  };
}

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const queryParams = new URLSearchParams({
          year: yearFilter || "",
          country: countryFilter || "",
        });
        const response = await fetch(`/api/actors?${queryParams}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch actors: ${response.status}`);
        }
        const data = await response.json();
        setActors(data);
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data.map((country: { name: string }) => country.name));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchActors();
    fetchCountries();
  }, [yearFilter, countryFilter]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(actors.length / itemsPerPage)) {
      setCurrentPage(page);
    }
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

  const filteredActors = actors.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedActors = filteredActors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredActors.length / itemsPerPage);

  return (
    <main>
      <div className="flex min-h-screen">
        <div className="w-full items-center">
          {/* Filter Section */}
          <div className="text-gray-500 p-4 mb-8">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="border-b border-[#21212E]"
              >
                <AccordionTrigger>Filter & Sort</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
                    {/* Filter Inputs */}
                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
                      <Input
                        type="text"
                        placeholder="Search actor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-36 bg-[#21212E] text-gray-400"
                      />
                      <Select onValueChange={(value) => setYearFilter(value)}>
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none">
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
                        onValueChange={(value) => setCountryFilter(value)}
                      >
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none">
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-white">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setYearFilter("");
                          setCountryFilter("");
                          setCurrentPage(1);
                        }}
                        className="bg-[#21212E] text-gray-400 hover:bg-[#1c1c26]"
                      >
                        <RotateCcwIcon className="w-4 h-4 inline" />
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Actor List */}
          {paginatedActors.length > 0 ? (
            <div className="container flex-1 relative mx-auto">
              <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 text-white gap-4">
                {paginatedActors.map((actor) => (
                  <div
                    key={actor.id}
                    className="container mb-6 mx-auto sm:mx-0"
                  >
                    <div className="relative w-[200px] h-[297px] overflow-hidden rounded-xl shadow-2xl mx-auto">
                      <img
                        src={
                          actor.photoUrl
                            ? actor.photoUrl
                            : "/placeholder-image.jpg"
                        }
                        alt={actor.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[102%]"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <h3 className="font-bold">{actor.name}</h3>
                      <p className="text-sm text-gray-400">
                        Born: {new Date(actor.birthdate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400">
                      {actor.country ? actor.country.name : "Country not specified"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination>
                <PaginationContent className="text-gray-400">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#21212E] hover:text-gray-400"
                      }
                    />
                  </PaginationItem>
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
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages || totalPages === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#21212E] hover:text-gray-400"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">
                No actors found. Try different filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
