import { createContext, useState, ReactNode, useContext } from 'react';

// Definisikan tipe untuk Context
interface FilterSortContextProps {
  sortBy: string;
  yearFilter: string;
  categoryFilter: string;
  availabilityFilter: string;
  setSortBy: (value: string) => void;
  setYearFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setAvailabilityFilter: (value: string) => void;
}

// Buat context baru
const FilterSortContext = createContext<FilterSortContextProps | undefined>(undefined);

// Buat provider untuk context
export const FilterSortProvider = ({ children }: { children: ReactNode }) => {
  const [sortBy, setSortBy] = useState<string>("year_desc");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");

  return (
    <FilterSortContext.Provider value={{ sortBy, yearFilter, categoryFilter, availabilityFilter, setSortBy, setYearFilter, setCategoryFilter, setAvailabilityFilter }}>
      {children}
    </FilterSortContext.Provider>
  );
};

// Buat custom hook untuk menggunakan context
export const useFilterSort = () => {
  const context = useContext(FilterSortContext);
  if (!context) {
    throw new Error('useFilterSort must be used within a FilterSortProvider');
  }
  return context;
};
