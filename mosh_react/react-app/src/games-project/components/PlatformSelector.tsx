import usePlatform from "../hooks/usePlatform";

interface PlatformSelectorProps {
  onSelectPlatform: (platformId: number | null) => void;
}
export default function PlatformSelector({ onSelectPlatform } : PlatformSelectorProps) {
  const { data: platforms, error } = usePlatform();

  if(error) return null;

  return (
    <>
      <select onChange={(event) => onSelectPlatform(event.target.value === '' ? null : Number.parseInt(event.target.value))}>
        <option value="">Platforms</option>
        {platforms.map((platform) => (
          <option key={platform.id} value={platform.id}>
            {platform.name}
          </option>
        ))}
      </select>
    </>
  );
}