import { useRef } from 'react';
import useAddTodo from './hooks/useAddTodo';



const TodoForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const {
    mutate,
    error,
    isError,
    isLoading, 
  } = useAddTodo();
  
  return (
    <>
      {isError && <p>{error.message}</p>}
      <form className="row mb-3" onSubmit={(event) => {
        event.preventDefault();

        if (!ref.current || ref.current.value.length === 0) return;

        mutate({
          id: -1,
          title: ref.current.value,
          userId: 1,
          completed: false
        });
      }}>
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading' : 'Add'}  
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
