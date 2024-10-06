import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = false;

  return (
    <>
      { !isAuthenticated && (
        <Navigate to='/login' />
      )}
      { isAuthenticated && (
        <Outlet />
      )}
    </>
  )
}