import { Category, Product } from "../../src/entities";

export const products = new Map<number, Product>([
  [1, { id: 1, name: 'Product 1', price: 1, categoryId: 1 }],
  [2, { id: 2, name: 'Product 2', price: 2, categoryId: 2 }],
  [3, { id: 3, name: 'Product 3', price: 3, categoryId: 1 }],
]);

export const categories: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Beauty' },
  { id: 3, name: 'Gardening' },
];
