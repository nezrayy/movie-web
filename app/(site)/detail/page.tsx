"use client";

import { useState } from "react";
import cardList from "@/app/data";
import reviews from "@/app/data_review";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Detail() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rating, setRating] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const card = cardList[0];

  return (
    <main>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="w-full items-center">
          {/* Video Header with Fade Effect */}
          <div className="relative w-full h-[200px] md:h-[420px] mb-4 bg-center bg-cover bg-no-repeat fade-mask">
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

          <div className="container flex flex-col md:flex-row mx-auto gap-4 p-4">
            {/* Poster Container */}
            <div className="flex flex-col w-full sm:w-auto items-center">
              <div className="w-[120px] h-[180px] sm:w-[240px] sm:h-[360px] flex-shrink-0">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md w-full sm:w-[240px]">
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
            <div className="flex-1 flex flex-col">
              {/* Title */}
              <div className="text-white text-2xl md:text-6xl font-bold mb-4">
                {card.title} ({card.year})
              </div>
              {/* Description */}
              <div className="text-white font-light mt-2 mb-4">{card.desc}</div>

              {/* Genre and Actor */}
              <div className="grid grid-rows-1 gap-4">
                {/* Genre */}
                <div>
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
                </div>
                {/* Actor */}
                <div>
                  <h3 className="text-gray-400">Actor</h3>
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
                </div>
              </div>

              {/* Rating */}
              <h3 className="text-gray-400 mt-4">Rating</h3>
              <div className="text-yellow-400 mt-2">{card.rating}/ 5</div>

              {/* Review */}
              <div className="mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <h3 className="text-white text-md font-normal">Reviews</h3>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
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
                    <TableRow className="hover:bg-transparent">
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
                      <TableRow
                        className="hover:bg-muted/5"
                        key={review.review}
                      >
                        <TableCell className="font-medium text-gray-300">
                          {review.userName}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {review.review}
                        </TableCell>
                        <TableCell className="text-center text-yellow-400">
                          <Rating
                            style={{ maxWidth: 65 }}
                            value={review.rating}
                          />
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
                <h3 className="text-white text-md font-normal mb-2">
                  Add your review!
                </h3>
                <Rating
                  style={{ maxWidth: 100 }}
                  value={0}
                  onChange={setRating}
                />
                <Textarea
                  placeholder="Type your review here..."
                  className="bg-[#21212E] border-[#3d3d57] text-gray-500 w-full mt-4"
                />
                <Button className="bg-orange-700 hover:bg-orange-800 w-24 mt-4 self-end">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
