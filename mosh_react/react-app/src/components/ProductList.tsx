import { useEffect, useState } from "react";

interface ProductListProps {
  category: string;
}

export default function ProductList({ category } : ProductListProps) {
  const [ products, setProducts ] = useState<string[]>([]);

  useEffect(() => {
    console.log('Fetching products in ', category);
    setProducts(['Clothing', 'Household']);
  }, [category]);

  return (
    <>
      <div>Product List</div>
      <p>{category}</p>
    </>
  );
}