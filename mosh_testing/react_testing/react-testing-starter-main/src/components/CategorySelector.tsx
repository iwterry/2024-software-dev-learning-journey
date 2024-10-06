import { useQuery } from "react-query";
import { Category } from "../entities";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Select } from "@radix-ui/themes";

interface CategoriesProps {
  setSelectedCategoryId: (categoryId: number) => void;
}

export default function CategorySelector({ setSelectedCategoryId }: CategoriesProps) {
  const {
    data: categories,
    error,
    isLoading
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => {
      return  axios.get<Category[]>("/categories")
        .then((res) => res.data);
    }
  });

  if (isLoading) return (
    <div role="progressbar" aria-label="Loading categories">
      <Skeleton />
    </div>
  );

  if (error) return null;
  
  return  (
    <Select.Root
      onValueChange={
        (categoryId) => setSelectedCategoryId(parseInt(categoryId))
      }
    >
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categories!.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}