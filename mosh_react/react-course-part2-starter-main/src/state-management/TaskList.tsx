import useTasks from './hooks/useTasks';

const TaskList = () => {
  const { state, dispatch } = useTasks();

  return (
    <>
      <button
        onClick={() => dispatch({ type: 'CREATE', newTask: { id: Date.now(), title: 'Task ' + Date.now() }})}
        className="btn btn-primary my-3"
      >
        Add Task
      </button>
      <ul className="list-group">
        {state.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span className="flex-grow-1">{task.title}</span>
            <button
              className="btn btn-outline-danger"
              onClick={() => dispatch({ type: 'DELETE', idOfTaskToDelete: task.id })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
