import { create } from "zustand";

export interface GameQuery {
  genreId: number | null;
  platformId: number | null;
  sortOrder: string;
  searchText: string;
}

interface GameQueryStoreType { 
  gameQuery: GameQuery;
  selectGenreId: (genreId: number) => void;
  selectPlatformId: (platformId: number) => void;
  selectSortOrder: (sortOrder: string) => void;
  search: (searchText: string) => void;
}

const useGameQueryStore = create<GameQueryStoreType>((set) => {
  return {
    gameQuery: {
      genreId: null,
      platformId: null,
      searchText: '',
      sortOrder: ''
    },
    selectGenreId: (genreId: number) => {
      set((store) => {
        return { gameQuery: { ...store.gameQuery, genreId } };
      });
    },
    selectPlatformId: (platformId: number) => {
      set((store) => {
        return { gameQuery: { ...store.gameQuery, platformId } };
      });
    },
    selectSortOrder: (sortOrder: string) => {
      set((store) => {
        return { gameQuery: { ...store.gameQuery, sortOrder } };
      });
    },
    search: (searchText: string) => {
      set((store) => {
        return { gameQuery: { ...store.gameQuery, searchText } };
      });
    }
  }
});

export default useGameQueryStore;