import { useReducer } from 'react';
import './App.css';
import PostList from './react-query/PostList';
import TodoForm from './react-query/TodoForm';
import TodoList from './react-query/TodoList';
import Counter from './state-management/Counter';
import LoginStatus from './state-management/LoginStatus';
import TaskList from './state-management/TaskList';
import taskListReducer from './state-management/reducers/taskListReducer';
import NavBar from './state-management/NavBar';
import HomePage from './state-management/HomePage';
import TasksContext from './state-management/contexts/tasksContext';
import LoginStatusContext from './state-management/contexts/loginStatusContext';
import loginStatusReducer from './state-management/reducers/loginStatusReducer';
import LoginStatusProvider from './state-management/providers/LoginStatusProvider';
import TasksProvider from './state-management/providers/TasksProvider';
import ZustandApp from './state-management/zustand-practice/ZustandApp';

function App() {
  // return <TodoList />;
  // return <PostList />;
  // return (
  //   <>
  //     <TodoForm />
  //     <TodoList />
  //   </>
  // );

  // return <Counter />;

  // return <TaskList />;

  // return <LoginStatus />;

/*
  const [ taskState, taskDispatch ] = useReducer(taskListReducer, []);
  const [ loginStatusState, loginStatusDispatch ] = useReducer(loginStatusReducer, '');

  return (
    <TasksContext.Provider value={{ state: taskState, dispatch: taskDispatch }}>
      <LoginStatusContext.Provider value={{ state: loginStatusState, dispatch: loginStatusDispatch }}>
        <NavBar />
      </LoginStatusContext.Provider>
      <HomePage />
    </TasksContext.Provider>
  );
*/

  // return (
  //   <TasksProvider>
  //     <LoginStatusProvider>
  //       <NavBar />
  //     </LoginStatusProvider>
  //     <HomePage />
  //   </TasksProvider>
  // );

  return <ZustandApp />
}

export default App;
