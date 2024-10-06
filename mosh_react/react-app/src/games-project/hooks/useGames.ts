import useData from "./useData";
import { Genre } from "./useGenres";
import { Platform } from "./usePlatform";


export interface Game {
  id: number;
  name: string;
  background_image: string;
  parent_platforms: { platform: Platform } [];
  metacritic: number;
}

export default function useGames(
  selectedGenre: Genre | null,
  selectedPlatformId: number | null,
  selectedSortOption: string | null,
  searchQuery: string
) {
  const queryParams: {[key: string]: string } = {};

  if (selectedGenre) queryParams.genres = selectedGenre.id.toString();
  if (selectedPlatformId != null) queryParams.parent_platforms = selectedPlatformId.toString();
  if (selectedSortOption != null) queryParams.ordering = selectedSortOption;
  queryParams.search = searchQuery;

  return useData<Game>('games', queryParams, [selectedGenre?.id, selectedPlatformId, selectedSortOption, searchQuery]);
}