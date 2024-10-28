'use client'

import { useState, useEffect } from "react";
import { Input } from "./ui/input";

export const ActorSearch = ({ control, field }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actors, setActors] = useState([]); // Menyimpan hasil pencarian aktor
  const [selectedActors, setSelectedActors] = useState([]); // Aktor yang dipilih

  // Fetch aktor dari backend saat user mengetik
  const fetchActors = async (term) => {
    const response = await fetch(`/api/get-actors?search=${term}`);
    const data = await response.json();
    setActors(data);
  };

  // Lakukan pencarian setiap kali nilai searchTerm berubah
  useEffect(() => {
    if (searchTerm.length > 2) { // Fetch jika lebih dari 2 karakter
      fetchActors(searchTerm);
    } else {
      setActors([]); // Kosongkan jika pencarian terlalu pendek
    }
  }, [searchTerm]);

  // Fungsi untuk menambahkan aktor yang dipilih
  const addActor = (actorName) => {
    if (selectedActors.length < 9 && !selectedActors.includes(actorName)) {
      setSelectedActors([...selectedActors, actorName]);
      field.onChange([...field.value, actorName]); // Tambahkan aktor ke field form
    }
  };

  // Fungsi untuk menghapus aktor yang dipilih
  const removeActor = (actorName) => {
    const updatedActors = selectedActors.filter((name) => name !== actorName);
    setSelectedActors(updatedActors);
    field.onChange(updatedActors); // Update nilai field form
  };

  return (
    <div>
      {/* Input untuk pencarian */}
      <Input
        placeholder="Search for actor names"
        className="bg-transparent text-white placeholder:text-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Hasil pencarian */}
      {actors.length > 0 && (
        <ul className="mt-2 bg-white rounded p-2">
          {actors.map((actor) => (
            <li
              key={actor.id}
              onClick={() => addActor(actor.name)}
              className="cursor-pointer hover:bg-gray-200 p-1"
            >
              {actor.name}
            </li>
          ))}
        </ul>
      )}

      {/* Aktor yang sudah dipilih */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-4">
        {selectedActors.map((actorName) => (
          <ActorCard
            key={actorName}
            actorName={actorName}
            onRemove={() => removeActor(actorName)}
          />
        ))}
      </div>
    </div>
  );
};

const ActorCard = ({ actorName, onRemove }) => {
  return (
    <div className="flex items-start justify-between space-x-2 bg-gray-200 rounded p-2">
      <div className="flex space-x-2">
        <div className="w-12 h-16 bg-gray-400 rounded"></div>
        <span className="text-gray-700">{actorName}</span>
      </div>
      <button className="text-red-500 font-semibold p-0 leading-none" onClick={onRemove}>
        x
      </button>
    </div>
  );
};
