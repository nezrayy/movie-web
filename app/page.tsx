"use client";

import Sidebar, { SidebarItem } from "@/components/sidebar";
import Image from "next/image";
import { AirVent } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar>
          <SidebarItem icon={<AirVent />} text="hello" />
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#14141C] relative">
          {/* Input Container */}
          <div className="flex justify-center">
            <div
              className={`${
                isSidebarOpen ? "ml-32" : "ml-8"
              } transition-all duration-300`}
            >
              {/* <Input type="email" placeholder="Search..." /> */}
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Main Content</h2>
            <p>This is where the main content of the page will go.</p>
          </div>
        </main>
      </div>
    </main>
  );
}
