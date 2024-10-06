import { useQuery } from "@tanstack/react-query";
import { CACHE_KEY_FOR_TODOS } from "../constants";
import todoApiService from "../services/todoApiService";

export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

export default function useTodos() {
  const fetchTodos = () => {
    return todoApiService.getData()
      .then((res) => res.data);
  };

  // all errors in Axios is derived from Error
  const query = useQuery<Todo[], Error> ({
    queryKey: CACHE_KEY_FOR_TODOS,
    queryFn: fetchTodos,
    staleTime: 10_000 // all the settings using QueryClient in main.tsx file can be overrided on a per query basis.
                      // this is an example of doing such a thing
  });

  return query;
}