import { ReactNode, useReducer } from "react";
import loginStatusReducer from "../reducers/loginStatusReducer";
import LoginStatusContext from "../contexts/loginStatusContext";

interface LoginStatusProviderProps {
  children: ReactNode;
}

export default function LoginStatusProvider({ children }: LoginStatusProviderProps) {
 const [state, dispatch] = useReducer(loginStatusReducer, '');

 return (
  <LoginStatusContext.Provider value={{ state, dispatch }}>
    { children }
  </LoginStatusContext.Provider>
 )
}