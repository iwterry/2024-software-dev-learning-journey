import { useLocation, useParams, useSearchParams } from "react-router-dom"

export default function User() {
  const params = useParams();
  console.log(params);

  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  // assuming query string is ?weight=200&color=blue
  console.log(searchParams.get('weight')); // "200"
  console.log(searchParams.get('height')); // null

  const location = useLocation();
  console.log(location);
  
  return (
    <>
      <p>Specific user page</p>
    </>
  )
} 