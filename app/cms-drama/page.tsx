

const CMSDrama = () => {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-semibold">Filtered by:</span>
          <select className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-300">
            <option>Unapproved</option>
            <option>Approved</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-semibold">Shows</span>
            <select className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-300">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search movies..."
              className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-300 w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">#</th>
              <th className="py-2 px-4 border-b text-left">Drama</th>
              <th className="py-2 px-4 border-b text-left">Actors</th>
              <th className="py-2 px-4 border-b text-left">Genres</th>
              <th className="py-2 px-4 border-b text-left">Synopsis</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-red-50">
              <td className="py-2 px-4 border-b">1</td>
              <td className="py-2 px-4 border-b">
                [2024] Japan - Eye Love You
              </td>
              <td className="py-2 px-4 border-b">
                Takuya Kimura, Takeuchi Yuko, Neinen Reina
              </td>
              <td className="py-2 px-4 border-b">
                Romance, Adventures, Comedy
              </td>
              <td className="py-2 px-4 border-b">
                I love this drama. It taught me a lot about money and finance.
                Love is not everything. We need to face the reality too. Being
                stoic is the best.
              </td>
              <td className="py-2 px-4 border-b">Unapproved</td>
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
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CMSDrama