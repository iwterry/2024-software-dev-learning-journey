interface SortSelectorProps {
  onSelectSortOption: (sortOption: string | null) => void;
}

export default function SortSelector({ onSelectSortOption } : SortSelectorProps) {
  return (
    <>
      <select onChange={(event) => onSelectSortOption(event.target.value === '' ? null : event.target.value)}>
        <option value="">Order by</option>
        <option value="-added">Date added</option>
        <option value="name">Name</option>
        <option value="-released">Release date</option>
        <option value="-metacritic">Popularity</option>
        <option value="-rating">Average rating</option>
      </select>
    </>
  );
}