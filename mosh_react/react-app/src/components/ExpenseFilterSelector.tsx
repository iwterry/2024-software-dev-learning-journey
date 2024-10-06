import ExpenseCategory from "../interfaces/ExpenseCategory";

interface ExpenseFilterSelectorProps {
  selectedFilter: ExpenseCategory | '';
  onChangeFilter: (value: ExpenseCategory | '') => void;
  expenseCategories: ExpenseCategory[];
}

export default function ExpenseFilterSelector({
  selectedFilter, onChangeFilter, expenseCategories 
} : ExpenseFilterSelectorProps) {

  return (
    <select value={selectedFilter} onChange={(event) => {
      const selectedCategory = event.target.value as ExpenseCategory;
      onChangeFilter(selectedCategory);
    }}>
      <option value="">All categories</option>
      {expenseCategories.map((category) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  );
}