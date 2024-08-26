import Filter from "@/components/filter";
import MovieCard from "@/components/movie-card";

const SearchPage = () => {
  return (
    <div className="flex flex-col">
      <Filter />
      <MovieCard
        imageLink="/poster-example.jpg"
        title="Deadpool"
        releaseYear="2024"
        actors={["Hue"]}
        genres={["Action"]}
      />
    </div>
  )
}

export default SearchPage;