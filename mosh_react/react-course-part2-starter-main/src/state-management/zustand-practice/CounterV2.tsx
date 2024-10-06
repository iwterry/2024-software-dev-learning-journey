import useCounterStore from './storeV2';

const Counter = () => {
  const { counter, increment, reset, resetMax } = useCounterStore();

  console.log('<Counter /> rendered');
  
  return (
    <div>
      Counter ({counter})
      <button
        onClick={increment}
        className="btn btn-primary mx-1"
      >
        Increment
      </button>
      <button
        onClick={reset}
        className="btn btn-primary mx-1"
      >
        Reset
      </button>
      <button
        onClick={resetMax}
        className="btn btn-primary mx-1"
      >
        Reset Max
      </button>
    </div>
  );
};

export default Counter;
