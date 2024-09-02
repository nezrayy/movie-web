"use client";

import ImageDropzone from "@/components/image-drop-zone";
import { useState } from "react";

const ActorCard = ({ actorName }: { actorName: string }) => {
  return (
    <div className="flex items-start justify-between space-x-2 bg-gray-200 rounded p-2">
      <div className="flex space-x-2">
        <div className="w-12 h-16 bg-gray-400 rounded"></div>
        <span className="text-gray-700">{actorName}</span>
      </div>
      <button className="text-red-500 font-semibold p-0 leading-none">x</button>
    </div>
  );
};

const CMSDramaInputPage = () => {
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
    formData.append("image", imageFile);
    formData.append("title", "Movie Title"); // example additional data

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Image uploaded successfully!");
    } else {
      console.error("Failed to upload image.");
    }
  };

  return (
    <div className="min-h-screen p-8 flex justify-center">
      <form
        className="bg-[#0C0D11] p-6 rounded-lg shadow-md w-full max-w-4xl"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="flex flex-col items-center space-y-4">
            {/* <div className="w-full h-48 bg-gray-300 rounded"></div> */}
            <ImageDropzone onImageUpload={handleImageUpload} />
            <button
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 focus:outline-none hidden md:block"
              type="submit"
            >
              Submit
            </button>
          </div>

          {/* Middle & Right Columns */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {/* Title and Alternative Title */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
              />
              <input
                type="text"
                placeholder="Alternative Title"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
              />
            </div>

            {/* Year and Country */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Year"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
              />
            </div>
            <div className="col-span-1">
              <select className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full">
                <option>Country</option>
                <option>Japan</option>
                <option>Korea</option>
                <option>China</option>
                <option>Thailand</option>
                <option>Philippines</option>
                <option>India</option>
                <option>Indonesia</option>
              </select>
            </div>

            {/* Synopsis */}
            <div className="col-span-2">
              <textarea
                placeholder="Synopsis"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full h-24"
              ></textarea>
            </div>

            {/* Availability */}
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Availability"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
              />
            </div>

            {/* Add Genres */}
            <div className="col-span-2">
              <label className="block text-white">Add Genres</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                {/* Example Genre Checkboxes */}
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-white">Action</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-white">Adventures</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-white">Romance</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-white">Drama</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-white">Slice of Life</span>
                </label>
                {/* Add more genre checkboxes as needed */}
              </div>
            </div>

            {/* Add Actors */}
            <div className="col-span-2">
              <label className="block text-white">Add Actors (Up to 9)</label>
              <input
                type="text"
                placeholder="Search Actor Names"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full mt-2"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-4">
                {/* Example Actor Cards */}
                <ActorCard actorName="Actor 1" />
                <ActorCard actorName="Actor 2" />
              </div>
            </div>

            {/* Link Trailer and Award */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Link Trailer"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
              />
            </div>
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Award"
                className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
              />
            </div>
          </div>
          <button
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 focus:outline-none block md:hidden"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CMSDramaInputPage;
