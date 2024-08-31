"use client"

import { useState } from "react";
import Modal from "./modal";

interface MovieApproveModalProps {
  releaseYear: string;
  title: string;
  actors: string[];
  genres: string[];
  synopsis: string;
  availability: string;
}

const MovieApproveModal = ({
  releaseYear,
  title,
  actors,
  genres,
  synopsis,
  availability,
}: MovieApproveModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-200 flex items-center justify-center">
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Edit status
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="flex justify-center space-x-4 mb-4">
            <button className="bg-orange-500 text-white px-4 py-2 rounded">Approve</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-[260px] h-[390px] bg-gray-300 rounded overflow-hidden">
              <img
                src="https://via.placeholder.com/200x300"
                alt="Poster"
                className="w-full h-full object-cover rounded"
              />
            </div>

            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="text-gray-700"><strong>Other titles:</strong> Title 2, Title 3, Title 4</p>
              <p className="text-gray-700"><strong>Year:</strong> {releaseYear}</p>
              <p className="text-gray-700">
                <strong>Synopsis:</strong> {synopsis}
              </p>
              <p className="text-gray-700"><strong>Genres:</strong> {genres.join(', ')}</p>
              <p className="text-gray-700"><strong>Rating:</strong> 3.5/5</p>
              <p className="text-gray-700"><strong>Availability:</strong> {availability}</p>
            </div>
          </div>

          {/* Actor Section */}
          <div className="grid grid-cols-6 gap-4 mt-6">
            {actors.map((actor, index) => (
              <div className="flex flex-col items-center" key={index}>
                <div className="w-[100px] h-[150px] bg-gray-300 rounded"></div>
                <p>{actor}</p>
              </div>
            ))}
          </div>

          {/* Trailer Section */}
          <div className="w-full h-[200px] bg-gray-300 rounded mt-6 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-500"></div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MovieApproveModal