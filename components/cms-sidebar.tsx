"use client";

import {
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
  UserRound,
} from "lucide-react";
import { useContext, createContext, useState, ReactNode } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

interface SidebarContextProps {
  expanded: boolean;
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

  return (
    <aside className="h-screen outline-0">
      <nav className="h-full flex flex-col bg-[#0C0D11] shadow-sm">
        <div className="p-4 pb-4 flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className={`overflow-hidden transition-all font-extrabold text-white text-2xl hover:cursor-pointer ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Logo
          </h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 outline-none"
          >
            {expanded ? <ChevronsLeft /> : <ChevronsRight />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="flex p-3">
          <div className="p-3 rounded-md bg-indigo-500">
            <UserRound className="text-white" />
          </div>

          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">User 1</h4>
              <span className="text-xs text-gray-600">user1@gmail.com</span>
            </div>
            <MoreVertical size={20} />
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
            active
              ? "bg-[#21212E] text-white"
              : "hover:bg-[#21212E] text-white"
          }
      `}
      >
        {icon}
        <span
          className={`text-md overflow-hidden transition-all ${
            expanded ? "w-30 ml-3" : "w-0 whitespace-nowrap"
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
          absolute left-full rounded-md px-2 py-1 ml-6 whitespace-nowrap
          bg-white text-[#0C0D11] text-md
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
          >
            {text}
          </div>
        )}
      </li>
    </div>
  );
}

// interface SidebarInputItemProps {
//   icon: ReactNode;
//   text?: string;
//   placeholder?: string;
//   active?: boolean;
//   alert?: boolean;
// }
// export function SidebarInputItem({
//   icon,
//   text,
//   placeholder = "Search...",
//   active,
//   alert,
// }: SidebarInputItemProps) {
//   const [query, setQuery] = useState('');
//   const router = useRouter();
//   const context = useContext(SidebarContext);

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       // Ganti spasi dengan "+"
//       const formattedQuery = query.replace(/ /g, '+');
//       router.push(`/search?search_query=${formattedQuery}`);
//     }
//   };

//   if (!context) {
//     throw new Error("SidebarInputItem must be used within a Sidebar");
//   }

//   const { expanded } = context;

//   return (
//     <div className="my-2 relative group">
//       <div
//         className={`relative flex items-center font-medium rounded-md transition-all ${
//           expanded ? "w-full" : "px-0 w-0"
//         }`}
//       >
//         {expanded ? (
//           <Input
//             placeholder={placeholder}
//             className="bg-[#21212E] flex h-14 w-full rounded-md px-4 text-sm border-none ring-offset-background file:bg-transparent file:text-sm file:font-light font-light text-white caret-white placeholder:text-white placeholder:font-normal focus:ring-[#414164] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//           />
//         ) : (
//           <div
//             className={`relative flex items-center py-4 px-4 font-medium rounded-md cursor-pointer transition-colors ${
//               active
//                 ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                 : "hover:bg-[#21212E] text-white"
//             }`}
//           >
//             <div className="icon overflow-hidden transition-all">{icon}</div>
//           </div>
//         )}

//         {alert && (
//           <div
//             className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
//               expanded ? "" : "top-2"
//             }`}
//           />
//         )}
//       </div>

//       {!expanded && text && (
//         <div
//           className={`
//             absolute left-[100%] transform -translate-y-11 rounded-md px-2 py-1 ml-6
//             bg-white text-[#0C0D11] text-md font-medium
//             invisible opacity-0 -translate-x-3 transition-all
//             group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//           `}
//         >
//           {text}
//         </div>
//       )}
//     </div>
//   );
// }