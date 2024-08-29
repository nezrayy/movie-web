"use client";

import Sidebar, { SidebarInputItem, SidebarItem } from "@/components/sidebar";
import { MonitorPlay, Medal, Users, Search } from "lucide-react";
import { useState } from "react";
import cardList from "./data";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

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
            <SidebarInputItem icon={<Search />} placeholder="Search..." />
            <SidebarItem icon={<MonitorPlay />} text="Films" />
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

          <div className="container">
            <div className="flex-1 relative mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {/* Left Section: Filtered by and Selects */}
                  <div className="flex items-center space-x-4">
                    <p className="text-white">Filtered by:</p>
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Genre" />
                      </SelectTrigger>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Award" />
                      </SelectTrigger>
                    </Select>
                  </div>

                  {/* Right Section: Sorted by */}
                  <div className="flex items-center space-x-4">
                    <p className="text-white">Sorted by:</p>
                    <Select>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Alphabetics" />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 3xl:grid-cols-6 text-white">
                {cardList.map((card) => (
                  <div className="container mb-6">
                    <img
                      src={card.img}
                      alt=""
                      className="h-80 rounded-xl bg-fixed"
                    />
                    <div>
                      <h3 className="pt-4 font-bold">
                        {card.title} ({card.year})
                      </h3>
                    </div>
                    <p className="text-balance text-sm">{card.text}</p>
                    <p className="text-sm text-yellow-300">{card.rating}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
