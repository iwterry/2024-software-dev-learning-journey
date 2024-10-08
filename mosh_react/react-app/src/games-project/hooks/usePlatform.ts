import useData from "./useData";

export interface Platform {
  id: number;
  name: string;
  slug: string;
}
export default function usePlatform() {
  return useData<Platform>('platforms/lists/parents');
}