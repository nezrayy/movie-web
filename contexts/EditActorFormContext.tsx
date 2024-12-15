"use client";

import React, { createContext, useContext, useState } from "react";

interface EditActorContextProps {
  isOpen: boolean;
  actorData: {
    id: number;
    name: string;
    birthdate: string;
    country: { id: number; name: string };
    photoUrl: string;
  } | null;
  openEditActor: (data: {
    id: number;
    name: string;
    birthdate: string;
    country: { id: number; name: string };
    photoUrl: string;
  }) => void;
  closeEditActor: (callback?: () => void) => void;
}

const EditActorContext = createContext<EditActorContextProps | undefined>(
  undefined
);

export const EditActorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [actorData, setActorData] = useState<{
    id: number;
    name: string;
    birthdate: string;
    country: { id: number; name: string };
    photoUrl: string;
  } | null>(null);

  const openEditActor = (data: {
    id: number;
    name: string;
    birthdate: string;
    country: { id: number; name: string };
    photoUrl: string;
  }) => {
    setActorData(data);
    setIsOpen(true);
  };

  const closeEditActor = (callback?: () => void) => {
    setIsOpen(false);
    setActorData(null);
    if (callback) callback(); // Eksekusi callback jika ada
  };

  return (
    <EditActorContext.Provider
      value={{
        isOpen,
        actorData,
        openEditActor,
        closeEditActor,
      }}
    >
      {children}
    </EditActorContext.Provider>
  );
};

export const useEditActorContext = () => {
  const context = useContext(EditActorContext);
  if (!context) {
    throw new Error(
      "useEditActorContext must be used within an EditActorProvider"
    );
  }
  return context;
};
