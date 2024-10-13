'use client'
 
import { usePathname } from 'next/navigation'
import MobileNav from "@/components/mobile-nav";
import Sidebar, { SidebarItem } from "@/components/cms-sidebar";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import getClientSession from "next-auth";
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

export default async function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Sidebar untuk Desktop */}
      <div className="sticky lg:top-0 lg:h-screen hidden lg:block z-50">
        <Sidebar>
          <Link href="/cms-actors">
            <SidebarItem icon={<Sparkles />} text="Actors" active={pathname === "/cms-actors"} />
          </Link>
          <Link href="/cms-awards">
            <SidebarItem icon={<Medal />} text="Awards" active={pathname === "/cms-awards"} />
          </Link>
          <Link href="/cms-comments">
            <SidebarItem icon={<MessageSquareText />} text="Comments" active={pathname === "/cms-comments"} />
          </Link>
          <Link href="/cms-countries">
            <SidebarItem icon={<Earth />} text="Countries" active={pathname === "/cms-countries"} />
          </Link>
          <Link href="/cms-films">
            <SidebarItem icon={<Clapperboard />} text="Films" active={pathname === "/cms-films"} />
          </Link>
          <Link href="/cms-genres">
            <SidebarItem icon={<SquareLibrary />} text="Genres" active={pathname === "/cms-genres"} />
          </Link>
          <Link href="/cms-film-input">
            <SidebarItem icon={<FileVideo />} text="Input Film" active={pathname === "/cms-film-input"} />
          </Link>
          <Link href="/cms-users">
            <SidebarItem icon={<Users />} text="Users" active={pathname === "/cms-users"} />
          </Link>
          <Link href="/cms-header">
            <SidebarItem icon={<Image />} text="Header" active={pathname === "/cms-header"} />
          </Link>
        </Sidebar>
      </div>

      {/* Konten Utama */}
      <div className="flex-grow flex flex-col mb-20 lg:mb-0">{children}</div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
