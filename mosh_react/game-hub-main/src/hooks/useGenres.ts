
import { useQuery } from "@tanstack/react-query";
import genres from "../data/genres";
import createApiService, { FetchResponse } from "../services/api-client";
import { Genre } from "../entities/Genre";

// const useGenres = () => ({ data: genres, isLoading: false, error: null })

// const useGenres = () => useData<Genre>("/genres");

const genresApiService = createApiService<Genre>('/genres');

const useGenres = () => {
  return useQuery<FetchResponse<Genre>>({
    queryKey: ['genres'],
    queryFn: () => genresApiService.getAll()
  });
};

export default useGenres;