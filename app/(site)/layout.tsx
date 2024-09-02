import MobileNav from "@/components/mobile-nav";
import Sidebar, { SidebarInputItem, SidebarItem } from "@/components/sidebar";
import { Medal, MonitorPlay, Search, UserRound, Users } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Sidebar untuk Desktop */}
      <div className="sticky lg:top-0 lg:h-screen hidden lg:block z-50">
        <Sidebar>
          <SidebarInputItem icon={<Search />} placeholder="Search..." />
          <SidebarItem icon={<MonitorPlay />} text="Films" />
          <SidebarItem icon={<Medal />} text="Awards" />
          <SidebarItem icon={<Users />} text="Celebs" />
        </Sidebar>
      </div>
      
      {/* Konten Utama */}
      <div className="flex-grow flex flex-col mb-20 lg:mb-0">
        {children}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}