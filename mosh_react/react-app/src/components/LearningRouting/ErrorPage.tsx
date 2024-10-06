import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const routeError = useRouteError();
  const isUserAccessingWrongWebPage = isRouteErrorResponse(routeError);
  return (
    <>
      {isUserAccessingWrongWebPage && <div>Error Page: 4xx</div> }
      {!isUserAccessingWrongWebPage && <div>Error Page: 5xx</div> }
    </>
  );
}