import { useQuery } from "@tanstack/react-query";
import createApiService from "../services/api-client";
import { GameDetail } from "../entities/GameDetail";

export default function useGame(gameSlug: string) {
  const gameApiService = createApiService<GameDetail>(`/games/${gameSlug}`);
  return useQuery<GameDetail, Error>({
    queryKey: ['games', gameSlug ],
    queryFn: () => {
      return gameApiService.getOne();
    }
  })
}