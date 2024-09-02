"use client";


import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";

const actorsData = [
  {
    id: 1,
    actor: "Ryan Reynolds",
    country: "Indonesia",
    birthdate: "",
    photo: "",
  },
  {
    id: 2,
    actor: "Hugh Jackman",
    country: "Indonesia",
    birthdate: "",
    photo: "",
  },
  {
    id: 3,
    actor: "Channing Tatum",
    country: "Indonesia",
    birthdate: "",
    photo: "",
  },
];

const CMSActor = () => {
  const [date, setDate] = React.useState<Date>();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', 'Movie Title'); // example additional data

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Image uploaded successfully!');
    } else {
      console.error('Failed to upload image.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 flex flex-col justify-center">
      <form className="w-full sm:w-1/4 mb-4">
        <input
          type="text"
          placeholder="Enter actor..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full mb-3"
        />
        <input
          type="text"
          placeholder="Enter country..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full mb-3"
        />
        
        <Button className="bg-orange-700 hover:bg-orange-800 w-16 ml-4">
          Submit
        </Button>
      </form>

      {/* Filter Section */}
      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <input
          type="text"
          placeholder="Search actor..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Birthdate</TableHead>
              <TableHead className="w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actorsData.map((actor, index) => (
              <TableRow key={index} className="text-white hover:bg-muted/5">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{actor.actor}</TableCell>
                <TableCell>{actor.country}</TableCell>
                <TableCell>{actor.birthdate}</TableCell>
                <TableCell>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Edit
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

export default CMSActor;
