import useGames from "../hooks/useGames";
import { Genre } from "../hooks/useGenres";
import GameCard from "./GameCard";

interface GameGridProps {
  selectedGenre: Genre | null;
  selectedPlatformId: number | null;
  selectedSortOption: string | null;
  searchQuery: string;
}

export default function GameGrid( { selectedGenre, selectedPlatformId, selectedSortOption, searchQuery }:GameGridProps) {
  const { data: games, error } = useGames(selectedGenre, selectedPlatformId, selectedSortOption, searchQuery);
  

  return (
    <>
      {error && <p>{error}</p>}
      <ul>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </ul>
    </>
  );
}