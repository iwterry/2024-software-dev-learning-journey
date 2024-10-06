import { Todo } from "./useTodos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_FOR_TODOS } from '../constants';
import todoApiService from "../services/todoApiService";

interface TodoContext {
  previousSavedTodos: Todo[];
}

export default function useAddTodo() {
  const createTodo  = (unsavedNewTodo: Todo) => {
    return todoApiService
      .postData(unsavedNewTodo)
      .then((res) => res.data);
  };

  const handleBeforeMutate = (unsavedNewTodo: Todo) => {
    // save the todos before making any changes to the todos so that it is possible to restore
    const previousSavedTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_FOR_TODOS) || [];
    
    queryClient.setQueriesData<Todo[]> ( // perform optimistic update of the todos
      CACHE_KEY_FOR_TODOS,
      (todos) => todos ? [unsavedNewTodo, ...todos] : [unsavedNewTodo]
    );

    const todoContext: TodoContext = {
      previousSavedTodos
    };

    return todoContext; // returning the old todos so that they are available to the handler that handles errors if an error occurs
  };

  const handleSuccess = (savedNewTodo: Todo, unsavedNewTodo: Todo) => {
    console.log('saved', savedNewTodo);
    console.log('unsaved', unsavedNewTodo);

    // two options for updating the list ot todos on the client side:
    // 1) invalidating the cache (so that ReactQuery will refetch all the new data from the server)
    //   - to invalidate the cache, we first need access to the query client that can given by using useQueryClient hook
    //   - next we can do the following:
    //      queryClient.invalidateQueries({
    //        queryKey: ['todos']
    //      });
    //   - NOTE: this option does not work for the JSON Placeholder API because the API does not actually save our new todo
    // 2) directly updating the data in the cache
    //   - to update the data in cache, we first need access to the query client that can given by using useQueryClient hook
    //   - next we can do the following:
    queryClient.setQueriesData<Todo[]> (
      CACHE_KEY_FOR_TODOS,
      (todos) => {
        if (!todos) return [savedNewTodo];
        return todos.map((todo) => todo.id === unsavedNewTodo.id ? savedNewTodo : todo);
      }
    );
  };

  const handleError = (error: Error, unsavedNewTodo: Todo, context?: TodoContext) => {
    // context will contain what was returned from the handleBeforeMutate function

    queryClient.setQueryData<Todo[]>(
      CACHE_KEY_FOR_TODOS,
      () => context ? context.previousSavedTodos : []
    )
  };

  const queryClient = useQueryClient();

 return useMutation<
    Todo /* type of data expected back from server */ ,
    Error /* type of error expected */, 
    Todo /* type of data expected to send to server */,
    TodoContext /* type of data expected from the context */
  >({
    mutationFn: createTodo,  // used in this case to send data to the server to create a new todo by making use of Axios
    onMutate: handleBeforeMutate, // NOTE: handleBeforeMutate is called before createTodo.
                                  // used in this case for doing optimistic updates of the todos
    onSuccess: handleSuccess, // used in this case to replace the new todo inserted when doing optimistic updates with the new todo returned from the server
    onError: handleError // used in this case to restore the todos to the previous state before mutation occurred
  });

}