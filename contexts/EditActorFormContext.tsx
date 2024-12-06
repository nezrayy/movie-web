"use client";

import React, { createContext, useContext, useState } from "react";

interface EditActorContextProps {
  isOpen: boolean;
  actorData: any;
  openEditForm: (data: any) => void;
  closeEditForm: (callback?: () => void) => void;
}

const EditActorContext = createContext<EditActorContextProps | undefined>(
  undefined
);

export const EditActorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [actorData, setActorData] = useState<any>(null);

  const openEditForm = (data: any) => {
    setActorData(data);
    setIsOpen(true);
  };

  const closeEditForm = (callback?: () => void) => {
    setIsOpen(false);
    setActorData(null);
    if (callback) callback(); // Eksekusi callback jika ada
  };

  return (
    <EditActorContext.Provider
      value={{ isOpen, actorData, openEditForm, closeEditForm }}
    >
      {children}
    </EditActorContext.Provider>
  );
};

export const useEditActorContext = () => {
  const context = useContext(EditActorContext);
  if (!context) {
    throw new Error("useEditActorContext must be used within an EditActorProvider");
  }
  return context;
};
