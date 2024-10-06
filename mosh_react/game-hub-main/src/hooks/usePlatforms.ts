
import { useQuery } from "@tanstack/react-query";
import platforms from "../data/platforms";
import createApiService, { FetchResponse } from "../services/api-client";
import { Platform } from "../entities/Platform";

// const usePlatforms = () => ({ data: platforms, isLoading: false, error: null });

const platformsApiService = createApiService<Platform>('/platforms/lists/parents');

const usePlatforms = () => {
  return useQuery<FetchResponse<Platform>>({
    queryKey: ['platforms'],
    queryFn: () => platformsApiService.getAll()
  })
};

export default usePlatforms;
