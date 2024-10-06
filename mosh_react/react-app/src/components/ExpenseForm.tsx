import ExpenseCategory from "../interfaces/ExpenseCategory";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Expense from "../interfaces/Expense";



const schema = z.object({
  description: z.string().min(3, {message: 'Desciption must be at least three characters'}),
  amount: z.number({invalid_type_error: "Amount is required"}).min(0),
  category: z.string().min(1, {message: 'Category is required'})
});

type FormData = z.infer<typeof schema>;

interface ExpenseFormProps {
  expenseCategories: ExpenseCategory[];
  onAddExpense: (data: FormData) => void;
}
export default function ExpenseForm({ expenseCategories, onAddExpense }: ExpenseFormProps) {
  const { handleSubmit, register, formState, reset} =  useForm<FormData>({ resolver: zodResolver(schema)});
  const { errors, isValid } = formState;

  const onValidSubmit = (data: FormData) => {
    console.log('submitted');
    onAddExpense(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)}>
      <div>
        <label htmlFor="description">Description</label>
        <input id="description" type="text" {...register('description') }/>
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      <div>
        <label htmlFor="amount">Amount</label>
        <input id="amount" type="number" step={0.01} min={0} {...register('amount', {valueAsNumber: true})} defaultValue="" />
        {errors.amount && <p>{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select id="category"  {...register('category')}>
          <option></option>
          { expenseCategories.map((expenseCategory) => (
            <option key={expenseCategory} value={expenseCategory}>{expenseCategory}</option>
          ))}
        </select>
        {errors.category && <p>{errors.category.message}</p>}
      </div>
      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  );
}