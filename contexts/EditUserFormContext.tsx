"use client";

import React, { createContext, useContext, useState } from "react";

interface EditUserContextProps {
  isOpen: boolean;
  userId: number | null;
  initialData: {
    role: string;
    status: string;
  } | null;
  openEditUser: (userId: number, data: { role: string; status: string }) => void;
  closeEditUser: (callback?: () => void) => void;
}

const EditUserContext = createContext<EditUserContextProps | undefined>(
  undefined
);

export const EditUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<{
    role: string;
    status: string;
  } | null>(null);

  const openEditUser = (
    userId: number,
    data: { role: string; status: string }
  ) => {
    setUserId(userId);
    setInitialData(data);
    setIsOpen(true);
  };

  const closeEditUser = (callback?: () => void) => {
    setIsOpen(false);
    setUserId(null);
    setInitialData(null);
    if (callback) callback();
  };

  return (
    <EditUserContext.Provider
      value={{ isOpen, userId, initialData, openEditUser, closeEditUser }}
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
