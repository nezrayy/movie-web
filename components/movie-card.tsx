import Image from "next/image";

interface MovieCardProps {
  imageLink: string;
  title: string;
  releaseYear: string;
  genres: any;
  actors: any;
}

const MovieCard = ({
  imageLink,
  title,
  releaseYear,
  genres,
  actors
}: MovieCardProps) => {
  return (
    <div className="flex flex-col items-start p-4 rounded-lg shadow-lg h-fit text-white">
      {/* Bagian gambar di atas */}
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden relative mb-4 group-hover:opacity-60 transition-opacity duration-500 ease-in-out" style={{ aspectRatio: '3 / 4' }}>
      <img
          src={imageLink}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[102%]"
        />
      </div>

      {/* Bagian detail di bawah gambar */}
      <div className="w-full">
        <h2 className="text-lg font-bold leading-tight">{title}</h2>
        <p className="text-sm text-white">{releaseYear}</p>
        {genres.length > 0 && (
          <p className="text-sm text-white mt-1">
            {genres
              .filter((g: any) => g.genre) // Filter untuk memastikan genre ada
              .slice(0, 3) // Membatasi hanya 3 genre
              .map((g: any) => g.genre.name)
              .join(', ')}
          </p>
        )}
        {actors.length > 0 && (
          <p className="text-sm text-white mt-1">
            {actors
              .filter((a: any) => a.actor) // Memastikan hanya yang memiliki actor
              .slice(0, 5) // Membatasi hanya 5 actor
              .map((a: any) => a.actor.name) // Mapping nama actor
              .join(', ')} {/* Menggabungkan nama actor menjadi string */}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
