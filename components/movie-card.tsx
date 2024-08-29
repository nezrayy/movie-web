import Image from "next/image";

interface MovieCardProps {
  imageLink: string;
  title: string;
  releaseYear: string;
  genres: string[];
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
        <p className="text-sm text-white mt-1">{genres.join(', ')}</p>
        <p className="text-sm text-white mt-1">{actors.join(', ')}</p>
      </div>
    </div>

    
    // <div className="container mb-6">
    //   <Image
    //     src={imageLink}
    //     alt={title}
    //     className="rounded-xl"
    //     height={100}
    //     width={100}
    //   />
    //   <div>
    //     <h3 className="pt-4 font-bold text-white">
    //       {title} ({releaseYear})
    //     </h3>
    //   </div>
    //   <p className="text-balance text-sm text-white">{genres.join(', ')}</p>
    //   <p className="text-sm text-white">{actors.join(', ')}</p>
    // </div>
  )
}

export default MovieCard