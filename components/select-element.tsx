"use client";

interface SelectElementProps {
  label: string;
  elements: string[];
}

const SelectElement = ({ label, elements }: SelectElementProps) => {
  return (
    <select className="w-full md:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-white">
      <option>{label}</option>
      {elements.map((el) => (
        <option value={el} key={el}>{el}</option>
      ))}
    </select>
  )
}

export default SelectElement