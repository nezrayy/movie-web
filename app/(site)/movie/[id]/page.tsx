"use client"; // Harus di paling atas

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import tanpa generic
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useSession } from "next-auth/react";
import { ReviewProvider, useReview } from "@/contexts/ReviewContext";
import ReviewTable from "@/components/review-table";

interface Actor {
  id: number;
  name: string;
}

interface Availability {
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
  linkTrailer: string;
  availabilities: Availability[];
  rating: number;
  posterUrl: string;
  actors: Actor[];
  genres: Genre[];
}

function MovieDetailContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const params = useParams(); // Tidak perlu generic type
  const [movie, setMovie] = useState<Movie | null>(null);
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { fetchReviews } = useReview();

  useEffect(() => {
    if (params.id) {
      // Fetch review hanya ketika movieId ada dan berubah
      fetchReviews(Number(params.id));
    }
  }, [params.id]); // Hanya jalankan efek ketika `params.id` berubah

  const fetchMovie = async () => {
    if (!params.id) return;
    try {
      const response = await fetch(`/api/get-movie-details/${params.id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie detail:", error);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [params.id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  function convertToEmbedLink(youtubeLink: string): string {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeLink.match(regex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`;
    } else {
      return "";
    }
  }
  const embedLink = convertToEmbedLink(movie?.linkTrailer || "");

  if (!movie) {
    return <p>Loading...</p>; // Loading state jika data belum tersedia
  }

  const handleSubmit = async () => {
    if (!session || !session.user) {
      setErrorMessage("You need to log in to add a review.");
      return;
    }

    const reviewData = {
      movieId: movie.id,
      userId: session.user.id, // Mengambil userId dari session
      commentText: reviewText,
      rating,
    };

    try {
      const response = await fetch("/api/post-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to submit review.");
        return;
      }

      setRating(0);
      setReviewText("");
      setErrorMessage(""); // Kosongkan pesan error jika berhasil
    } catch (error) {
      setErrorMessage("An error occurred while submitting the review.");
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <main>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="w-full items-center">
          {/* Video Header with Fade Effect */}
          <div className="relative w-full h-[200px] md:h-[420px] mb-4 bg-center bg-cover bg-no-repeat fade-mask">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embedLink} // Gunakan embedLink di sini
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
                  src={movie.posterUrl}
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
                  {movie.availabilities.map((movieAvailability) => (
                    <Badge
                      key={movieAvailability.id}
                      className="bg-gray-700 hover:bg-gray-700 text-white text-sm font-normal rounded-md shadow-md"
                    >
                      {movieAvailability.availability.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col pl-2">
              {/* Title */}
              <div className="text-white text-2xl md:text-6xl font-bold mb-4">
                {movie.title} ({movie.releaseYear})
              </div>
              {/* Description */}
              <div className="text-white font-light mt-2 mb-4">
                {movie.synopsis}
              </div>

              {/* Review Table */}
              <ReviewTable />

              {/* Add review */}
              <div>
                {session ? (
                  <div className="flex flex-col mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md">
                    <h3 className="text-white text-md font-normal mb-2">
                      Add your review!
                    </h3>
                    <Rating
                      style={{ maxWidth: 100 }}
                      value={rating}
                      onChange={setRating}
                    />
                    <Textarea
                      placeholder="Type your review here..."
                      className="bg-[#21212E] border-[#3d3d57] text-gray-500 w-full mt-4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex items-center mt-4">
                      <Button
                        className="bg-orange-700 hover:bg-orange-800 w-24"
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                      {errorMessage && (
                        <p className="text-red-500 text-sm ml-4">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-white mt-4">
                    You need to log in to add a review.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Detail() {
  return (
    <ReviewProvider>
      <MovieDetailContent />
    </ReviewProvider>
  );
}
