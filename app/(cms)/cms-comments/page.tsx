"use client";

import { useState } from "react";
import { ToggleButton } from "@/components/togglebutton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Check } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  rating: z.string().min(2).max(50),
  comments: z.string().min(2).max(100),
});

const commentsData = [
  {
    id: 1,
    name: "John",
    rating: 4,
    comment: "Bagus filmnya",
    status: "Approved",
  },
  {
    id: 2,
    name: "Doe",
    rating: 4,
    comment: "Bagus filmnya",
    status: "Unapproved",
  },
];

const CMSComments = () => {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: "",
    },
  });

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
      const allIds = commentsData.map((comment) => comment.id);
      setSelectedComments(allIds); // Select all
    }
    setSelectAll(!selectAll);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="mt-12 pl-20 pr-20 flex flex-col justify-center">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <span className="text-white font-semibold">Filtered by:</span>
          <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-white">
            <option>Unapproved</option>
            <option>Approved</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">Shows</span>
            <select className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search comments..."
              className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">
                {/* Select All Checkbox */}
                <ToggleButton
                  isChecked={selectAll}
                  onToggle={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-48">Name</TableHead>
              <TableHead className="w-32">Rating</TableHead>
              <TableHead className="w-96">Comment</TableHead>
              <TableHead className="w-32">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commentsData.map((comment, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">
                  <ToggleButton
                    isChecked={selectedComments.includes(comment.id)}
                    onToggle={() => handleToggle(comment.id)}
                  />
                </TableCell>
                <TableCell>{comment.name}</TableCell>
                <TableCell>
                  <Rating style={{ maxWidth: 65 }} value={comment.rating} />
                </TableCell>
                <TableCell>{comment.comment}</TableCell>
                <TableCell>{comment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-row gap-4">
          <Button className="bg-cyan-800 hover:bg-cyan-900">
            Approve
          </Button>
          <Button className="bg-red-600 hover:bg-red-800">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CMSComments;
