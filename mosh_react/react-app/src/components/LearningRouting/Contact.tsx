import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      navigate('/');
    }}>
      <button type="submit">Submit</button>
    </form>
  );
}