import { useContext } from "react";
import TasksContext from "../contexts/tasksContext";

export default function useTasks() {
  return useContext(TasksContext);
}