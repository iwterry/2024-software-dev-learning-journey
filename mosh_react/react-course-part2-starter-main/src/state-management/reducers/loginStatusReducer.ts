export interface Action {
 type: 'LOGIN' | 'LOGOUT';
 username: string;
}

export default function loginStatusReducer(state: string, action: Action):string {
  return action.username;
}