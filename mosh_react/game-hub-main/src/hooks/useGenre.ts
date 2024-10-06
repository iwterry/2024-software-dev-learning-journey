import useGenres from "./useGenres";

export default function useGenre(genreId: number | null) {
  // if (genreId == null) return null;

  const { data } = useGenres();
  const genre = data?.results.find((genre) => genre.id === genreId);
  return genre || null;
}