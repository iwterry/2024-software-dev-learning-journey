import { useReducer } from 'react';
import counterReducer from './reducers/counterReducer';

const Counter = () => {
  // const [value, setValue] = useState(0);
 const [state, dispatch] = useReducer(counterReducer, 0);
 // dispatch is a function for triggering changes; it dispatches an action

  return (
    <div>
      Counter ({state})
      <button
        onClick={() => dispatch({ type: 'INCREMENT'})}
        className="btn btn-primary mx-1"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch({ type: 'RESET' })}
        className="btn btn-primary mx-1"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;
