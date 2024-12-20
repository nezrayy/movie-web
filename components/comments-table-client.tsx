import { useEffect, useState } from "react";
import { useComments } from "@/contexts/CommentsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@smastrom/react-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function commentTable({ movieId }) {
  const {comments, loading, fetchComments } = useComments();
  const [commentList, setCommentList] = useState([]);
  const [sortOrder, setSortOrder] = useState("rating");
  const [sortType, setSortType] = useState("desc");

  useEffect(() => {
    if (movieId) {
      // Pastikan movieId sudah tersedia sebelum fetch
      fetchComments(movieId, sortOrder, sortType);
    }
  }, [movieId, sortOrder, sortType]);

  useEffect(() => {
    if (!loading) {
      // Filter komentar dengan status "APPROVE"
      const approvedComments = comments.filter(
        (comment) => comment.status === "APPROVE"
      );
      setCommentList(approvedComments);
    }
  }, [loading, comments]);

  return (
    <div className="mt-4 p-4 bg-[#1C1C28] rounded-lg shadow-md">
      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        <p className="text-white text-sm">Sort by rate:</p>
        <Select
          onValueChange={(value) => {
            setSortOrder("rating");
            setSortType(value === "5" ? "desc" : "asc");
          }}
        >
          <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
            <SelectValue placeholder="Rate" />
          </SelectTrigger>
          <SelectContent className="bg-[#21212E] text-gray-400">
            <SelectItem value="5">Highest to Lowest</SelectItem>
            <SelectItem value="1">Lowest to Highest</SelectItem>
          </SelectContent>
        </Select>

        <p className="text-white text-sm">Sort by date:</p>
        <Select
          onValueChange={(value) => {
            setSortOrder("createdAt");
            setSortType(value === "newest" ? "desc" : "asc");
          }}
        >
          <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent className="bg-[#21212E] text-gray-400">
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4 bg-gray-500" />

      {commentList.length === 0 ? (
        <p className="text-white text-center">Be the first one to review!</p>
      ) : (
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
              <TableHead className="font-normal text-gray-300">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commentList.map((comment) => (
              <TableRow className="hover:bg-muted/5" key={comment.id}>
                <TableCell className="font-medium text-gray-300">
                  {comment.user.username}
                </TableCell>
                <TableCell className="text-gray-300">
                  {comment.commentText}
                </TableCell>
                <TableCell className="text-center text-yellow-400">
                  <Rating
                    style={{ maxWidth: 65 }}
                    value={comment.rating}
                    readOnly
                  />
                </TableCell>
                <TableCell className="text-xs text-gray-300">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
