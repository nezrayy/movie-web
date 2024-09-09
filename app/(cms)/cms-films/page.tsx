import MovieApproveModal from "@/components/movie-approve-modal"
import SelectElement from "@/components/select-element"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"

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
          <span className="text-white font-semibold">Filter:</span>
          {/* <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-white">
            <option>Unapproved</option>
            <option>Approved</option>
          </select> */}
          <SelectElement 
            label="Status"
            elements={['Unapproved', 'Approved']}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            {/* <span className="text-white font-semibold">Shows</span> */}
            <SelectElement 
              label="Shows"
              elements={['10', '25', '50', '100']}
            />
          </div>
          <div className="w-full sm:w-auto">
            {/* <input
              type="text"
              placeholder="Search movies..."
              className="border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-300 w-full"
            /> */}
            <Input 
              type="text"
              placeholder="Search movies..."
              className="w-full bg-[#0C0D11] text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Drama</TableHead>
              <TableHead>Actors</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Synopsis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movieSample.map((movie, index) => (
              <TableRow key={index} className="text-white">
                <TableCell className="font-medium">{index+1}</TableCell>
                <TableCell>[{movie.releaseYear}] {movie.title}</TableCell>
                <TableCell>{movie.actors.join(', ')}</TableCell>
                <TableCell>{movie.genres.join(', ')}</TableCell>
                <TableCell>{movie.synopsis}</TableCell>
                <TableCell>
                  [{movie.status}]
                  <MovieApproveModal 
                    releaseYear={movie.releaseYear}
                    title={movie.title}
                    actors={movie.actors}
                    genres={movie.genres}
                    synopsis={movie.synopsis}
                    availability={movie.availability}
                  />
                </TableCell>
                <TableCell className="justify-center items-center flex mt-4 space-x-2">
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    <Pencil  className="h-5 w-5"/>
                  </span>
                  <span className="text-red-600 hover:underline cursor-pointer">
                    <Trash2 className="w-5 h-5" />
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