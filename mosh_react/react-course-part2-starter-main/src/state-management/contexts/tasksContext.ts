import React, { Dispatch } from "react";
import { Task, Action as TaskAction } from "../reducers/taskListReducer";

interface TasksContextType {
  state: Task[];
  dispatch: Dispatch<TaskAction>;
}

const TasksContext = React.createContext<TasksContextType>({} as TasksContextType);

export default TasksContext;