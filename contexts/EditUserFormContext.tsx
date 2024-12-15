"use client";

import React, { createContext, useContext, useState } from "react";

interface EditUserContextProps {
  isOpen: boolean;
  userData: {
    id: number;
    role: string;
    status: string;
  } | null;
  openEditUser: (data: { id: number; role: string; status: string }) => void;
  closeEditUser: (callback?: () => void) => void;
}

const EditUserContext = createContext<EditUserContextProps | undefined>(
  undefined
);

export const EditUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{
    id: number;
    role: string;
    status: string;
  } | null>(null);

  const openEditUser = (data: { id: number; role: string; status: string }) => {
    setUserData(data);
    setIsOpen(true);
  };

  const closeEditUser = (callback?: () => void) => {
    setIsOpen(false);
    setUserData(null);
    if (callback) callback(); // Panggil callback jika ada
  };

  return (
    <EditUserContext.Provider
      value={{
        isOpen,
        userData,
        openEditUser,
        closeEditUser,
      }}
    >
      {children}
    </EditUserContext.Provider>
  );
};

export const useEditUserContext = () => {
  const context = useContext(EditUserContext);
  if (!context) {
    throw new Error(
      "useEditUserContext must be used within an EditUserProvider"
    );
  }
  return context;
};
