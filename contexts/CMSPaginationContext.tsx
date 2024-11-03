import { createContext, useContext, useState } from "react";

type PaginationContextType = {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  setTotalItems: (count: number) => void;
};

const PaginationContext = createContext<PaginationContextType | undefined>(
  undefined
);

export const PaginationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        itemsPerPage,
        setCurrentPage,
        totalItems,
        setTotalItems,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error(
      "usePaginationContext must be used within a PaginationProvider"
    );
  }
  return context;
};
