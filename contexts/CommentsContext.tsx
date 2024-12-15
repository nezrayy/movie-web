import { createContext, useContext, useState } from "react";

interface ReviewContextType {
  comments: any[];
  loading: boolean;
  fetchComments: (movieId: number, sortOrder?: string, sortType?: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useComments = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useComments must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = async (movieId: number, sortOrder = "rating", sortType = "desc") => {
    setLoading(true);
    console.log(`Fetching comments for movieId: ${movieId} with sorting: ${sortOrder} ${sortType}`);

    try {
      const response = await fetch(`/api/comments/movie/${movieId}?sortOrder=${sortOrder}&sortType=${sortType}`);
      if (response.ok) {
        const data = await response.json();
        console.log("comments received from API:", data);
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReviewContext.Provider value={{ comments, loading, fetchComments }}>
      {children}
    </ReviewContext.Provider>
  );
};
