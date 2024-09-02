"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const countriesData = [
  {
    id: 1,
    country: "Japan",
  },
  {
    id: 2,
    country: "Indonesia",
  },
  {
    id: 3,
    country: "United States",
  },
  {
    id: 4,
    country: "England",
  },
];

const CMSDrama = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 flex flex-col justify-center">
      <form className="flex relative w-full sm:w-1/4 mb-4">
        <input
          type="text"
          placeholder="Enter country..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full mb-3"
        />
        <Button className="bg-orange-700 hover:bg-orange-800 w-16 ml-4">
          Submit
        </Button>
      </form>

      {/* Filter Section */}
      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <input
          type="text"
          placeholder="Search country..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>#</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countriesData.map((country, index) => (
              <TableRow key={index} className="text-white hover:bg-muted/5">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{country.country}</TableCell>
                <TableCell>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Rename
                  </span>{" "}
                  |{" "}
                  <span className="text-red-600 hover:underline cursor-pointer">
                    Delete
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CMSDrama;
