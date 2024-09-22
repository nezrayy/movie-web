import Image from "next/image";

interface MovieCardProps {
  imageLink: string;
  title: string;
  releaseYear: string;
  genres: any;
  actors: string[];
}

const MovieCard = ({
  imageLink,
  title,
  releaseYear,
  genres,
  actors
}: MovieCardProps) => {
  return (
    <div className="flex items-center p-4 rounded-lg shadow-lg h-fit text-white">
      <div className="w-1/3 bg-gray-200 rounded-lg overflow-hidden relative" style={{ aspectRatio: '3 / 4' }}>
        <Image
          src={imageLink}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="w-2/3 ml-4">
        <h2 className="text-lg font-bold leading-tight">{title}</h2>
        <p className="text-sm text-white">{releaseYear}</p>
        {genres.length > 0 && (
          <p className="text-sm text-white mt-1">
            {genres
              .filter((g: any) => g.genre) // Filter untuk memastikan genre ada
              .map((g: any) => g.genre.name)
              .join(', ')}
          </p>
        )}
        <p className="text-sm text-white mt-1">{actors.join(', ')}</p>
      </div>
    </div>
  )
}

export default MovieCard