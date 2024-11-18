"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Search, MonitorPlay, Medal, Users, UserRound, LogIn, LogOut } from 'lucide-react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from 'next/navigation';
import { useState, CSSProperties } from 'react';
import { signOut, useSession } from "next-auth/react";
import PuffLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
};

const MobileNav: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formattedQuery = query.replace(/ /g, '+');
    router.push(`/search?search_query=${formattedQuery}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0C0D11] p-4 flex justify-around items-center shadow-lg lg:hidden z-50">
      <Sheet>
        <SheetTrigger className="flex flex-col items-center">
          <Search className="text-white w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="top" className="bg-[#0C0D11] text-white">
          <SheetHeader>
            <SheetTitle className="text-white font-extrabold">Search for movie</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div>
              <Input 
                placeholder="Search..." 
                className="bg-transparent text-white placeholder:text-gray-400 mt-4 mb-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Search</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      <div className="flex flex-col items-center">
        <MonitorPlay className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col items-center">
        <Medal className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col items-center">
        <Users className="text-white w-6 h-6" />
      </div>
      {status === "authenticated" ? (
        <div className="flex flex-col items-center bg-destructive p-2 rounded-md">
          <LogOut className="text-white w-6 h-6" onClick={() => signOut()} />
        </div>
      ) : status === "unauthenticated" ? (
        <div className="flex flex-col items-center bg-indigo-500 p-2 rounded-md">
          <LogIn className="text-white w-6 h-6" onClick={() => router.push("/login")} />
        </div>
      ) : status === "loading" && (
        <div className="flex flex-col items-center bg-indigo-500 p-2 rounded-md">
          <PuffLoader
            color="#ffffff"
            loading={status === "loading"}
            cssOverride={override}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default MobileNav;