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
import { usePaginationContext } from "@/contexts/CMSPaginationContext";
import { Input } from "@/components/ui/input";

interface Comment {
  id: number;
  user: {
    username: string;
  };
  rating: number;
  commentText: string;
  status: string;
  movie: {
    id: number;
    title: string;
    releaseYear: number;
  };
}

const CMSComments = () => {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all"); // Filter status
  const [searchTerm, setSearchTerm] = useState<string>(""); // State untuk pencarian
  const [filterRating, setFilterRating] = useState<number | null>(null); // State untuk filter rating

  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    totalItems,
    setTotalItems,
  } = usePaginationContext();

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments");
        const data = await response.json();
        setCommentsData(data);
        setTotalItems(data.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [setTotalItems]);

  const onPageChange = (direction: "next" | "prev") => {
    if (
      direction === "next" &&
      currentPage < Math.ceil(totalItems / itemsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter comments by status
  const filteredComments = commentsData
    .filter((comment) => {
      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        comment.user.username.toLowerCase().includes(searchLower) ||
        comment.commentText.toLowerCase().includes(searchLower) ||
        comment.movie.title.toLowerCase().includes(searchLower);

      // Filter by rating if filterRating is set
      const matchesRating =
        filterRating !== null ? comment.rating === filterRating : true;

      // Filter by status
      const matchesStatus =
        filterStatus === "all" || comment.status === filterStatus;

      return matchesSearch && matchesRating && matchesStatus;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

      // Panggil endpoint untuk update rating setiap kali ada komentar diubah statusnya ke "APPROVE"
      const movieIdSet = new Set(
        selectedComments.map(
          (commentId) =>
            commentsData.find((comment) => comment.id === commentId)?.movie.id
        )
      );

      for (const movieId of movieIdSet) {
        if (movieId) {
          await fetch(`/api/comments/movie/${movieId}`, {
            method: "PATCH",
          });
        }
      }

      setSelectedComments([]);
    } catch (error) {
      console.error("Error toggling comment status:", error);
    }
  };

  return (
    <div className="mt-12 px-2 sm:px-20 flex flex-col justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Comments
        </h1>
      </div>
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
        {/* Search Bar */}
        <div className="w-full sm:w-1/3">
          <Input
            type="text"
            placeholder="Search by name, comment, or movie title..."
            className="bg-transparent text-gray-400 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter by Rating */}
        <div className="flex items-center space-x-4">
          <span className="text-white font-semibold">Filter by rating:</span>
          <Select
            onValueChange={(value) => setFilterRating(Number(value) || null)}
          >
            <SelectTrigger className="w-24 bg-[#21212E] text-gray-400 border-none focus:ring-transparent">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="bg-[#21212E] text-gray-400">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">
                <Rating style={{ maxWidth: 65 }} value={1} />
              </SelectItem>
              <SelectItem value="2">
                <Rating style={{ maxWidth: 65 }} value={2} />
              </SelectItem>
              <SelectItem value="3">
                {" "}
                <Rating style={{ maxWidth: 65 }} value={3} />
              </SelectItem>
              <SelectItem value="4">
                {" "}
                <Rating style={{ maxWidth: 65 }} value={4} />
              </SelectItem>
              <SelectItem value="5">
                {" "}
                <Rating style={{ maxWidth: 65 }} value={5} />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto outline outline-1 rounded-md text-white">
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
                <TableCell>
                  {comment.movie.title} ({comment.movie.releaseYear})
                </TableCell>{" "}
                {/* Display movie title */}
                <TableCell>{comment.status}D</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        {/* Div untuk tombol operasi di kiri */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            className="bg-red-800 hover:bg-red-900"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleToggleStatusSelected}
          >
            Change Status
          </Button>
        </div>

        {/* Div untuk tombol paginasi di kanan */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange("next")}
            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CMSComments;
