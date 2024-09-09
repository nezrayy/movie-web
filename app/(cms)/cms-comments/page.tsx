"use client";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

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

const CMSGenre = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: "",
    },
  });

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
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commentsData.map((comment, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{comment.name}</TableCell>
                <TableCell><Rating
                            style={{ maxWidth: 65 }}
                            value={comment.rating}
                          /></TableCell>
                <TableCell>{comment.comment}</TableCell>
                <TableCell>{comment.status}</TableCell>
                <TableCell>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Rename
                  </span>{" "}
                  |{" "}
                  <span className="text-red-600 hover:underline cursor-pointer">
                    Delete
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CMSGenre;
