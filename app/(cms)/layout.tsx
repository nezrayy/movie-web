import MobileNav from "@/components/mobile-nav";
import Sidebar, { SidebarItem } from "@/components/cms-sidebar";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import {
  Clapperboard,
  Earth,
  FileVideo,
  Medal,
  MessageSquareText,
  Sparkles,
  SquareLibrary,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Sidebar untuk Desktop */}
      <div className="sticky lg:top-0 lg:h-screen hidden lg:block z-50">
        <Sidebar>
          <Link href="/cms-actors">
            <SidebarItem icon={<Sparkles />} text="Actors" />
          </Link>
          <Link href="/cms-awards">
            <SidebarItem icon={<Medal />} text="Awards" />
          </Link>
          <Link href="/cms-Comments">
            <SidebarItem icon={<MessageSquareText />} text="Comments" />
          </Link>
          <Link href="/cms-countries">
            <SidebarItem icon={<Earth />} text="Countries" />
          </Link>
          <Link href="/cms-films">
            <SidebarItem icon={<Clapperboard />} text="Films" />
          </Link>
          <Link href="/cms-genres">
            <SidebarItem icon={<SquareLibrary />} text="Genres" />
          </Link>
          <Link href="/cms-film-input">
            <SidebarItem icon={<FileVideo />} text="Input Film" />
          </Link>
          <Link href="/cms-users">
            <SidebarItem icon={<Users />} text="Users" />
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
