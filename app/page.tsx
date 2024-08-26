import Sidebar, { SidebarItem } from "@/components/sidebar";
import Image from "next/image";
import { AirVent } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <Sidebar>
        <SidebarItem icon={<AirVent />} text="hello" />
        </Sidebar>
    </main>
  );
}
