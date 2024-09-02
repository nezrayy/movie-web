"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SelectElementProps {
  label: string;
  elements: string[];
}

const SelectElement = ({ label, elements }: SelectElementProps) => {
  return (
    <Select>
      <SelectTrigger className="w-full bg-[#0C0D11] text-gray-400">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-[#0C0D11] text-white">
        {elements.map((el) => (
          <SelectItem value={el.toLowerCase()} key={el}>{el}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectElement