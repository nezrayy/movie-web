"use client";

import Sidebar, { SidebarInputItem, SidebarItem } from "@/components/sidebar";
import { MonitorPlay, Medal, Users, Search } from "lucide-react";
import { useState } from "react";
import cardList from "./data";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen">
          <Sidebar>
            <SidebarInputItem
              icon={<Search />}
              text="Search"
              placeholder="Search..."
            />
            <a href="./">
              <SidebarItem icon={<MonitorPlay />} text="Films" />
            </a>
            <SidebarItem icon={<Medal />} text="Awards" />
            <SidebarItem icon={<Users />} text="Celebs" />
          </Sidebar>
        </div>
        {/* Main Content */}
        <div className="w-full items-center">
          {/* Image Header with Fade Effect */}
          <div
            className="relative w-full h-[420px] mb-4 bg-center bg-cover bg-no-repeat fade-mask"
            style={{
              backgroundImage: "url('/wolverine.jpg')",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-10">
              <h1 className="text-white text-6xl font-bold text-center">
                Explore the World of Entertainment.
              </h1>
              <h1 className="text-white text-6xl font-bold text-center mt-4">
                Find, Review, and Enjoy.
              </h1>
            </div>
          </div>

          <div className="container flex-1 relative mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {/* Left Section: Filtered by and Selects */}
                <div className="flex items-center space-x-4">
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
                          <SelectItem value="adventure">Adventure</SelectItem>
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
                </div>

                {/* Right Section: Sorted by */}
                <div className="flex items-center space-x-4">
                  <p className="text-white">Sorted by:</p>
                  <Select>
                    <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                      <SelectValue placeholder="Alphabetics" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 text-white">
              {cardList.map((card) => (
                <div className="container mb-6">
                  <div className="w-[200px] h-[297px] overflow-hidden rounded-xl shadow-2xl">
                    <a href="./detail">
                      <img
                        src={card.img}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[102%]"
                      />
                    </a>
                  </div>
                  <div>
                    <h3 className="pt-4 font-bold">
                      {card.title} ({card.year})
                    </h3>
                  </div>
                  <div className="flex flex-wrap">
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

                  <p className="text-sm text-yellow-300">{card.rating} / 5</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
