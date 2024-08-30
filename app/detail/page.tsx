"use client";

import Sidebar, { SidebarInputItem, SidebarItem } from "@/components/sidebar";
import { MonitorPlay, Medal, Users, Search } from "lucide-react";
import { useState } from "react";
import cardList from "@/app/data"; // Asumsikan ini adalah array dengan data poster, title, dan description
import reviews from "@/app/data_review"; // Asumsikan ini adalah array dengan data review, title, dan description
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Ambil data pertama dari cardList untuk ditampilkan di grid
  const card = cardList[0]; // Misalnya kita ambil data pertama dari cardList

  return (
    <main>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen">
          <Sidebar>
            <SidebarInputItem
              icon={<Search />}
              text="Search"
              placeholder="Search..."
            />
            <a href="/">
              <SidebarItem icon={<MonitorPlay />} text="Films" />
            </a>
            <SidebarItem icon={<Medal />} text="Awards" />
            <SidebarItem icon={<Users />} text="Celebs" />
          </Sidebar>
        </div>
        {/* Main Content */}
        <div className="w-full items-center">
          {/* Video Header with Fade Effect */}
          <div className="relative w-full h-[420px] mb-4 bg-center bg-cover bg-no-repeat fade-mask">
            {/* iFrame Element */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/73_1biulkYk?autoplay=1&mute=1&loop=1&playlist=73_1biulkYk"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Background Video"
            ></iframe>
          </div>

          <div>
            <div className="container flex-1 relative mx-auto flex">
              {/* Poster Container */}
              <div className="w-[240px] h-[360px] flex-shrink-0">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
                <div className="mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md">
                  <h3 className="text-white text-md font-normal mb-4">
                    AVAILABILITY
                  </h3>
                  <Separator className="my-4 bg-gray-500" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {card.availability.map((availability, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-700 hover:bg-gray-700 text-white text-sm font-normal rounded-md shadow-md"
                      >
                        {availability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {/* Content Container */}
              <div className="flex-1 flex flex-col pt-4 pl-10">
                {/* Title */}
                <div className="text-white text-6xl font-bold mb-4">
                  {card.title} ({card.year})
                </div>
                {/* Description */}
                <div className="text-white font-light mt-2 mb-4 ml-">
                  {card.desc}
                </div>
                {/* Genre */}
                <h3 className="text-gray-400">Genre</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {card.genre.map((genre, index) => (
                    <Badge
                      key={index}
                      className="bg-[#21212E] hover:bg-[#343448] pl-3 pr-3 text-white text-sm font-normal rounded-md shadow-md"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
                {/* Actor */}
                <h3 className="text-gray-400 mt-4">Actor</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {card.actor.map((actor, index) => (
                    <Badge
                      key={index}
                      className="bg-[#21212E] hover:bg-[#343448] text-white font-normal rounded-md shadow-md"
                    >
                      {actor}
                    </Badge>
                  ))}
                </div>
                {/* Rating */}
                <h3 className="text-gray-400 mt-4">Rating</h3>
                <div className="text-yellow-400 mt-2">{card.rating} / 5</div>
                {/* Review */}
                <div className="mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-md font-normal">Reviews</h3>
                    <div className="flex items-center space-x-4">
                      <p className="text-white text-sm">Filtered by:</p>
                      <Select>
                        <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                          <SelectValue placeholder="Rate" />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-500" />
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] font-normal text-gray-300">
                          Name
                        </TableHead>
                        <TableHead className="font-normal text-gray-300">
                          Review
                        </TableHead>
                        <TableHead className="font-normal text-gray-300">
                          Rating
                        </TableHead>
                        <TableHead className="font-normal text-gray-300">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.review}>
                          <TableCell className="font-medium text-gray-300">
                            {review.userName}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {review.review}
                          </TableCell>
                          <TableCell className="text-center text-yellow-400">
                            {review.rating} / 5
                          </TableCell>
                          <TableCell className="text-xs text-gray-300">
                            {review.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Add review */}
                <div className="flex flex-col mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md">
                  <h3 className="text-white text-md font-normal mb-4">
                    Add your review!
                  </h3>
                  <Textarea
                    placeholder="Type your review here..."
                    className="bg-[#21212E] border-[#3d3d57] text-gray-500 w-full"
                  />
                  <Button className="bg-orange-700 hover:bg-orange-800 w-16 mt-4">Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
