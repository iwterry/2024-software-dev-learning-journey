import Expense from "../interfaces/Expense";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (idOfExpenseToDelete: number) => void
}

export default function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const totalExpenseAmount = expenses
    .map(({ amount }) => amount)
    .reduce((accum, amount) => amount + accum, 0);

  return (
    <div>
      <div>
        <div>Description</div>
        <div>Amount</div>
        <div>Category</div>
        <div>Action</div>
      </div>
      <div>
        {expenses.map((expense) => (
          <div key={expense.id}>
            <div>{expense.description}</div>
            <div>${expense.amount.toFixed(2)}</div>
            <div>{expense.category}</div>
            <div>
              <button onClick={() => onDelete(expense.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        Total: ${totalExpenseAmount.toFixed(2)}
      </div>
    </div>
  );
}