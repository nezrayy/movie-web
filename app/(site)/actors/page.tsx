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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  const [searchTerm, setSearchTerm] = useState<string>(""); // Pencarian
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const images = [
    "/header/actors/babydriver.png",
    "/header/actors/batman.png",
    "/header/actors/inception.png",
    "/header/films/500.png",
    "/header/actors/potter.png",
    "/header/actors/oppen.png",
    "/header/actors/thelastjedi.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 550);
    }, 6000); // Ganti gambar setiap 10 detik

    return () => clearInterval(interval); // Bersihkan interval saat unmount
  }, []);

  const fetchActors = async (page: number = 1) => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm || "",
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString(),
      });

      const response = await fetch(`/api/actors?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setActors(data.actors || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage)); // Update total halaman
      } else {
        console.error("Failed to fetch actors:", data.error);
        setActors([]);
        setTotalPages(1); // Reset ke 1 halaman jika gagal
      }
    } catch (error) {
      console.error("Error fetching actors:", error);
      setActors([]);
      setTotalPages(1); // Reset ke 1 halaman jika gagal
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries");
      const data = await response.json();
      setCountries(data.map((country: { name: string }) => country.name));
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchActors(currentPage); // Panggil ulang fetchActors saat filter berubah
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchCountries();
  }, []);

  const paginatedActors = actors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); // Set halaman baru
    }
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={
                currentPage === i
                  ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E]"
                  : "hover:bg-[#21212E] hover:text-gray-400"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={
              currentPage === 1
                ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E]"
                : "hover:bg-[#21212E] hover:text-gray-400"
            }
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

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
                  ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E]"
                  : "hover:bg-[#21212E] hover:text-gray-400"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 3) {
        paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E]"
                : "hover:bg-[#21212E] hover:text-gray-400"
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  const isValidImageUrl = (url: string) => {
    try {
      // Cek apakah URL adalah path lokal (dimulai dengan "/")
      if (url.startsWith("/")) {
        // Periksa apakah path diakhiri dengan ekstensi gambar yang valid
        const path = url.toLowerCase();
        return (
          path.endsWith(".jpg") ||
          path.endsWith(".png") ||
          path.endsWith(".jpeg")
        );
      } else {
        // Jika URL penuh, buat objek URL untuk memisahkan path dan query
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname.toLowerCase();
        return (
          path.endsWith(".jpg") ||
          path.endsWith(".png") ||
          path.endsWith(".jpeg")
        );
      }
    } catch (error) {
      // Jika URL tidak valid
      return false;
    }
  };

  return (
    <main>
      <div className="flex flex-col min-h-screen">
        <div
          className={`relative w-full h-[150px] sm:h-[180px] md:h-[250px] lg:h-[300px] xl:h-[420px] overflow-hidden fade-mask`}
        >
          {" "}
          {/* Layer gambar */}
          <div
            className={`absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transition-opacity duration-1000 fade-mask ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundImage: `url(${images[currentImageIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          {/* Overlay teks */}
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-10">
            {/* Mobile Layout: Logo */}
            <div className="block lg:hidden">
              <img
                src="/rewatch.png"
                alt="Rewatch Logo"
                className="w-40 md:w-60 h-auto"
              />
            </div>

            {/* Desktop Layout: Teks */}
            <div className="hidden lg:block">
              <h1 className="text-white sm:text-2xl sm:mt-2 md:text-3xl lg:text-4xl xl:text-6xl font-bold text-center md:mt-4">
                Discover Your Favorite Actors
              </h1>
            </div>
          </div>
          {/* Media Query via Tailwind */}
          <style jsx>{`
            @media (max-width: 640px) {
              .fade-mask {
                background-position: center top; /* Posisi gambar untuk layar kecil */
                height: 250px; /* Tinggi yang sesuai */
              }
            }
            @media (min-width: 641px) {
              .fade-mask {
                background-position: center -55px; /* Posisi gambar untuk desktop */
              }
            }
          `}</style>
        </div>

        <div className="w-full items-center">
          {/* Filter Section */}
          <div className="text-gray-500 px-4 py-0 mb-8">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="border-b border-[#21212E]"
              >
                <AccordionTrigger>Find Actors</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-4">
                    {/* Filter Inputs */}
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Search actor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-96 bg-[#14141c] text-gray-400"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Actor List */}
          {paginatedActors.length > 0 ? (
            <div className="container flex-1 relative mx-auto">
              <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 text-white gap-4">
                {paginatedActors.map((actor) => (
                  <div
                    key={actor.id}
                    className="container mb-6 mx-auto sm:mx-0"
                  >
                    <div className="relative w-[200px] h-[297px] overflow-hidden rounded-xl shadow-2xl mx-auto">
                      <img
                        src={
                          isValidImageUrl(actor.photoUrl)
                            ? actor.photoUrl
                            : "/actor-default.png"
                        }
                        alt={actor.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[102%]"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <h3 className="font-semibold pt-4">{actor.name}</h3>
                      <p className="text-sm text-gray-400">
                        Born: {new Date(actor.birthdate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        {actor.country.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination className="mb-6">
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
              <p className="text-gray-500 text-sm md:text-lg">
                No actors found. Try different keyword or wait a moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
