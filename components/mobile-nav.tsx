import { Search, MonitorPlay, Medal, Users, UserRound } from "lucide-react";

const MobileNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0C0D11] p-4 flex justify-around items-center shadow-lg lg:hidden z-50">
      <div className="flex flex-col items-center">
        <Search className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col items-center">
        <MonitorPlay className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col items-center">
        <Medal className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col items-center">
        <Users className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col items-center bg-indigo-500 p-2 rounded-md">
        <UserRound className="text-white w-6 h-6" />
      </div>
    </div>
  );
};

export default MobileNav;
