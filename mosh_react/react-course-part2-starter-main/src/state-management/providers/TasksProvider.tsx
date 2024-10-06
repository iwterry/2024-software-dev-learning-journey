import { ReactNode, useReducer } from "react";
import taskListReducer from "../reducers/taskListReducer";
import TasksContext from "../contexts/tasksContext";

interface TasksProviderProps {
  children: ReactNode;
}

export default function TasksProvider({ children }: TasksProviderProps) {
   const [ state, dispatch ]  = useReducer(taskListReducer, []);

   return (
    <TasksContext.Provider value={{ state, dispatch }}>
      { children }
    </TasksContext.Provider>
   )
}