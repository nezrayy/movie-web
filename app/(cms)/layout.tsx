"use client";

import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/sidebar";
import {
  Clapperboard,
  Earth,
  FileVideo,
  Image,
  Medal,
  MessageSquareText,
  Sparkles,
  SquareLibrary,
  Users,
} from "lucide-react";
import Link from "next/link";
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationDialog from "@/components/notification";
import { EditFormProvider } from "@/contexts/EditFormContext";
import { PaginationProvider } from "@/contexts/CMSPaginationContext";
import CMSMobileNav from "@/components/cms-mobile-nav";
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Sidebar untuk Desktop */}
      <div className="lg:top-0 sticky lg:h-screen hidden lg:block z-50">
        <Sidebar>
          <Link href="/cms-actors">
            <SidebarItem
              icon={<Sparkles />}
              text="Actors"
              active={pathname === "/cms-actors"}
            />
          </Link>
          <Link href="/cms-awards">
            <SidebarItem
              icon={<Medal />}
              text="Awards"
              active={pathname === "/cms-awards"}
            />
          </Link>
          <Link href="/cms-comments">
            <SidebarItem
              icon={<MessageSquareText />}
              text="Comments"
              active={pathname === "/cms-comments"}
            />
          </Link>
          <Link href="/cms-countries">
            <SidebarItem
              icon={<Earth />}
              text="Countries"
              active={pathname === "/cms-countries"}
            />
          </Link>
          <Link href="/cms-films">
            <SidebarItem
              icon={<Clapperboard />}
              text="Films"
              active={pathname === "/cms-films"}
            />
          </Link>
          <Link href="/cms-genres">
            <SidebarItem
              icon={<SquareLibrary />}
              text="Genres"
              active={pathname === "/cms-genres"}
            />
          </Link>
          <Link href="/cms-film-input">
            <SidebarItem
              icon={<FileVideo />}
              text="Input Film"
              active={pathname === "/cms-film-input"}
            />
          </Link>
          <Link href="/cms-users">
            <SidebarItem
              icon={<Users />}
              text="Users"
              active={pathname === "/cms-users"}
            />
          </Link>
        </Sidebar>
      </div>

      {/* Konten Utama */}
      <div className="flex-grow flex flex-col mb-20 lg:mb-0">
        <EditFormProvider>
          <NotificationProvider>
            <PaginationProvider>{children}</PaginationProvider>
            <NotificationDialog />
          </NotificationProvider>
        </EditFormProvider>
      </div>

      {/* Mobile Navigation */}
      <CMSMobileNav />
    </div>
  );
}
