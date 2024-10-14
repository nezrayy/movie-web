import { createContext, useContext, useState } from "react";

interface ReviewContextType {
  reviews: any[];
  loading: boolean;
  fetchReviews: (movieId: number, sortOrder?: string, sortType?: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReviews = async (movieId: number, sortOrder = "rating", sortType = "desc") => {
    setLoading(true);
    console.log(`Fetching reviews for movieId: ${movieId} with sorting: ${sortOrder} ${sortType}`);

    try {
      const response = await fetch(`/api/get-comments/${movieId}?sortOrder=${sortOrder}&sortType=${sortType}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Reviews received from API:", data);
        setReviews(data);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, loading, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
