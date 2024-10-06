import { create } from "zustand";

interface CounterStore {
  counter: number;
  maxCounter: number;
  increment: () => void;
  reset: () => void;
  resetMax: () => void;
}

const useCounterStore = create<CounterStore>((set) => {
  return {
    counter: 0,
    maxCounter: 10,
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
    },
    resetMax: function() {
      set(() => {
        return {
          maxCounter: 0
        }
      })
    }
  }
});

export default useCounterStore;