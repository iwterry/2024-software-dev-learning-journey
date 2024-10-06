import { Todo } from "../hooks/useTodos";
import createService from "./genericApiService";

export default createService<Todo>('todos');