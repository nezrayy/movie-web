"use client";

import { useState, useEffect } from "react";
import { ToggleButton } from "@/components/togglebutton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import Select dari Shadcn

interface Comment {
  id: number;
  user: {
    username: string;
  };
  rating: number;
  commentText: string;
  status: string;
  movieId: number;
}

const CMSComments = () => {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all"); // Filter status

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments");
        const data = await response.json();
        setCommentsData(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, []);

  // Filter comments by status
  const filteredComments =
    filterStatus === "all"
      ? commentsData
      : commentsData.filter((comment) => comment.status === filterStatus);

  const handleToggle = (id: number) => {
    setSelectedComments((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((commentId) => commentId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedComments([]); // Deselect all
    } else {
      const allIds = filteredComments.map((comment) => comment.id);
      setSelectedComments(allIds); // Select all
    }
    setSelectAll(!selectAll);
  };

  // Fungsi untuk menghapus beberapa komentar yang dipilih
  const handleDeleteSelected = async () => {
    if (selectedComments.length === 0) {
      alert("Please select comments to delete.");
      return;
    }

    try {
      const deleteRequests = selectedComments.map((commentId) =>
        fetch(`/api/comments/${commentId}`, {
          method: "DELETE",
        })
      );

      const results = await Promise.all(deleteRequests);
      const failedDeletes = results.filter((result) => !result.ok);
      if (failedDeletes.length > 0) {
        console.error("Some comments failed to delete.");
        return;
      }

      setCommentsData((prevComments) =>
        prevComments.filter((comment) => !selectedComments.includes(comment.id))
      );
      setSelectedComments([]);
    } catch (error) {
      console.error("Error deleting comments:", error);
    }
  };

  const handleToggleStatusSelected = async () => {
    if (selectedComments.length === 0) {
      alert("Please select comments to toggle status.");
      return;
    }

    try {
      const toggleRequests = selectedComments.map((commentId) =>
        fetch(`/api/comments/${commentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        })
      );

      const results = await Promise.all(toggleRequests);
      const failedToggles = results.filter((result) => !result.ok);
      if (failedToggles.length > 0) {
        console.error("Some comments failed to toggle status.");
        return;
      }

      setCommentsData((prevComments) =>
        prevComments.map((comment) =>
          selectedComments.includes(comment.id)
            ? {
                ...comment,
                status: comment.status === "APPROVE" ? "UNAPPROVE" : "APPROVE",
              }
            : comment
        )
      );
      setSelectedComments([]);
    } catch (error) {
      console.error("Error toggling comment status:", error);
    }
  };

  return (
    <div className="mt-12 pl-20 pr-20 flex flex-col justify-center">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <span className="text-white font-semibold">Filter by status:</span>
          <Select onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#21212E] text-gray-400">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="APPROVE">Approved</SelectItem>
              <SelectItem value="UNAPPROVE">Unapproved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white font-semibold">Show:</span>
          <Select>
            <SelectTrigger className="w-36 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent className="bg-[#21212E] text-gray-400">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">
                <ToggleButton
                  isChecked={selectAll}
                  onToggle={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-48">Name</TableHead>
              <TableHead className="w-32">Rating</TableHead>
              <TableHead className="w-96">Comment</TableHead>
              <TableHead className="w-96">Movie</TableHead>
              <TableHead className="w-32">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments.map((comment, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">
                  <ToggleButton
                    isChecked={selectedComments.includes(comment.id)}
                    onToggle={() => handleToggle(comment.id)}
                  />
                </TableCell>
                <TableCell>{comment.user.username}</TableCell>
                <TableCell>
                  <Rating style={{ maxWidth: 65 }} value={comment.rating} />
                </TableCell>
                <TableCell>{comment.commentText}</TableCell>
                <TableCell>{comment.movieId}</TableCell>
                <TableCell>{comment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-row gap-4 mt-4">
          <Button
            className="bg-red-800 hover:bg-red-900"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleToggleStatusSelected}
          >
            Change Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CMSComments;
