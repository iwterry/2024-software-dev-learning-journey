import useCounterStore from "./storeV2";

export default function CounterInfo() {
  const maxCounter = useCounterStore((store) => store.maxCounter);

  console.log('<CounterInfo /> rendered'); 

  return (
    <div>
      max Counter:  { maxCounter }
    </div>
  )
}