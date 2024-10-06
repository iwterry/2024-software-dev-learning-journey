import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, {message: 'Name must be at least three characters'}),
  age: z.number({invalid_type_error: 'Age is required'}).min(18)
})


type FormData = z.infer<typeof schema>;


export default function Form() {
  const {register, handleSubmit, formState } = useForm<FormData>({resolver: zodResolver(schema)});
  const { errors, isValid } = formState;
    
  const onValidSubmit = (data: FieldValues) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onValidSubmit)}>
      <div>
        <label htmlFor="name">Name: </label> 
        <input
          id="name"
          type="text"
          { ...register('name') }
        />
        {errors.name && (
          <p>{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="age">Age: </label> 
        <input
          id="age"
          type="number"
          { ...register('age', {valueAsNumber: true}) }
        />
        {errors.age && (
          <p>{errors.age.message}</p>
        )}
      </div>
      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  );
}