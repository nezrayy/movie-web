"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

interface SelectElementProps {
  label: string;
  elements: string[];
  value: string;   // Tambahkan props untuk nilai yang dipilih
  onChange: (value: string) => void;  // Callback ketika nilai berubah
}

const SelectElement = ({ label, elements, value, onChange }: SelectElementProps) => {
  const [selectedValue, setSelectedValue] = useState(value || "");

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue); // Kirim nilai yang dipilih ke komponen induknya
  };

  return (
    <Select onValueChange={handleValueChange} value={selectedValue}>
      <SelectTrigger className="w-full bg-[#0C0D11] text-gray-400">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-[#0C0D11] text-white">
        {elements.map((el) => (
          <SelectItem value={el.toLowerCase()} key={el}>{el}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectElement;
