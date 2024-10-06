import { create } from "zustand";

interface LoginStatusStoreType {
  username: string;
  login: (username: string) => void;
  logout: () => void;
}

const useLoginStatusStore = create<LoginStatusStoreType>((set) => {
  return {
    username: '',
    login: (username: string) => {
      set((store) => {
        return { username };
      });
    },
    logout: () => {
      set((store) => {
        return { username: '' };
      });
    }
  };
})

export default useLoginStatusStore;