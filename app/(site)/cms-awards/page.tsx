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
          placeholder="Search movies..."
          className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">#</th>
              <th className="py-2 px-4 border-b text-left">Country</th>
              <th className="py-2 px-4 border-b text-left">Year</th>
              <th className="py-2 px-4 border-b text-left">Award</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {awardsData.map((award, index) => (
              <tr className="bg-red-50" key={award.id}>
                <td className="py-2 px-4 border-b">{index+1}</td>
                <td className="py-2 px-4 border-b">
                  {award.country}
                </td>
                <td className="py-2 px-4 border-b">
                  {award.year}
                </td>
                <td className="py-2 px-4 border-b">
                  {award.award}
                </td>
                <td className="py-2 px-4 border-b">
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Edit
                  </span>{" "}
                  |{" "}
                  <span className="text-red-600 hover:underline cursor-pointer">
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CMSDrama