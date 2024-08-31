import MovieApproveModal from "@/components/movie-approve-modal"

const movieSample = [
  {
    id: 1,
    releaseYear: "2024",
    title: 'Japan - Eye Love You',
    actors: ['ilham', 'kurniawan'],
    genres: ['Romance', 'Adventures', 'Comedy'],
    synopsis:
      'I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best. I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best. I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best.',
    status: 'Unapproved',
    availability: 'Fansub: @aoisub on X',
  },
  {
    id: 2,
    releaseYear: "2022",
    title: 'Nothing',
    actors: ['Takuya Kimura', 'Takeuchi Yuko', 'Neinen Reina'],
    genres: ['Romance', 'Adventures', 'Comedy'],
    synopsis:
      'I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best.',
    status: 'Unapproved',
    availability: 'Fansub: @aoisub on X',
  },
]

const CMSDrama = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto mt-10">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <span className="text-white font-semibold">Filtered by:</span>
          <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-white">
            <option>Unapproved</option>
            <option>Approved</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">Shows</span>
            <select className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300">
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
              className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
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
            {movieSample.map((movie, index) => (
              <tr className="bg-red-50" key={movie.id}>
                <td className="py-2 px-4 border-b">{index+1}</td>
                <td className="py-2 px-4 border-b">
                  [{movie.releaseYear}] {movie.title}
                </td>
                <td className="py-2 px-4 border-b">
                  {movie.actors.join(', ')}
                </td>
                <td className="py-2 px-4 border-b">
                  {movie.genres.join(', ')}
                </td>
                <td className="py-2 px-4 border-b">
                  {movie.synopsis}
                </td>
                <td className="py-2 px-4 border-b">
                  {movie.status}
                  <MovieApproveModal 
                    releaseYear={movie.releaseYear}
                    title={movie.title}
                    actors={movie.actors}
                    genres={movie.genres}
                    synopsis={movie.synopsis}
                    availability={movie.availability}
                  />
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