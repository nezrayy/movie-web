"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  initialDate?: Date;
  onError?: (error: "required" | "invalid" | null) => void; // New prop for error handling
}

export function DatePicker({ initialDate, onError }: Props) {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [stringDate, setStringDate] = useState(
    initialDate ? format(initialDate, "PPP") : ""
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDateChange = (inputDate: string) => {
    if (!inputDate) {
      setErrorMessage("Birthdate is required");
      onError && onError("required");
      return;
    }

    const parsedDate = new Date(inputDate);
    if (parsedDate.toString() === "Invalid Date") {
      setErrorMessage("Invalid Date");
      onError && onError("invalid");
    } else {
      setErrorMessage("");
      setDate(parsedDate);
      setStringDate(format(parsedDate, "PPP"));
      onError && onError(null); // Clear error if valid
    }
  };

  return (
    <Popover key={date?.getDate()}>
      <div className="relative w-full">
        <Input
          type="string"
          value={stringDate}
          className="bg-transparent placeholder:text-gray-400 text-gray-400"
          placeholder="Enter birthdate..."
          onFocus={() => {
            if (date) setStringDate(format(date, "MM/dd/yyyy"));
          }}
          onChange={(e) => setStringDate(e.target.value)}
          onBlur={(e) => handleDateChange(e.target.value)} // Handle validation on blur
        />
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "bg-transparent text-gray-500",
              "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          className="bg-[#14141E] text-gray-500"
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          defaultMonth={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;
            setDate(selectedDate);
            setStringDate(format(selectedDate, "PPP"));
            setErrorMessage("");
            onError && onError(null); // Clear error on valid selection
          }}
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
