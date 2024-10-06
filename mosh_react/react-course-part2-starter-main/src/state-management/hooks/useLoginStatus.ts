import { useContext } from "react";
import LoginStatusContext from "../contexts/loginStatusContext";

export default function useLoginStatus() {
  return useContext(LoginStatusContext);
}