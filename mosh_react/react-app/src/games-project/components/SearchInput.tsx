import { FormEventHandler, useRef } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export default function SearchInput({ onSearch } : SearchInputProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit : FormEventHandler = (event) => {
    event.preventDefault();

    if (searchInputRef.current) {
      onSearch(searchInputRef.current.value);
    }

  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="search" name="search" ref={searchInputRef}/>
      </form>
    </>
  );
}