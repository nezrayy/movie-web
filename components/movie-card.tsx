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
    <div className="flex flex-row ml-2">
      <Image
        src={imageLink}
        alt="Deadpool"
        width={80}
        height={80}
      />
    </div>
  )
}

export default MovieCard