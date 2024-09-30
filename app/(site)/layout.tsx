"use client";

import { usePathname } from "next/navigation";
import MobileNav from "@/components/mobile-nav";
import Sidebar, { SidebarInputItem, SidebarItem } from "@/components/sidebar";
import { FilterSortProvider } from "../contexts/FilterSortContext"; // Pastikan path benar
import { Medal, MonitorPlay, Search, UserRound, Users } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Sidebar untuk Desktop */}
      <div className="sticky lg:top-0 lg:h-screen hidden lg:block z-50">
        <Sidebar>
          <SidebarInputItem icon={<Search />} placeholder="Search..." />
          <Link href="/">
            <SidebarItem
              icon={<MonitorPlay />}
              text="Films"
              active={pathname === "/"}
            />
          </Link>
          <Link href="/awards">
            <SidebarItem
              icon={<Medal />}
              text="Awards"
              active={pathname === "/awards"}
            />
          </Link>
          <Link href="/celebs">
            <SidebarItem
              icon={<Users />}
              text="Celebs"
              active={pathname === "/celebs"}
            />
          </Link>
        </Sidebar>
      </div>

      <FilterSortProvider>
        {/* Konten Utama */}
        <div className="flex-grow flex flex-col mb-20 lg:mb-0">{children}</div>
      {/* Mobile Navigation */}
      <MobileNav />
      </FilterSortProvider>
    </div>
  );
}
