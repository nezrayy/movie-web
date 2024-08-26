"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectElementProps {
  trigger: string;
  elements: string[];
}

const SelectElement = ({ trigger, elements }: SelectElementProps) => {
  return (
    <Select>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={trigger} />
      </SelectTrigger>
      <SelectContent>
        {elements.map((el) => (
          <SelectItem value={el}>
            {el}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectElement