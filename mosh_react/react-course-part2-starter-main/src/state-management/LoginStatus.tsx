import { useContext, useReducer, useState } from "react";
import loginStatusReducer from "./reducers/loginStatusReducer";
import LoginStatusContext from "./contexts/loginStatusContext";
import useLoginStatus from "./hooks/useLoginStatus";

const LoginStatus = () => {
   const { state, dispatch } = useLoginStatus();

  if (state)
    return (
      <>
        <div>
          <span className="mx-2">{state}</span>
          <a onClick={() => dispatch({ type: "LOGOUT", username: '' })} href="#">
            Logout
          </a>
        </div>
      </>
    );
  return (
    <div>
      <a onClick={() => dispatch({ type: "LOGIN", username: 'mosh.hamedani' })} href="#">
        Login
      </a>
    </div>
  );
};

export default LoginStatus;
