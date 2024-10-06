import { useInfiniteQuery } from "@tanstack/react-query";
import { GameQuery } from "../stores/GameQueryStore";
import createApiService, { FetchResponse } from "../services/api-client";
import { Game } from "../entities/Game";


// const useGames = (gameQuery: GameQuery) =>
//   useData<Game>(
//     "/games",
//     {
//       params: {
//         genres: gameQuery.genre?.id,
//         platforms: gameQuery.platform?.id,
//         ordering: gameQuery.sortOrder,
//         search: gameQuery.searchText
//       },
//     },
//     [gameQuery]
//   );

const gamesApiService = createApiService<Game>('/games');

const useGames = (gameQuery: GameQuery) => {
  const dependencies = {
    genres: gameQuery.genreId,
    parent_platforms: gameQuery.platformId,
    ordering: gameQuery.sortOrder,
    search: gameQuery.searchText,
    page_size: 9       
  };

  return useInfiniteQuery<FetchResponse<Game>, Error>({
    queryKey: ['games', dependencies],
    queryFn: ({ pageParam = 1 }) => {
      return gamesApiService.getAll({
         params: {
          ...dependencies,
          page: pageParam
         }
      })
    },
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    }
  })
}

export default useGames;
