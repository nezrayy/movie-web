import { useState } from "react";
import { Check } from "lucide-react"; // Pastikan sudah mengimpor ikon Check dari Lucide

interface ToggleButtonProps {
  isChecked: boolean;
  onToggle: () => void;
}

export function ToggleButton({ isChecked, onToggle }: ToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded"
    >
      {isChecked && <Check className="w-4 h-4 text-white" />}
    </button>
  );
}
