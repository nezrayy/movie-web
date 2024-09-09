"use client";

import { useState } from "react";
import cardList from "@/app/data";
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
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(cardList.length / itemsPerPage);

  // Get current items based on the page
  const currentItems = cardList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                  <div className="flex flex-col md:flex-row justify-between">
                    {/* Left Section: Filtered by and Selects */}
                    <div className="flex flex-col xl:flex-row md:items-center md:space-x-4 md:space-y-0 space-y-2 mt-2">
                      <p className="text-white">Filtered by:</p>
                      <Select>
                        <SelectTrigger className="w-24 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-gray-400">
                          <SelectItem value="2021">2021</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-gray-400">
                          <SelectGroup>
                            <SelectItem value="action">Action</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="thriller">Thriller</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Availability" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-gray-400">
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="unavailable">
                            Unavailable
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-24 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Award" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-gray-400">
                          <SelectItem value="oscar">Oscar</SelectItem>
                          <SelectItem value="grammy">Grammy</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-24 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] hover:bg-[#15151d] text-gray-400">
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="popular">Popular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Right Section: Sorted by */}
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mt-2">
                      <p className="text-white">Sorted by:</p>
                      <Select>
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#21212E] text-white">
                          <SelectItem value="asc">A to Z</SelectItem>
                          <SelectItem value="desc">Z to A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="container flex-1 relative mx-auto">
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 text-white">
              {currentItems.map((card) => (
                <div key={card.id} className="container mb-6 mx-auto sm:mx-0">
                  <div className="relative w-[200px] h-[297px] overflow-hidden rounded-xl shadow-2xl mx-auto">
                    <a href="./detail">
                      <img
                        src={card.img}
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
                      {card.title} ({card.year})
                    </h3>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start">
                    {card.genre.slice(0, 3).map((genre, index) => (
                      <p
                        key={index}
                        className={`bg-transparent hover:bg-transparent pl-0 pr-1 text-gray-400 text-xs font-normal rounded-none mb-1 ${
                          index < card.genre.slice(0, 3).length - 1
                            ? "after:content-[','] after:ml-0"
                            : ""
                        }`}
                      >
                        {genre}
                      </p>
                    ))}
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
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                      className={
                        currentPage === index + 1
                          ? "border border-gray-500 text-gray-500 bg-[#14141C] hover:bg-[#21212E] hover:text-gray-500" // Border untuk halaman aktif
                          : "hover:bg-[#21212E] hover:text-gray-400 focus:border"
                      }
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
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
        </div>
      </div>
    </main>
  );
}
