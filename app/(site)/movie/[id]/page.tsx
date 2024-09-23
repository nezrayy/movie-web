"use client";

import { useEffect, useState } from "react";
import cardList from "@/app/data";
import actorList from "@/app/actor";
import reviews from "@/app/data_review";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rating, Star } from "@smastrom/react-rating";
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
import { useRouter } from "next/router";

interface Actor {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  releaseYear: string;
  synopsis: string;
  rating: number;
  posterUrl: string;
  actors: Actor[];
  genres: Genre[];
}

export default function Detail() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie[]>([]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`/api/get-movie-details/${id}`);
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie detail:", error);
    }
  };
  useEffect(() => {
    fetchMovie();
  }, [id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const card = cardList[0];
  const actors = actorList[0];
  // State untuk menyimpan rating dan teks review
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState(""); // Nilai awal teks review

  // Fungsi untuk menangani pengiriman review
  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating before submitting.");
      return;
    }
    if (!reviewText) {
      alert("Please write a review before submitting.");
      return;
    }

    // Kirim data review dan rating
    console.log("Submitted Rating:", rating);
    console.log("Submitted Review:", reviewText);

    // Reset state setelah submit
    setRating(0);
    setReviewText("");
  };
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
                  src={movie.photo}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md w-full sm:w-[240px]">
                <h3 className="text-white text-md font-normal mb-4">
                  AVAILABILITY
                </h3>
                <Separator className="my-4 bg-gray-500" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {movie.availability.map((availability, index) => (
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
            <div className="flex-1 flex flex-col pl-2">
              {/* Title */}
              <div className="text-white text-2xl md:text-6xl font-bold mb-4">
                {movie.title} ({movie.year})
              </div>
              {/* Description */}
              <div className="text-white font-light mt-2 mb-4">
                {movie.desc}
              </div>

              {/* Genre and Actor */}
              <div className="grid grid-rows-1 gap-4">
                {/* Genre */}
                <div>
                  <h3 className="text-gray-400">Genre</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movie.genre.map((genre, index) => (
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
                  <h3 className="text-gray-400">Actors</h3>
                  <div className="flex gap-4 mt-4 pb-4">
                    {actorList.map((actor) => (
                      <div
                        key={actor.id}
                        className="flex-shrink-0 w-[120px] text-center bg-[#21212E] p-2 rounded-lg"
                      >
                        <img
                          src={actor.img}
                          alt={actor.name}
                          className="w-full h-[80%] object-cover rounded-md shadow-md"
                        />
                        <p className="mt-4 text-gray-300 text-sm sm:text-xs">
                          {actor.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <h3 className="text-gray-400 mt-4">Rating</h3>
              <div className="mt-2">
                <Rating style={{ maxWidth: 100 }} value={movie.rating} />
              </div>

              {/* Review */}
              <div className="mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <h3 className="text-white text-md font-normal">Reviews</h3>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <p className="text-white text-sm">By rate:</p>
                    <Select>
                      <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                        <SelectValue placeholder="Rate" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#21212E] text-gray-400">
                        <SelectItem value="5">
                          <Rating style={{ maxWidth: 75 }} value={5} />
                        </SelectItem>
                        <SelectItem value="4">
                          <Rating style={{ maxWidth: 75 }} value={4} />
                        </SelectItem>
                        <SelectItem value="3">
                          <Rating style={{ maxWidth: 75 }} value={3} />
                        </SelectItem>
                        <SelectItem value="2">
                          <Rating style={{ maxWidth: 75 }} value={2} />
                        </SelectItem>
                        <SelectItem value="1">
                          <Rating style={{ maxWidth: 75 }} value={1} />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-white text-sm">By date:</p>
                    <Select>
                      <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#21212E] text-gray-400">
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                      </SelectContent>
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
                  value={rating}
                  onChange={setRating} // Set rating ketika diubah
                />
                <Textarea
                  placeholder="Type your review here..."
                  className="bg-[#21212E] border-[#3d3d57] text-gray-500 w-full mt-4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)} // Set teks review ketika diinput
                />
                <Button
                  className="bg-orange-700 hover:bg-orange-800 w-24 mt-4 self-end"
                  onClick={handleSubmit} // Kirim review ketika tombol ditekan
                >
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
