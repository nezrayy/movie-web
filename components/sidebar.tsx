"use client";

import {
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
  UserRound,
  LogOut,
  LogIn,
  FolderOpen,
  Home,
} from "lucide-react";
import { useContext, createContext, useState, ReactNode, useRef } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

interface SidebarContextProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const router = useRouter();
  const { data: session, status } = useSession(); // Ambil status dari useSession()
  const pathname = usePathname();

  // Cek apakah sedang berada di halaman /cms-*
  const isCmsPage = pathname.startsWith("/cms-");
  return (
    <aside className="h-screen outline-0">
      <nav className="h-full flex flex-col bg-[#0C0D11] shadow-sm">
        <div className="p-4 pb-4 flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className={`overflow-hidden transition-all font-extrabold text-white text-2xl hover:cursor-pointer 
              ${expanded ? "w-32" : "w-0"}`}
          >
            <img src="/rewatch.png" alt="" className="w-[240px]" />
          </h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 outline-none"
          >
            {expanded ? <ChevronsLeft /> : <ChevronsRight />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded, setExpanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="flex p-3 justify-between gap-2">
          {status === "loading" ? (
            // Tampilkan loading indicator jika status masih loading
            <div className="text-white">Loading...</div>
          ) : status === "authenticated" && session.user.role === "USER" ? (
            <div className="p-3 rounded-md bg-indigo-500">
              <UserRound className="text-white" />
            </div>
          ) : status === "authenticated" && session.user.role === "ADMIN" ? (
            <div
              className="relative group p-3 rounded-md bg-indigo-500 hover:cursor-pointer hover:bg-indigo-700 transition-colors ease-in-out"
              onClick={() => router.push(isCmsPage ? "/" : "/cms-films")}
            >
              {/* Icon berubah tergantung halaman */}
              {isCmsPage ? (
                <Home className="text-white" />
              ) : (
                <FolderOpen className="text-white" />
              )}

              {/* Tooltip */}
              {!expanded && (
                <div
                  className="
        absolute left-full -translate-y-1/2 top-1/2 rounded-md px-2 py-1 ml-8
        bg-white text-[#0C0D11] text-md font-medium
        invisible opacity-0 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      "
                >
                  {isCmsPage ? "Home" : "CMS"}
                </div>
              )}
            </div>
          ) : (
            <div
              className="p-3 rounded-md bg-indigo-500 hover:cursor-pointer hover:bg-indigo-700 transition-colors ease-in-out"
              onClick={() => router.push("/login")}
            >
              <LogIn className="text-white" />
            </div>
          )}

          <div
            className={`flex justify-between items-center overflow-hidden transition-all gap-x-2 ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            {status === "authenticated" && (
              <div className="leading-4 max-w-[120px]">
                {session?.user?.username && (
                  <h4 className="font-semibold text-white mb-1">
                    {session?.user?.username}
                  </h4>
                )}
                {session?.user?.email && (
                  <span className="text-xs text-gray-600 truncate block w-full overflow-hidden text-ellipsis">
                    {session?.user?.email}
                  </span>
                )}
              </div>
            )}
            {status === "authenticated" && (
              <div className="ml-5">
                <Button variant="destructive" className="py-6 px-3" onClick={() => signOut()}>
                  <LogOut />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }

  const { expanded } = context;

  return (
    <div className="my-2">
      <li
        className={`
          relative flex items-center py-4 px-4 my-1 mt-2 mb-2
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active ? "bg-[#21212E] text-white" : "hover:bg-[#21212E] text-white"
          }
      `}
      >
        {icon}
        <span
          className={`text-xl overflow-hidden transition-all ${
            expanded ? "w-30 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
        {!expanded && (
          <div
            className={`
      absolute left-full rounded-md px-2 py-1 ml-6
      bg-white text-[#0C0D11] text-md
      invisible opacity-20 -translate-x-3 transition-all
      group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      whitespace-nowrap overflow-hidden text-ellipsis
    `}
          >
            {text}
          </div>
        )}
      </li>
    </div>
  );
}

interface SidebarInputItemProps {
  icon: ReactNode;
  text?: string;
  placeholder?: string;
  active?: boolean;
  alert?: boolean;
}
export function SidebarInputItem({
  icon,
  text,
  placeholder = "Search...",
  active,
  alert,
}: SidebarInputItemProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const context = useContext(SidebarContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Ganti spasi dengan "+"
      const formattedQuery = query.replace(/ /g, "+");
      router.push(`/search?search_query=${formattedQuery}`);
    }
  };

  const handleIconClick = () => {
    // Expand the sidebar if not expanded
    if (!context?.expanded) {
      // @ts-ignore
      context.setExpanded(true);
    }
    // Focus the input
    inputRef.current?.focus();
  };

  if (!context) {
    throw new Error("SidebarInputItem must be used within a Sidebar");
  }

  const { expanded } = context;

  return (
    <div className="my-2 relative group">
      <div
        className={`relative flex items-center font-medium rounded-md transition-all ${
          expanded ? "w-full" : "px-0 w-0"
        }`}
      >
        {expanded ? (
          <Input
            ref={inputRef}
            placeholder={placeholder}
            className="bg-[#21212E] flex h-14 w-full rounded-md px-4 text-sm border-none ring-offset-background file:bg-transparent file:text-sm file:font-light font-light text-white caret-white placeholder:text-white placeholder:font-normal focus:ring-[#414164] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <div
            onClick={handleIconClick} // When icon is clicked, expand and focus
            className={`relative flex items-center py-4 px-4 font-medium rounded-md cursor-pointer transition-colors ${
              active
                ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                : "hover:bg-[#21212E] text-white"
            }`}
          >
            <div className="icon overflow-hidden transition-all">{icon}</div>
          </div>
        )}

        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
      </div>

      {!expanded && text && (
        <div
          className={`
            absolute left-[100%] transform -translate-y-11 rounded-md px-2 py-1 ml-6
            bg-white text-[#0C0D11] text-md font-medium
            invisible opacity-0 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </div>
  );
}
