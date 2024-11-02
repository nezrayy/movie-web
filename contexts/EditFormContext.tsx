"use client";

import React, { createContext, useContext, useState } from "react";
import { EntityTypes } from "@/config/fieldConfigurations";

interface EditFormContextProps {
  isOpen: boolean;
  entityType: EntityTypes | null;
  entityData: any;
  openEditForm: (type: EntityTypes, data: any) => void;
  closeEditForm: () => void;
}

const EditFormContext = createContext<EditFormContextProps | undefined>(undefined);

export const EditFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entityType, setEntityType] = useState<EntityTypes | null>(null);
  const [entityData, setEntityData] = useState<any>(null);

  const openEditForm = (type: EntityTypes, data: any) => {
    setEntityType(type);
    setEntityData(data);
    setIsOpen(true);
  };

  const closeEditForm = () => {
    setIsOpen(false);
    setEntityType(null);
    setEntityData(null);
  };

  return (
    <EditFormContext.Provider value={{ isOpen, entityType, entityData, openEditForm, closeEditForm }}>
      {children}
    </EditFormContext.Provider>
  );
};

export const useEditFormContext = () => {
  const context = useContext(EditFormContext);
  if (!context) {
    throw new Error("useEditFormContext must be used within an EditFormProvider");
  }
  return context;
};
