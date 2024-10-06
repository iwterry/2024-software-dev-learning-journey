import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      {!Boolean(children) && <Outlet />}
      {Boolean(children) && children }
    </>
  );
}