import ExpenseCategory from "./ExpenseCategory";

export default interface Expense {
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
}

