"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Clapperboard,
  Users,
  MoreHorizontal,
  LogOut,
  Medal,
  Earth,
  MessageSquareText,
  Sparkles,
  SquareLibrary,
  FileVideo,
  House,
  FolderOpen,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const CMSMobileNav: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { status } = useSession();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedQuery = query.replace(/ /g, "+");
    router.push(`/search?search_query=${formattedQuery}`);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0C0D11] p-4 flex justify-around items-center shadow-lg lg:hidden z-50">
      {/* Search Button */}
      <Sheet>
        <SheetTrigger className="flex flex-col items-center">
          <Search className="text-white w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="top" className="bg-[#0C0D11] text-white">
          <SheetHeader>
            <SheetTitle className="text-white font-extrabold">
              Search for movie
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div>
              <Input
                placeholder="Search..."
                className="bg-transparent text-white placeholder:text-gray-400 mt-4 mb-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="bg-[#21212E]">
                  Search
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Films Button */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <House className="text-white w-6 h-6" />
      </div>

      {/* CMS Dropdown */}
      <Sheet>
        <SheetTrigger className="flex flex-col items-center">
          <FolderOpen className="text-white w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="top" className="bg-[#0C0D11] text-white">
          <div className="mt-4 flex flex-col gap-4">
            {[
              { name: "Actors", path: "/cms-actors", icon: <Sparkles /> },
              { name: "Awards", path: "/cms-awards", icon: <Medal /> },
              {
                name: "Comments",
                path: "/cms-comments",
                icon: <MessageSquareText />,
              },
              { name: "Countries", path: "/cms-countries", icon: <Earth /> },
              { name: "Films", path: "/cms-films", icon: <Clapperboard /> },
              { name: "Genres", path: "/cms-genres", icon: <SquareLibrary /> },
              {
                name: "Input Film",
                path: "/cms-film-input",
                icon: <FileVideo />,
              },
              { name: "Users", path: "/cms-users", icon: <Users /> },
            ].map((item) => (
              <div
                key={item.name}
                className={`flex items-center justify-between p-3 cursor-pointer rounded-md transition-colors ${
                  router.pathname === item.path
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-[#1B1C23]"
                }`}
                onClick={() => router.push(item.path)}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      {status === "authenticated" && (
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-2">
            <LogOut className="text-red-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSMobileNav;
