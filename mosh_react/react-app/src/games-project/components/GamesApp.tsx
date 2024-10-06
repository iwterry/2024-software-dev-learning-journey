import { useState } from "react";
import GameGrid from "./GameGrid";
import GenreList from "./GenreList";
import { Genre } from "../hooks/useGenres";
import PlatformSelector from "./PlatformSelector";
import SortSelector from "./SortSelector";
import SearchInput from "./SearchInput";

export default function GamesApp() {
  const [selectedGenre, setSelectedGenre] = useState<Genre|null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number|null>(null);
  const [selectedSortOption, setSelectedSortOption] = useState<string|null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <>
      <SearchInput onSearch={(query) => setSearchQuery(query)} />
      <GenreList onSelectGenre={(genre) => setSelectedGenre(genre)} selectedGenre={selectedGenre} />
      <PlatformSelector onSelectPlatform={(platformId) => setSelectedPlatform(platformId)}/>
      <SortSelector onSelectSortOption={(selectedSortOption) => setSelectedSortOption(selectedSortOption)}/>
      <GameGrid
        selectedGenre={selectedGenre}
        selectedPlatformId={selectedPlatform}
        selectedSortOption={selectedSortOption}
        searchQuery={searchQuery}
      />
    </>
  )
}