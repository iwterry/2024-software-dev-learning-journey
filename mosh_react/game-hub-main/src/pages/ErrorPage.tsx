import { isRouteErrorResponse, useRouteError } from "react-router-dom"

export default function ErrorPage() {
  // get details about the error
  const routeError =  useRouteError();

  // check to see if the error is a routing error
  const isRoutingError = isRouteErrorResponse(routeError); 

  if (isRoutingError) {
    return <p>Oops, this page does not exists.</p>;
  }

  // if not a routing error, then it is an application error
  return <p>Sorry, an unexpected error occurred.</p>
  
}