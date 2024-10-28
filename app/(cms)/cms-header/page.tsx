"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageDropzone from "@/components/image-drop-zone-header";

interface HeaderData {
  id: number;
  title: string;
  imageUrl: string;
}

const CMSHeader = () => {
  const [headersData, setHeadersData] = useState<HeaderData[]>([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch data headers dari API
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch("/api/headers");
        const data = await response.json();
        setHeadersData(data);
      } catch (error) {
        console.error("Error fetching headers:", error);
      }
    };

    fetchHeaders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !imageFile) {
      alert("Please provide both a title and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageFile);

    try {
      const response = await fetch("/api/headers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to add header.");
        return;
      }

      const newHeader = await response.json();
      setHeadersData((prevData) => [...prevData, newHeader]);
      setTitle("");
      setImageFile(null);
    } catch (error) {
      console.error("Error adding header:", error);
    }
  };

  const handleDelete = async (headerId: number) => {
    try {
      const response = await fetch(`/api/headers/${headerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete header.");
        return;
      }

      setHeadersData((prevData) =>
        prevData.filter((header) => header.id !== headerId)
      );
    } catch (error) {
      console.error("Error deleting header:", error);
    }
  };

  return (
    <div className="mt-12 pl-20 pr-20 flex flex-col justify-center">
      <h1 className="text-white text-2xl font-semibold mb-6">Manage Header</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="text-white">Movie Title</label>
          <Input
            placeholder="Enter movie title..."
            className="bg-transparent text-white placeholder:text-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-white">Upload Header Image</label>
          {/* <FileInput
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            accept="image/*"
          /> */}
        </div>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CMSHeader;
