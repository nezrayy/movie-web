"use client";

import Sidebar, { SidebarInputItem, SidebarItem } from "@/components/sidebar";
import { MonitorPlay, Medal, Users, Search } from "lucide-react";
import { useState } from "react";
import cardList from "@/app/data";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
            </div>
          </div>

          <div className="text-gray-500 p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
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
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Genre" />
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="action">Action</SelectItem>
                              <SelectItem value="adventure">
                                Adventure
                              </SelectItem>
                              <SelectItem value="thriller">Thriller</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </SelectTrigger>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Availability" />
                        </SelectTrigger>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-24 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Award" />
                        </SelectTrigger>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-24 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </Select>
                    </div>

                    {/* Right Section: Sorted by */}
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mt-2">
                      <p className="text-white">Sorted by:</p>
                      <Select>
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Alphabetics" />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="container flex-1 relative mx-auto">
            <div className="mb-8"></div>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 text-white">
              {cardList.map((card) => (
                <div className="container mb-6 mx-auto sm:mx-0">
                  <div className="w-[200px] h-[297px] overflow-hidden rounded-xl shadow-2xl mx-auto">
                    <a href="./detail">
                      <img
                        src={card.img}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[102%]"
                      />
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

                  <p className="text-sm text-yellow-300 text-center sm:text-left">
                    {card.rating} / 5
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
