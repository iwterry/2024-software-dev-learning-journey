interface Action {
  type: 'INCREMENT' | 'RESET';
}

export default function counterReducer(state: number, action: Action): number {
  // a reducer is a function that allows us to centralize state updates in a component
  // an action is an object that describes what the user is trying to do

  // a reducer to the current state and an action and returns the new state

  // although an action can be a string, by convention, it is a object that has a property called "type"
  //    - type should clearly describe the action the user is trying to take
  
  if (action.type === 'INCREMENT') {
    return state + 1;
  }

  if (action.type == 'RESET') {
    return 0;
  }

  // if the action type is something else we can do one of the following:
  //    - return the state
  //    - throw an error (since we are using TypeScript, this is not needed)
  
  return state;
}