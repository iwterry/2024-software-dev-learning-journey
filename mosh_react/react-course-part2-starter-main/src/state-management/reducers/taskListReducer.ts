export interface Task {
  id: number;
  title: string;
}

interface CreateTaskAction {
  type: 'CREATE';
  newTask: Task;
}

interface DeleteTaskAction {
  type: 'DELETE';
  idOfTaskToDelete: number;
}

export type Action = CreateTaskAction | DeleteTaskAction;

export default function taskListReducer(state: Task[], action: Action): Task[] {
  switch(action.type) {
    case "CREATE":
      return [ action.newTask, ...state ]; 
    case "DELETE":
      return state.filter((task) => task.id !== action.idOfTaskToDelete);
  }
}