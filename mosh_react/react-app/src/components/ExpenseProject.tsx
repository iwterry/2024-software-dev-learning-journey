import { useState } from "react";
import Expense from "../interfaces/Expense";
import ExpenseTable from "./ExpenseTable";
import ExpenseFilterSelector from "./ExpenseFilterSelector";
import ExpenseCategory from "../interfaces/ExpenseCategory";
import ExpenseForm from "./ExpenseForm";
let counter = 4;
export default function ExpenseProject() {
  const [ expenses, setExpenses ] = useState<Expense[]>([
    {
      id: 1,
      description: 'Milk',
      amount: 5,
      category: 'Groceries'
    },
    {
      id: 2,
      description: 'Electricity',
      amount: 100,
      category: 'Utilities'
    },
    {
      id: 3,
      description: 'Movies',
      amount: 15,
      category: 'Entertainment'
    },
  ])

  const handleDelete = (idOfExpenseToDelete: number) => {
    setExpenses(expenses.filter(({ id: expenseId }) => expenseId !== idOfExpenseToDelete ))
  };

  const expenseCategories: ExpenseCategory[] = [
    "Groceries",
    "Utilities",
    "Entertainment"
  ];

  const [ selectedFilter, setSelectedFilter ] = useState<''|ExpenseCategory>('');

  const selectedExpenses = selectedFilter === '' ? expenses : expenses.filter(({ category }) => category === selectedFilter);



  return (
    <>
      <ExpenseForm
        expenseCategories={expenseCategories}
        onAddExpense={(data) => setExpenses([
          ...expenses, 
          {...data, id: counter++ } as Expense
        ])}
      />
      <ExpenseFilterSelector
        expenseCategories={expenseCategories}
        selectedFilter={selectedFilter}
        onChangeFilter={(val) => setSelectedFilter(val)}
      />
      { selectedExpenses.length > 0 && (
        <ExpenseTable expenses={selectedExpenses} onDelete={handleDelete} />
      )}
    </>
  );
}