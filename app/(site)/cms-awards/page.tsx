import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const awardsData = [
  {
    id: 1,
    country: "Japan",
    year: '2024',
    award: "Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award Japanese Spring Drama Award",
  },
  {
    id: 2,
    country: "Japan",
    year: '2022',
    award: "Japanese Spring Drama Award",
  },
]

const CMSDrama = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 flex flex-col justify-center">
      <form className="w-full sm:w-1/4 bg-[#0C0D11] mb-4">
        <input
          type="text"
          placeholder="Enter country..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full mb-3"
        />
        <input
          type="text"
          placeholder="Enter year..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full mb-3"
        />
        <input
          type="text"
          placeholder="Enter award..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full mb-3"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors mb-4"
        >
          Submit
        </button>
      </form>

      {/* Filter Section */}
      <div className="w-full sm:w-1/6 mb-4 ml-auto">
        <input
          type="text"
          placeholder="Search awards..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Award</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awardsData.map((award, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">{index+1}</TableCell>
                <TableCell>{award.country}</TableCell>
                <TableCell>{award.year}</TableCell>
                <TableCell>{award.award}</TableCell>
                <TableCell>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Edit
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
  )
}

export default CMSDrama