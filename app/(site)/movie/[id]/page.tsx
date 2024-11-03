"use client"; // Harus di paling atas

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import tanpa generic
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ReviewProvider } from "@/contexts/CommentsContext";
import ReviewTable from "@/components/comments-table-client";
import { Star } from "lucide-react";

interface Actor {
  photoUrl: string;
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
  const params = useParams<{ id: string }>(); // Gunakan useParams untuk mendapatkan id dari URL
  const movieId = parseInt(params.id, 10);
  const [movie, setMovie] = useState<Movie | null>(null);
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const { fetchReviews } = useReview();

  // useEffect(() => {
  //   if (params.id) {
  //     // Fetch review hanya ketika movieId ada dan berubah
  //     fetchReviews(Number(params.id));
  //   }
  // }, [params.id]); // Hanya jalankan efek ketika `params.id` berubah

  const fetchMovie = async () => {
    if (!params.id) return;
    try {
      const response = await fetch(`/api/get-movie-details/${params.id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data) {
        console.log("DATA MOVIE:", data);
        setMovie(data);
      }
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
    return <p>Loading...</p>;
  }

  const handleSubmit = async () => {
    if (!session || !session.user) {
      setErrorMessage("You need to log in to add a review.");
      return;
    }

    if (rating === 0 || reviewText.trim() === "") {
      setErrorMessage("Please provide a rating and a comment.");
      return;
    }

    const reviewData = {
      movieId: movie.id,
      userId: session.user.id, // Mengambil userId dari session
      commentText: reviewText,
      rating,
    };
    console.log("Sending reviewData:", reviewData); // Logging data sebelum dikirim

    try {
      const response = await fetch(`/api/comments/movie/${movie.id}`, {
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

      // Reset form dan kosongkan pesan error setelah sukses
      setRating(0);
      setReviewText("");
      setErrorMessage("");

      // Update tabel review setelah review baru ditambahkan
      // Jika ReviewTable bisa menerima fungsi `refresh`, panggil di sini
      // Example: reviewTableRef.current.refresh();
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
              <div className="text-white text-2xl md:text-6xl font-bold mb-4">
                {movie.title} ({movie.releaseYear})
              </div>
              <div className="text-white font-light mt-2 mb-2">
                {movie.synopsis}
              </div>
              {/* <h3 className="text-white text-lg font-semibold">Genre</h3> */}
              <div className="genre-container flex flex-wrap gap-2 mt-4">
                {movie.genres.map(({ genre }) => (
                  <Badge
                    key={genre.id}
                    className="bg-[#21212e] hover:bg-[#191923] text-white text-sm font-normal rounded-md shadow-md"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
              <div className="text-white text-lg font-semibold mb-4 pt-4">
                <div className="flex items-center justify-start gap-2 w-16 p-2 rounded-md">
                  <p className="font-light text-lg">{movie.rating}</p>
                  <Star className="text-yellow-500 w-5" />
                </div>
              </div>
              <div className="actor-container justify-center bg-[#1C1C28] rounded-lg shadow-md p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-4">
                  {movie.actors.map(({ actor }) => (
                    <div key={actor.id} className="flex flex-col items-center">
                      <img
                        src={actor.photoUrl || "/actor-default.png"}
                        alt={actor.name}
                        className="w-30 h-36 object-cover rounded-md mb-2"
                      />
                      <p className="text-gray-300 text-sm font-medium text-center">
                        {actor.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <ReviewTable movieId={movieId} />

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
