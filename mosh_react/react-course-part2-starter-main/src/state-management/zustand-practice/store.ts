import { create } from "zustand";

interface CounterStore {
  counter: number;
  increment: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => {
  return {
    counter: 0,
    increment: () => {
      set((store) => {
        return {
          counter: store.counter + 1
        };
      });
    },
    reset: function() {
      set((store) => {
        return {
          counter: 0
        };
      });
    }
  }
});

export default useCounterStore;