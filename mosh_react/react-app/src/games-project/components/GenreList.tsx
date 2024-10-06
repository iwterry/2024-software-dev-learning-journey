import useGenres, { Genre } from "../hooks/useGenres";

interface GenreListProps {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

export default function GenreList({ onSelectGenre, selectedGenre }: GenreListProps) {
  const { data: genres, error } = useGenres();
  if (error) return null;

  return (
    <>
      <ul>
        {genres.map((genre) => {
          return (
            <li key={genre.id} className={ genre.id === selectedGenre?.id ? "selected-genre" : ""}>
              <img src={genre.image_background} style={{width: "32px", height: "32px", objectFit: "cover", marginRight: "5px"}}/>
              <button onClick={() => onSelectGenre(genre)}>{genre.name}</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}