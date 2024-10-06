import usePlatforms from "./usePlatforms";

export default function usePlatform(platformId: number | null) {
  // if (platformId == null) return null;

  const { data } = usePlatforms();
  const platform = data?.results.find((platform) => platform.id === platformId);
  return platform || null;
}