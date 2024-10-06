import React, { Dispatch } from "react";
import { Action as LoginStatusAction } from "../reducers/loginStatusReducer";

interface LoginStatusContextType {
  state: string;
  dispatch: Dispatch<LoginStatusAction>;
}

const LoginStatusContext = React.createContext<LoginStatusContextType>({} as LoginStatusContextType);
export default LoginStatusContext;